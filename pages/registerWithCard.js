import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LoadingTemplate from '../components/loadingTemplate';
import Head from 'next/head';
import Router, { withRouter } from 'next/router';
import axios from 'axios';
import * as Logging from '../services/logging';
import cryptoJs from 'crypto-js';
import * as Config from '../static/appConfig.json';
import PropTypes from 'prop-types';

class RegisterWithCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFromCard: props.url.query.first === 'card' ? true : false,
      isLogin: false,
      isRegister: false
    };
    this.piIp = Config.piIp;
    this.serverIp = Config.serverIp;
    this.fingerprintInterval = null;
    this.pageTimeout = null;
    this.retryTimeout = null;
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

  prepareDataForRegister = (data) => {
    let newData = { ...data };
    let dateOfBirth = parseInt(newData.birthOfDate.substring(0,2));
    let monthOfBirth = parseInt(newData.birthOfDate.substring(3,5));
    let yearOfBirth = parseInt(newData.birthOfDate.substring(6, data.birthOfDate.length));

    newData.birthOfDate = yearOfBirth + '-' + monthOfBirth + '-' + dateOfBirth;

    return newData;
  }

  process = async() => {
    let urlIsInsertCard = this.piIp + '/thid/valid';
    let urlIsCardReadable = this.piIp + '/thid/readable';
    let urlGetData = this.piIp + '/thid';

    try{
      const resInsertCard = await axios.get(urlIsInsertCard);

      if(resInsertCard === undefined || !resInsertCard.data.status) {
        throw new Error(`Card validate failed, status: ${ resInsertCard.data.status }`);
      }

      this.setState({
        isLogin: true,
        isRegister: false
      });

      const resIsCardReadable = await axios.get(urlIsCardReadable);
      if(resIsCardReadable === undefined || ! resIsCardReadable.data.status) {
        throw new Error(`Card read failed, status: ${ resIsCardReadable.data.status }`);
      }

      const resGetData = await  axios.get(urlGetData);
      if(resGetData === undefined) {
        throw new Error('Card get data failed');
      }

      this.login(resGetData.data.data);
    }
    catch(ex) {
      Logging.sendLogMessage('RegisterWithCard', ex);
      this.retryProcess();
    }
  }

  login = async(data) => {
    let urlLogin = Config.serverIp + '/api/auth/login';

    try {
      const resLogin = await axios({
        url: urlLogin,
        auth: {
          username: data.idNumber,
          password: data.birthOfDate.replace(/\//g, '')
        },
        headers : {
          'X-Station-Key': Config.stationKey,
          'X-Provider-Key': Config.providerKey
        }
      });

      if(resLogin === undefined) {
        throw new Error('Login with card failed.');
      }

      if(typeof(Storage) !== undefined) {
        sessionStorage.setItem('userInfo', cryptoJs.AES.encrypt(JSON.stringify(resLogin.data.data), Config.aesSecret).toString());
        sessionStorage.setItem('token', resLogin.data.token);
        sessionStorage.setItem('isLogin', true);
      }
      Router.replace({ pathname: '/loginComplete', query: { first: 'card' }});
    }
    catch(ex) {
      if(ex !== undefined && ex.response.status == 401) {
        this.register(data);
      }
      else {
        throw ex;
      }
    }
  }

  register = async(patientInfo) => {
    let updatedPatientInfo = this.prepareDataForRegister(patientInfo);

    try {
      this.setState({
        isLogin: false,
        isRegister: true
      });

      if(typeof(Storage) !== undefined) {
        sessionStorage.setItem('patientData',  cryptoJs.AES.encrypt(JSON.stringify(updatedPatientInfo), Config.aesSecret));
      }

      Router.replace({ pathname: '/registerWithFingerprint', query: { first: this.props.url.query.first }});
    }
    catch(ex) {
      throw ex;
    }
  }

  retryProcess = () => {
    this.retryTimeout = setTimeout(this.process, Config.retryTimeout);
  }

  render() {
    let showElement = (  
      <div>
        <span>กรุณา<span className='emph'>เสียบ</span>บัตรประชาชน</span>
        <br/>
        <img className='slideInUp animated infinite' src="/static/pics/id.png"/>
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
            .emph2 {
              font-weight: bold;
              color: blue;
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

    if(this.state.isFromCard || this.state.isRegister) {
      showElement =  <LoadingTemplate text='กำลังลงทะเบียนด้วยบัตรประชาชน...'></LoadingTemplate>;
    }
    else if(this.state.isLogin) {
      showElement =  <LoadingTemplate text='กำลังทำงาน...'></LoadingTemplate>;
    }

    return(
      <MuiThemeProvider>
        <div className='content'>
          <Head>
            <link href="https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai" rel="stylesheet" />
            <link href="/static/css/animate.css" rel="stylesheet" />
          </Head>
          { showElement }
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
            .emph2 {
              font-weight: bold;
              color: blue;
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
      </MuiThemeProvider>
    );
  }
}

RegisterWithCard.propTypes = {
  url: PropTypes.object.isRequired,
};

export default withRouter(RegisterWithCard);