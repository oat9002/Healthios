import React from 'react';
import Head from 'next/head';
import LoadingTemplate from '../components/loadingTemplate';
import Router from 'next/router';
import axios from 'axios';
import * as Logging from '../services/logging';

const configJson = import('../static/appConfig.json');

export default class RegisterWithFingerprint extends React.Component {
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

  static async getInitialProps({ req, query }) {
    const config = await configJson
    return { config }
  }

  componentDidMount() {
    this.process();
    this.pageTimeout = setTimeout(() => {
      Router.replace('/');
    }, this.props.config.pageTimeout)
  }

  componentWillUnmount() {
    clearTimeout(this.pageTimeout);
    clearTimeout(this.retryTimeout);
  }

  process = async() => {
    let urlStartReadFingerprint = this.props.config.piIp + '/finger/start/template';
    let urlReadFingerprint = this.props.config.piIp + '/finger/valid/template1';
    let urlReadFingerprint2 = this.props.config.piIp + '/finger/valid/template2';
    let urlIsFinish = this.props.config.piIp + '/finger/template';
    let urlRegister = this.props.config.serverIp + '/api/auth/register';

    if(!this.isStart) {
      try {
        const resStartReadFingerprint = await axios.get(urlStartReadFingerprint);

        if(resStartReadFingerprint === undefined || !resStartReadFingerprint.data.status) {
          throw new Error(`Fingerprint read failed, status: ${ resStartReadFingerprint.data.status }`);
        }

        this.isStart = true;
      }
      catch(ex) {
        Logging.sendLogMessage('RegisterWithFingerprint', ex);
      }

      this.retryProcess();
    }
    else {
      try {
        const resReadFingerprint = await axios.get(urlReadFingerprint);

        if(resReadFingerprint === undefined || !resReadFingerprint.data.status) {
          throw new Error(`Fingerprint read failed, status: ${ resReadFingerprint.data.status }`);
        }

        if(!this.state.nextState) {
          this.setState({
            nextState: true
          });
        }

        const resReadFingerprint2 = await axios.get(urlReadFingerprint2);
        if(resReadFingerprint2 === undefined || !resReadFingerprint2.data.status) {
          throw new Error(`Fingerprint 2nd read failed, status: ${ resReadFingerprint2.data.status } `);
        }

        const resIsFinish = await axios.get(urlIsFinish);
        if(resIsFinish === undefined || !resIsFinish.data.status) {
          throw new Error(`Finger doesn't finsish reading, status: ${ resIsFinish.data.status }`);
        }

        if(!this.state.isRegister) {
          this.setState({
            isRegister: true
          });
        }


        const resRegister = await axios.post(urlRegister, 
          {
            ...JSON.parse(localStorage.getItem('patientInfo')),
            'fingerPrint': [resIsFinish.data.data]
          },
          { 
            headers : {
              'X-Station-Key': this.props.config.stationKey,
              'X-Provider-Key': this.props.config.providerKey
            }
          }
        );

        if(resRegister === undefined || resRegister.data.error) {
          throw new Error(`Fingerprint register failed.`);
        }

        if(typeof(Storage) !== undefined) {
          localStorage.setItem('registerResult', JSON.stringify(resRegister.data));
          localStorage.setItem('userId', resRegister.data.user._id);
        }
        
        Router.replace('/registerComplete');
      }
      catch(ex) {
        Logging.sendLogMessage('RegisterWithFingerprint', ex);
        this.retryProcess();
      }
    }
  }

  retryProcess = () => {
    this.retryTimeout = setTimeout(this.process, this.props.config.retryTimeout);
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
                  <br/>
                  <img className='pulse animated infinite' src="/static/pics/fingerprints.svg"/>
                </div>
              ) : (
                <div>
                  <span>กรุณา<span className='emph'>แตะ</span>นิ้วบนเครื่องแสกนลายนิ้วมือ<span className='emph'>อีกครั้ง</span></span>
                  <br/>
                  <img className='pulse animated infinite' src="/static/pics/fingerprints.svg"/>
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
