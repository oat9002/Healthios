import React from 'react';
import Head from 'next/head';
import Loading from './loading';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Router from 'next/router';
import * as Logging from '../services/logging';

const configJson = import('../static/appConfig.json');

export default class BloodPressure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false
    };
    this.isSensorStart = false;
    this.pageTimeout = null;
    this.readBloodPressureTimeout = null;
    this.startSensorTimeout = null;
  }

  componentDidMount() {
    this.startSensor();
    this.readBloodPressure();
    this.pageTimeout = setTimeout(() => {
      Router.replace('/');
    }, this.props.config.pageTimeout)
  }

  componentWillUnmount() {
    clearTimeout(this.pageTimeout);
    clearTimeout(this.readBloodPressurloginWithCardeTimeout);
    clearTimeout(this.startSensorTimeout);
  }

  static async getInitialProps({ req, query }) {
    const config = await configJson
    return { config }
  }

  startSensor = async() => {
    if(this.isSensorStart) {
      return;
    }

    let urlStartSensor = this.props.config.piIp + '/pressure/start';
   
    try{
      const res = await axios.get(urlStartSensor);
      if(res === undefined || !res.data.status) {
        throw new Error(`Pressure start failed, status: ${ res.data.status }`);
      }

      this.isSensorStart = true;
    }
    catch(ex) {
      Logging.sendLogMessage('BloodPressure', ex);
      this.retryStartSensor();
    }
  }

  retryStartSensor = () => {
    this.startSensorTimeout = setTimeout(this.startSensor, this.props.config.retryTimeout);
  }

  readBloodPressure = async() => {
    if(!this.isSensorStart) {
      this.retryReadBloodPressure();
      return;
    }

    let urlIsSensorReady = this.props.config.piIp + '/pressure/valid';
    let urlIsSensorFinishRead = this.props.config.piIp + '/pressure/finish';
    let urlGetData = this.props.config.piIp + '/pressure';

    try {
      const res = await axios.get(urlIsSensorReady);
      if(res === undefined || !res.data.status) {
        throw new Error(`Pressure validate failed, status: ${ res.data.status }`);
      }

      if(!this.state.isProcessing) {
        this.setState({
          isLoading: true
        });
      }

      const resIsSensorFinishRead = await axios.get(urlIsSensorFinishRead);
      if(resIsSensorFinishRead === undefined || !resIsSensorFinishRead.data.status) {
        throw new Error(`Pressure doesn't finish reading, status: ${ resIsSensorFinishRead.data.status }`);
      }

      const resGetData = await axios.get(urlGetData);

      if(resGetData === undefined) {
        throw new Error('Pressure get data failed.');
      }

      if(typeof(Storage) !== undefined) {
        localStorage.setItem('pressure', JSON.stringify(resGetData.data.data));
      }
      
      Router.replace('/temperature');
    }
    catch(ex) {

      Logging.sendLogMessage('BloodPressure', ex);
      this.retryReadBloodPressure();
    }
  }

  retryReadBloodPressure = () => {
    this.readBloodPressureTimeout = setTimeout(this.readBloodPressure, this.props.config.retryTimeout);
  }

  componentWillUnmount() {
    clearInterval(this.pageTimeout);
  }

  render() {
    let isProcessing = this.state.isProcessing;

    return (
      <MuiThemeProvider>
        { isProcessing ? (
          <Loading></Loading>
        ) : (
          <div className='content'>
            <Head>
              <link href="https://fonts.googleapis.com/css?family=Kanit:200,400" rel="stylesheet"/>
              <link rel="stylesheet" href="/static/css/animate.css"/>
            </Head>
            <span>กรุณาใส่ปลอกเเขนที่เตรียมให้</span><br/>
            <img src="/static/pics/pressure.gif" alt=""/>
            <style jsx>{`
              img {
                width: 50%;
                height: auto;
              }
              span {
                font-size: 5em;
              }
            `}</style>
            <style jsx global>{`
              .content {
                position: absolute;
                top: 30%;
                width: 100%;
                text-align: center;
              }
              body {
                font-family: Kanit;
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
        )}
      </MuiThemeProvider>
    );
  }
}
