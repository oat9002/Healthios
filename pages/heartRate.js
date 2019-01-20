import React from 'react';
import Head from 'next/head';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import Loading from './loading';
import Router from 'next/router';
import * as Logging from '../services/logging';

const configJson = import('../static/appConfig.json');

export default class HeartRate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
    };
    this.isSensorStart = false;
    this.pageTimeout = null;
    this.readHearRateTimeout = null;
    this.startSensorTimeout = null;
  }

  componentDidMount() {
    this.startSensor();
    this.readHearRate();
    this.pageTimeout = setTimeout(() => {
      Router.replace('/');
    }, this.props.config.pageTimeout)
  }

  componentWillUnmount() {
     clearTimeout(this.pageTimeout);
     clearTimeout(this.readHearRateTimeout);
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

    let urlStartSensor = this.props.config.piIp + '/pulse/start';

    try {
      const res = await axios.get(urlStartSensor);

      if(res === undefined || !res.data.status) {
        throw new Error(`Pulse start failed, status: ${ res.data.status }`);
      }

      this.isSensorStart = true;
    }
    catch(ex) {
      Logging.sendLogMessage('HeartRate', ex);
      this.retryStartSensor();
    }
  }

  retryStartSensor = () => {
    this.startSensorTimeout = setTimeout(this.startSensor, this.props.config.retryTimeout);
  }

  readHearRate = async() => {
    if(!this.isSensorStart) {
      this.retryReadHeartRate();
      return;
    }

    let urlIsSensorReady = this.props.config.piIp + '/pulse/valid';
    let urlIsSensorFinishRead = this.props.config.piIp + '/pulse/finish';
    let urlGetData = this.props.config.piIp + '/pulse';

    try {
      const res = await axios.get(urlIsSensorReady);
      if(res === undefined || !res.data.status) {
        throw new Error(`Pulse validate failed, status: ${ res.data.status }`);
      }

      if(!this.state.isProcessing) {
        this.setState({
          isLoading: true
        });
      }

      const resIsSensorFinishRead = await axios.get(urlIsSensorFinishRead);
      if(resIsSensorFinishRead === undefined || !resIsSensorFinishRead.data.status) {
        throw new Error(`Pulse doesn't finish reading, status: ${ resIsSensorFinishRead.data.status }`)
      }

      const resGetData = await axios.get(urlGetData);
      if(resGetData === undefined) {
        throw new Error(`Pulse get data failed`);
      }

      if(typeof(Storage) !== undefined) {
        sessionStorage.setItem('pulse', JSON.stringify(resGetData.data.data));
      }
      else {
        //if not support HTML 5 local storage
      }

      Router.replace('/measurementResult');
    }
    catch(ex) {
      Logging.sendLogMessage('HeartRate', ex);
      this.retryReadHeartRate();
    }
  }

  retryReadHeartRate = () => {
    this.readHearRateTimeout = setTimeout(this.readHearRate, this.props.config.retryTimeout);
  }

  render() {
    let isProcessing = this.state.isProcessing;

    return (
      <MuiThemeProvider>
        {
          isProcessing ? (
            <Loading />
          ) : (
            <div>
              <Head>
                <link href="https://fonts.googleapis.com/css?family=Kanit:200,400" rel="stylesheet"/>
                <link rel="stylesheet" href="/static/css/animate.css"/>
              </Head>
              <div>
                <div className='content'>
                  กรุณาเอานิ้ว<span className='emph'>แตะ</span>เครื่องหมายตามรูปค้างไว้
                </div>
                <div className='animated pulse infinite'>
                  <img src="/static/pics/heartRate.png"/>
                </div>
              </div>
              <style jsx>{`
                div {
                  text-align: center;
                }
                img {
                  width: 50%;
                  height: auto;
                }
                .content {
                  font-weight: 200;
                  font-size: 4em;
                  margin-top: 10%;
                }
                .emph {
                  font-size: 1.5em;
                  font-weight: 400;
                }
              `}</style>
              <style jsx global
                >{`
                body {
                  font-family: Kanit;
                  color: #393939;
                  animation: fadein 1s;
                  background-color: #f7f7f7;
                  overflow: hidden;
                }
                @keyframes fadein {
                    from { opacity: 0; };
                    to   { opacity: 1; };
                }
              `}</style>
            </div>
          )
        }

      </MuiThemeProvider>
    );
  }
}
