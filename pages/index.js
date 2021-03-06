import React from 'react';
import Router, { withRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import Loading from './loading';
import cryptoJs from 'crypto-js';
import * as Utils from '../services/Utils';
import * as Config from '../static/appConfig.json';

class Login extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isLoading: false
    };
    this.piIp = Config.piIp;
    this.serverIp = Config.serverIp;
    this.isStart = false;
    this.loginWithFingerprintTimeout = null;
    this.loginWithCardTimeout = null;
    this.isScanFingerPrintAgain = false;
  }

  componentDidMount() {
    this.loginWithCard();
    this.loginWithFingerprint();
    this.resetLocalStorage();
  }

  loginWithCard = async () => {
    let urlIsStart = this.piIp + '/thid/start';
    let urlIsInsertCard = this.piIp + '/thid/valid';
    let urlIsCardReadable = this.piIp + '/thid/readable';
    let urlLogin = this.serverIp + '/api/auth/login';
    let urlGetData = this.piIp + '/thid';

    try {
      const resStart = await axios.get(urlIsStart);
      if (resStart === undefined || !resStart.data.status) {
        throw new Error(`Card start failed, status: ${resStart.data.status}`);
      }

      const resIsInsertCard = await axios.get(urlIsInsertCard);
      if (resIsInsertCard === undefined || !resIsInsertCard.data.status) {
        throw new Error(`Card validate failed, status: ${resIsInsertCard.data.status}`);
      }

      const resIsCardReadable = await axios.get(urlIsCardReadable);
      if (resIsCardReadable === undefined || !resIsCardReadable.data.status) {
        throw new Error(`Card read failed, status: ${resIsCardReadable.data.status}`);
      }

      if (!this.state.isLoading) {
        this.setState({
          isLoading: true
        });
      }

      const resGetData = await axios.get(urlGetData);
      if (resGetData === undefined || !resGetData.data.status) {
        throw new Error(`Card get data failed, status: ${resGetData.data.status}`);
      }

      try {
        const resLogin = await axios({
          url: urlLogin,
          auth: {
            username: resGetData.data.data.idNumber,
            password: resGetData.data.data.birthOfDate.replace(/\//g, '')
          },
          headers: {
            'X-Station-Key': Config.stationKey,
            'X-Provider-Key': Config.providerKey
          }
        });

        if (resLogin === undefined) {
          throw new Error('Login with card failed.');
        }

        if (typeof (Storage) !== undefined) {
          sessionStorage.setItem('userInfo', cryptoJs.AES.encrypt(JSON.stringify(resLogin.data.data), Config.aesSecret).toString());
          sessionStorage.setItem('token', resLogin.data.token);
          sessionStorage.setItem('isLogin', true);
          sessionStorage.setItem('isLoginWithCard', true);
          sessionStorage.setItem('firstTime', JSON.stringify({
            isFirstTime: resLogin.data.data.firsttime,
            firstTimeKey: resLogin.data.data.firstTimeKey
          }));
        }
        Router.replace({ pathname: '/loginComplete', query: { first: 'card' } });

      }
      catch (ex) {
        if (ex !== undefined && ex.response.status == 401) {
          Router.replace({ pathname: '/registerWithCard', query: { first: 'card' } });
        }
        else {
          throw ex;
        }
      }
    }
    catch (ex) {
      Utils.sendLogMessage('loginWithCard', ex);
      this.retryLoginWithCard();
    }
  }

  retryLoginWithCard = () => {
    this.loginWithCardTimeout = setTimeout(this.loginWithCard, Config.retryTimeout);
  }

  loginWithFingerprint = async () => {
    let urlStartReadFingerprint = this.piIp + '/finger/start/scan';
    let urlIsUseFingerprint = this.piIp + '/finger/valid/scan';
    let urlCompareFingerprint = this.piIp + '/finger/valid/compare';
    let urlGetData = this.piIp + '/finger';
    let urlLogin = this.serverIp + '/api/auth/login/fingerprint';

    if (!this.isStart) {
      try {
        const res = await axios.get(urlStartReadFingerprint);
        if (res === undefined || !res.data.status) {
          throw new Error(`Fingerprint start scan failed, status: ${res.data.status}`);
        }

        this.isStart = true;
      }
      catch (ex) {
        Utils.sendLogMessage('loginWithFingerprint', ex);
      }

      this.retryLoginWithFingerprint();
    }
    else {
      try {
        const res = await axios.get(urlIsUseFingerprint);
        if (res === undefined || !res.data.status) {
          throw new Error(`Fingerprint valid scan failed, status: ${res.data.status}`);
        }

        const resIsCompareFinish = await axios.get(urlCompareFingerprint);
        if (resIsCompareFinish === undefined || !resIsCompareFinish.data.status) {
          throw new Error(`Fingerprint compare failed, status: ${resIsCompareFinish.data.status}`);
        }

        const resGetData = await axios.get(urlGetData);
        if (resGetData === undefined) {
          throw new Error(`Fingerprint get data failed, status: ${resGetData.data.status}`);
        }

        if (!this.state.isLoading) {
          this.setState({
            isLoading: true
          });
        }

        if (!resGetData.data.status) {
          Router.replace({ pathname: '/registerWithCard', query: { first: 'fingerprint' } });
        }

        try {
          const resLogin = await axios({
            url: urlLogin,
            headers: {
              'x-user-key': resGetData.data.data,
              'X-Station-Key': Config.stationKey,
              'X-Provider-Key': Config.providerKey
            }
          });

          if (resLogin === undefined) {
            throw new Error('Login with fingerprint failed.');
          }

          if (typeof (Storage) !== undefined) {
            sessionStorage.setItem('userInfo', cryptoJs.AES.encrypt(JSON.stringify(resLogin.data.data), Config.aesSecret).toString());
            sessionStorage.setItem('token', resLogin.data.token);
            sessionStorage.setItem('isLogin', true);
            sessionStorage.setItem('isLoginWithCard', false);
            sessionStorage.setItem('firstTime', JSON.stringify({
              isFirstTime: resLogin.data.data.firsttime,
              firstTimeKey: resLogin.data.data.first_time_key
            }));
          }

          Router.replace({ pathname: '/loginComplete', query: { first: 'fingerprint' } });
        }
        catch (ex) {    
          this.isScanFingerPrintAgain = true;
          throw ex;
        }
      }
      catch (ex) {
        Utils.sendLogMessage('loginWithFingerprint', ex);
        this.retryLoginWithFingerprint();
      }
    }
  }

  retryLoginWithFingerprint = () => {
    this.loginWithFingerprintTimeout = setTimeout(this.loginWithFingerprint, Config.retryTimeout);
  }

  componentWillUnmount() {
    clearTimeout(this.loginWithFingerprintTimeout);
    clearTimeout(this.loginWithCardTimeout);
  }

  resetLocalStorage = () => {
    sessionStorage.setItem('userInfo', '');
    sessionStorage.setItem('token', '');
    sessionStorage.setItem('isLogin', false);
    sessionStorage.setItem('isLoginWithCard', false);
    sessionStorage.setItem('firstTime', JSON.stringify({
      isFirstTime: false,
      firstTimeKey: ''
    }));
    sessionStorage.setItem('patientData', '');
    sessionStorage.setItem('registerResult', '');
    sessionStorage.setItem('weight', '');
    sessionStorage.setItem('height', '');
    sessionStorage.setItem('thermal', '');
    sessionStorage.setItem('pressure', '');
    sessionStorage.setItem('pulse', '');
  }

  render() {
    let isLoading = this.state.isLoading;

    return (
      <div>
        {isLoading ? (
          <Loading></Loading>
        ) : (
          <div>
            <Head>
              <link href="https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai" rel="stylesheet" />
              <link href="/static/css/animate.css" rel="stylesheet" />
            </Head>
            <div>
              <img className='rubberBand bounce animated' id='logo' src="/static/pics/logo.png" />
            </div>
            <div>
              <div className='content' id='fingerprint'>
                <span className='emph'>แตะ</span><span>นิ้วบนเครื่องแสกนลายนิ้วมือ{this.isScanFingerPrintAgain ? 'ใหม่อีกครั้ง' : null}</span>
                <br />
                <img className='pulse animated infinite' src='/static/pics/fingerprints.svg' />
              </div>
              <div className='content' id='center'>
                <span>หรือ</span>
              </div>
              <div className='content' id='idCard'>
                <span className='emph'>เสียบ</span><span>บัตรประชาชนให้สุด</span>
                <br />
                <img className='slideInUp animated infinite' src="/static/pics/id.png" />
              </div>
            </div>
            <style jsx>{`
              #center {
                width 20%;
              }
              #idCard {
                width 40%;
              }
              #fingerprint {
                width 40%;
              }
              #logo {
                width: 20%;
                height: auto;
              }
              img {
                heigh: auto;
                width: 40%;
              }
              span {
                font-size: 3em;
              }
              .emph {
                font-size: 5em;
                font-weight: 300;
              }
            `}</style>
            <style jsx global>{`
            .content {
              display: inline-block;
            }
            div {
              margin-top: 3%;
              margin-bottom: 3%;
              text-align: center;
              vertical-align: middle;
            }
            body {
              background-color: #f7f7f7;
              font-family: Kanit;
              color: #393939;
              animation: fadein 1s;
              font-weight: 200;
              // overflow: hidden;
            }
            @keyframes fadein {
                from { opacity: 0; };
                to   { opacity: 1; };
            }
          `}</style>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Login);
