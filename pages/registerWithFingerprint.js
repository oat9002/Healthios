import React from 'react';
import Head from 'next/head';
import LoadingTemplate from '../components/loadingTemplate';
import Router, { withRouter } from 'next/router';
import axios from 'axios';
import * as Logging from '../services/logging';
import cryptoJS from 'crypto-js';
import * as Config from '../static/appConfig.json';

class RegisterWithFingerprint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextState: false,
      isRegister: false
    };
    this.pageTimeout = null;
    this.retryTimeout = null;
    this.isStart = false;
  }

  componentDidMount() {
    this.process();
    this.pageTimeout = setTimeout(() => {
      Router.replace('/');
    }, Config.pageTimeout);
  }

  componentWillUnmount() {
    clearTimeout(this.pageTimeout);
    clearTimeout(this.retryTimeout);
  }

  process = async () => {
    let urlStartReadFingerprint = Config.piIp + '/finger/start/template';
    let urlReadFingerprint = Config.piIp + '/finger/valid/template1';
    let urlReadFingerprint2 = Config.piIp + '/finger/valid/template2';
    let urlIsFinish = Config.piIp + '/finger/template';
    let urlRegister = Config.serverIp + '/api/auth/register';

    if (!this.isStart) {
      try {
        const resStartReadFingerprint = await axios.get(urlStartReadFingerprint);

        if (resStartReadFingerprint === undefined || !resStartReadFingerprint.data.status) {
          throw new Error(`Fingerprint read failed, status: ${resStartReadFingerprint.data.status}`);
        }

        this.isStart = true;
      }
      catch (ex) {
        Logging.sendLogMessage('RegisterWithFingerprint', ex);
      }

      this.retryProcess();
    }
    else {
      try {
        const resReadFingerprint = await axios.get(urlReadFingerprint);

        if (resReadFingerprint === undefined || !resReadFingerprint.data.status) {
          throw new Error(`Fingerprint read failed, status: ${resReadFingerprint.data.status}`);
        }

        if (!this.state.nextState) {
          this.setState({
            nextState: true
          });
        }

        const resReadFingerprint2 = await axios.get(urlReadFingerprint2);
        if (resReadFingerprint2 === undefined || !resReadFingerprint2.data.status) {
          throw new Error(`Fingerprint 2nd read failed, status: ${resReadFingerprint2.data.status} `);
        }

        const resIsFinish = await axios.get(urlIsFinish);
        if (resIsFinish === undefined || !resIsFinish.data.status) {
          throw new Error(`Finger doesn't finsish reading, status: ${resIsFinish.data.status}`);
        }

        if (!this.state.isRegister) {
          this.setState({
            isRegister: true
          });
        }

        const resRegister = await axios.post(urlRegister,
          {
            ...JSON.parse(cryptoJS.AES.decrypt(sessionStorage.getItem('patientData'), Config.aesSecret).toString(cryptoJS.enc.Utf8)),
            'fingerPrint': [resIsFinish.data.data]
          },
          {
            headers: {
              'X-Station-Key': Config.stationKey,
              'X-Provider-Key': Config.providerKey
            }
          }
        );

        if (resRegister === undefined || resRegister.data.error) {
          throw new Error('Fingerprint register failed.');
        }

        if (typeof (Storage) !== undefined) {
          sessionStorage.setItem('registerResult', JSON.stringify(resRegister.data));
          sessionStorage.setItem('firstTime', JSON.stringify({
            isFirstTime: resRegister.data.data.firsttime,
            firstTimeKey: resRegister.data.data.firstTimeKey
          }));
        }

        Router.replace('/registerComplete');
      }
      catch (err) {
        Logging.sendLogMessage('RegisterWithFingerprint', err);
        this.retryProcess();
      }
    }
  }

  retryProcess = () => {
    this.retryTimeout = setTimeout(this.process, Config.retryTimeout);
  }

  render() {
    return (
      <div className='content'>
        <Head>
          <link href="https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai" rel="stylesheet" />
          <link href="/static/css/animate.css" rel="stylesheet" />
        </Head>
        {
          !this.state.isRegister ? (
            !this.state.nextState ?
              (
                <div>
                  <span>กรุณา<span className='emph'>แตะ</span>นิ้วบนเครื่องแสกนลายนิ้วมือ</span>
                  <br />
                  <img className='pulse animated infinite' src="/static/pics/fingerprints.svg" />
                </div>
              ) : (
                <div>
                  <span>กรุณา<span className='emph'>แตะ</span>นิ้วบนเครื่องแสกนลายนิ้วมือ<span className='emph'>อีกครั้ง</span></span>
                  <br />
                  <img className='pulse animated infinite' src="/static/pics/fingerprints.svg" />
                </div>
              )
          ) : (
            <LoadingTemplate text='กำลังลงทะเบียนด้วยลายนิ้วมือ...'></LoadingTemplate>
          )
        }

        <style jsx>{`
          img {
            heigh: auto;
            width: 30%;
          }
          span {
            font-size: 4em;
          }
          .emph {
            font-size: 2em;
            font-weight: bold;
          }
          `}</style>
        <style jsx global>{`
            .content {
              text-align: center;
              margin-top: 13%;
            }
            body {
              font-family: Kanit;
              font-weight: 200;
              color: #393939;
              animation: fadein 1s;
              background-color: #f7f7f7;
            }
            @keyframes fadein {
                from { opacity: 0; };
                to   { opacity: 1; };
            }
          `}</style>
      </div>
    );
  }
}

export default withRouter(RegisterWithFingerprint);
