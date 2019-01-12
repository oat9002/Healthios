import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LoadingTemplate from '../components/loadingTemplate';
import Head from 'next/head';
import Router from 'next/router';
import axios from 'axios';
import * as Logging from '../services/logging';

const configJson = import('../static/appConfig.json');

export default class registerWithCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFromCard: false,
      isProcessing: false
    };
    this.piIp = this.props.config.piIp;
    this.serverIp = this.props.config.serverIp;
    this.fingerprintInterval = null;
    this.pageTimeout = null;
    this.retryTimeout = null;
  }

  static async getInitialProps({ req, query }) {
    const config = await configJson
    return { config }
  }

  setIsFromCard() {
    if(this.props.url.query.first === 'card' && !this.state.isFromCard) {
      this.setState({
        isFromCard: true,
      });
    }
  }

  componentDidMount() {
    this.setIsFromCard();
    this.process();
    this.pageTimeout = setTimeout(() => {
      Router.push('/');
    }, this.props.config.pageTimeout)
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

      if(!this.state.isProcessing) {
        this.setState({
          isProcessing: true
        });
      }

      const resIsCardReadable = await axios.get(urlIsCardReadable);
      if(resIsCardReadable === undefined || ! resIsCardReadable.data.status) {
        throw new Error(`Card read failed, status: ${ resIsCardReadable.data.status }`);
      }

      const resGetData = await  axios.get(urlGetData);
      if(resGetData === undefined) {
        throw new Error(`Card get data failed`);
      }

      this.register(res.data.data);
    }
    catch(ex) {
      Logging.sendLogMessage('RegisterWithCard', ex);
      this.retryProcess();
    }
  }

  register = async(patientInfo) => {
    let urlRegister = this.props.config.serverIp + '/api/auth/register/card';
    let updatedPatientInfo = this.prepareDataForRegister(patientInfo);

    try {
      const resRegister = await axios.post(urlRegister, 
        updatedPatientInfo, 
        { 
          headers : {
            'X-Station-Key': this.props.config.stationKey,
            'X-Provider-Key': this.props.config.providerKey
          }
        }
      );

      if(resRegister === undefined) {
        throw new Error(`Card register failed`);
      }

      if(typeof(Storage) !== undefined) {
        localStorage.setItem('registerCardInfo', JSON.stringify(resRegister.data));
      }

      Router.push({ pathname: '/registerWithFingerprint', query: { first: this.props.url.query.first }});
    }
    catch(ex) {
      throw ex;
    }
  }

  retryProcess = () => {
    this.retryTimeout = setTimeout(this.process, this.props.config.retryTimeout);
  }

  render() {
    return(
      <MuiThemeProvider>
        <div className='content'>
          <Head>
            <link href="https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai" rel="stylesheet" />
            <link href="/static/css/animate.css" rel="stylesheet" />
          </Head>
          {
            this.state.isFromCard || this.state.isProcessing ? (
              <LoadingTemplate text='กำลังลงทะเบียนด้วยบัตรประชาชน...'></LoadingTemplate>
            ) : 
            (
              <div>
                <span>กรุณา<span className='emph'>เสียบ</span>บัตรประชาชน</span>
                <br/>
                <img className='slideInUp animated infinite' src="/static/pics/id.png"/>
              </div>
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
