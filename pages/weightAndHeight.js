import React from 'react';
import Head from 'next/head';
import Loading from './loading';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Router, { withRouter } from 'next/router';
import * as Logging from '../services/logging';

const configJson = import('../static/appConfig.json');

class WeightAndHeight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false
    };
    this.piIp = this.props.config.piIp;
    this.pageTimeout = null;
    this.readWeightAndHeightTimeout = null;
    this.startSensorTimeout = null;
    this.isSensorStart = false;
  }

  static async getInitialProps({ req, query }) {
    const config = await configJson
    return { config }
  }

  componentDidMount() {
    this.pageTimeout = setTimeout(() => {
      Router.replace('/');
    }, this.props.config.pageTimeout);
    
    this.startSensor();
    this.readWeightAndHeight();
  }

  startSensor = async() => {
    if(this.isSensorStart) {
      return;
    }

    let urlStartWeightSensor = this.piIp + '/weight/start';
    let urlStartHeightSensor = this.piIp + '/height/start';

    try {
      const [weightResponse, heightResponse] = await Promise.all([axios.get(urlStartWeightSensor), axios.get(urlStartHeightSensor)]);

      if(weightResponse === undefined || !weightResponse.data.status) {
        throw new Error(`Weight start failed, status: ${ weightResponse.data.status }`);
      }
      if(heightResponse === undefined || !heightResponse.data.status) {
        throw new Error(`Height start failed, status: ${ heightResponse.data.status }`);
      }

      this.isSensorStart = true;
    }
    catch(ex) {
      Logging.sendLogMessage('WeightAndHeight', ex);
      this.retryStartSensor();
    }
  }

  retryStartSensor = () => {
    this.startSensorTimeout = setTimeout(this.startSensor, this.props.config.retryTimeout);
  }

  readWeightAndHeight = async() => {
    const urlValidWeightSensor = this.piIp + '/weight/valid';
    const urlValidHeightSensor = this.piIp + '/height/valid'

    if(!this.isSensorStart) {
      this.retryReadWeightAndHeight();
      return;
    }

    try {
      const [resWeightValid, resHeightValid] = await Promise.all([axios.get(urlValidWeightSensor), axios.get(urlValidHeightSensor)]);

      if(resWeightValid === undefined || !resWeightValid.data.status) {
        throw new Error(`Weight validate failed, status: ${ resWeightValid.data.status }`);
      }
      if(resHeightValid === undefined || !resHeightValid.data.status) {
        throw new Error(`Height validate failed, status: ${ resHeightValid.data.status }`);
      }

      if(!this.state.isProcessing) {
        this.setState({
          isProcessing: true
        });
      }

      const [resWeightFinish, resHeightFinish] = await Promise.all([axios.get(this.piIp + '/weight/finish'), axios.get(this.piIp + '/height/finish')]);

      if(resWeightFinish === undefined || !resWeightFinish.data.status) {
        throw new Error(`Weight doesn't finish reading, status: ${ resWeightFinish.data.status }`);
      }
      if(resHeightFinish === undefined || !resHeightFinish.data.status) {
        throw new Error(`Height doesn't finish reading, status: ${ resHeightFinish.data.status }`);
      }

      const [weight, height] = await Promise.all([axios.get(this.piIp + '/weight/'), axios.get(this.piIp + '/height/')]);

      if(resWeightFinish === undefined) {
        throw new Error(`Weight get data failed`);
      }
      if(resHeightFinish === undefined) {
        throw new Error(`Height get data failed`);
      }

      if(typeof(Storage) !== undefined) {
        let now = new Date();

        sessionStorage.setItem('height', JSON.stringify({
          body_height: {
            value: height.data.data,
            unit: 'cm'
          },
          effective_time_frame: {
            date_time: now.toISOString()
          }
        }));

        now.setSeconds(now.getSeconds() + 1);
        sessionStorage.setItem('weight', JSON.stringify({
          body_weight: {
            value: weight.data.data,
            unit: 'kg'
          },
          effective_time_frame: {
            date_time: now.toISOString()
          }
        }));
      }

      Router.replace('/bloodPressure');
    }
    catch(ex) {
      Logging.sendLogMessage('WeightAndHeight', ex);
      this.retryReadWeightAndHeight();
    }
  }

  retryReadWeightAndHeight = () => {
    this.readWeightAndHeightTimeout = setTimeout(this.readWeightAndHeight, this.props.config.retryTimeout);
  }

  componentWillUnmount() {
    clearTimeout(this.pageTimeout);
    clearTimeout(this.readWeightAndHeightTimeout);
    clearTimeout(this.startSensorTimeout);
  }

  render() {
    let isProcess = this.state.isProcessing;

    return(
      <MuiThemeProvider>
        { isProcess ? (
          <Loading></Loading>
        ) : (
          <div className='content'>
            <Head>
              <link href="https://fonts.googleapis.com/css?family=Kanit:200,400" rel="stylesheet"/>
              <link rel="stylesheet" href="/static/css/animate.css"/>
            </Head>
            <span>กรุณายืนให้ตรงรูปและหลังตรง</span><br/>
            <img className='pulse animated infinite' src="/static/pics/footprint.png" alt=""/>
            <style jsx>{`
              span {
                font-size: 5em;
              }
            `}</style>
            <style jsx global>{`
              .content {
                position: absolute;
                top: 25%;
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

export default withRouter(WeightAndHeight);