import React from 'react';
import Router from 'next/router';
import Head from 'next/head';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Divider from 'material-ui/Divider';
import axios from 'axios';
import * as Logging from '../services/logging';
import cryptoJs from 'crypto-js';
import * as Config from '../static/appConfig.json';

export default class MeasurementResult extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: '',
      weight: {
        body_weight: {
          value: 0,
        }
      },
      height: {
        body_height: {
          value: 0,
        }
      },
      pressure: {
        systolic_blood_pressure: {
          value: 0,
        },
        average_blood_pressure: {
          value: 0,
        },
        diastolic_blood_pressure: {
          value: 0,
        }
      },
      thermal: {
        body_temperature: {
          value: 0,
        }
      },
      pulse: {
        heart_rate: {
          value: 0,
        }
      }
    };

    this.pageTimeout = null;
    this.saveMeasurementUrl = Config.serverIp + '/api/data/save';
    this.saveMeasurementTimeout = null;
    this.isSave = {
      weight: false,
      height: false,
      pressure: false,
      thermal: false,
      pulse: false
    };
  }

  prepareStateAndSaveMeasurement = () => {
    const userId =  sessionStorage.getItem('isLogin') === 'true'
      ? JSON.parse(cryptoJs.AES.decrypt(sessionStorage.getItem('userInfo'), Config.aesSecret).toString(cryptoJs.enc.Utf8))._id 
      : JSON.parse(sessionStorage.getItem('registerResult')).user._id;
    const weight = JSON.parse(sessionStorage.getItem('weight'));
    const height = JSON.parse(sessionStorage.getItem('height'));
    const pressure = JSON.parse(sessionStorage.getItem('pressure'));
    const thermal = JSON.parse(sessionStorage.getItem('thermal'));
    const pulse = JSON.parse(sessionStorage.getItem('pulse'));

    this.setState({
      userId,
      weight,
      height,
      pressure,
      thermal,
      pulse
    }, this.saveMeasurementData);
  }

  componentDidMount() {
    this.pageTimeout = setTimeout(() => {
      Router.replace('/');
    }, Config.pageTimeout);

    this.prepareStateAndSaveMeasurement();
  }

  componentWillUnmount() {
    clearTimeout(this.pageTimeout);
    clearTimeout(this.saveMeasurementTimeout);
  }

  saveMeasurementData = async() => {
    try {
      if(!this.isSave.weight) {
        const resWeight = await this.saveWeight();
        if(!resWeight.data.error) {
          this.isSave.weight = true;
        }
      }

      if(!this.isSave.height) {
        const resHeight = await this.saveHeight();
        if(!resHeight.data.error) {
          this.isSave.height = true;
        }
      }

      if(!this.isSave.pressure) {
        const resPressure = await this.savePressure();
        if(!resPressure.data.error) {
          this.isSave.pressure = true;
        }
      }

      if(!this.isSave.pulse) {
        const resPulse = await this.savePulse();
        if(!resPulse.data.error) {
          this.isSave.pulse = true;
        }
      }

      if(!this.isSave.thermal) {
        const resThermal = await this.saveThermal();
        if(!resThermal.data.error) {
          this.isSave.thermal = true;
        }
      }

      const isRetry = Object.keys(this.isSave).map(key => this.isSave[key]).some((isSave) => isSave === false);
      if(isRetry) {
        this.retrySaveMeasurementData();
      }
      else {
        this.saveMeasurementTimeout = setTimeout(() => {
          if(sessionStorage.getItem('isLogin')) {
            Router.replace('/final');
          }
          else {
            Router.replace('/qrCode');
          }
        }, 10000);
      }
    }
    catch(error) {
      Logging.sendLogMessage('Measurement result', error);
      this.retrySaveMeasurementData();
    }
  }

  saveHeight = () => {
    return axios.post(this.saveMeasurementUrl, {
      ...this.state.height
    }, {
      headers: {
        'Content-Type': 'application/json',
        'user_id': this.state.userId
      }
    });
  }

  saveWeight = () => {
    return axios.post(this.saveMeasurementUrl, {
      ...this.state.weight
    }, {
      headers: {
        'Content-Type': 'application/json',
        'user_id': this.state.userId
      }
    });
  }

  savePressure = () => {
    return axios.post(this.saveMeasurementUrl, {
      systolic_blood_pressure: {
        ...this.state.pressure.systolic_blood_pressure
      },
      diastolic_blood_pressure : {
        ...this.state.pressure.diastolic_blood_pressure
      },
      effective_time_frame : {
        ...this.state.pressure.effective_time_frame
      }      
    }, {
      headers: {
        'Content-Type': 'application/json',
        'user_id': this.state.userId
      }
    });
  }

  saveThermal = () => {
    return axios.post(this.saveMeasurementUrl, {
      ...this.state.thermal
    }, {
      headers: {
        'Content-Type': 'application/json',
        'user_id': this.state.userId
      }
    });
  }

  savePulse = () => {
    return axios.post(this.saveMeasurementUrl, {
      ...this.state.pulse
    }, {
      headers: {
        'Content-Type': 'application/json',
        'user_id': this.state.userId
      }
    });
  }

  retrySaveMeasurementData = () => {
    this.retryTimeout = setTimeout(this.saveMeasurementData, Config.retryTimeout);
  }

  render() {
    const divider = {
      'width': '70%',
      'marginLeft': '15%'
    };

    return (
      <MuiThemeProvider >
        <div>
          <Head>
            <link href="https://fonts.googleapis.com/css?family=Kanit:200,400" rel="stylesheet"/>
            <link href="/static/css/animate.css" rel="stylesheet" />
          </Head>
          <div className='template'>
            <div>
              <img src="/static/pics/measurement_result/weight.jpg" className='image' />
            </div>
            <div className="content">
              น้ำหนัก <span className='emphValue'>{this.state.weight.body_weight.value !== undefined ? this.state.weight.body_weight.value : ''}</span> กก.
            </div>
          </div>
          <Divider style={divider}/>
          <div className='template'>
            <div>
              <img src="/static/pics/measurement_result/height.jpg" className='image'/>
            </div>
            <div className="content">
              ส่วนสูง <span className='emphValue'>{this.state.height.body_height.value}</span> ซม.
            </div>
          </div>
          <Divider style={divider}/>
          <div className='template'>
            <div>
              <img src="/static/pics/measurement_result/temperature.jpg" className='image'/>
            </div>
            <div className="content">
              อุณหภูมิ <span className='emphValue'>{this.state.thermal.body_temperature.value}</span>  ํC
            </div>
          </div>
          <Divider style={divider}/>
          <div className='template'>
            <div>
              <img src="/static/pics/measurement_result/bloodPressure.png" className='image'/>
            </div>
            <div className="content">
              ความดัน<span className='emph'>เฉลี่ย</span> <span className='emphValue'>{this.state.pressure.average_blood_pressure.value}</span> mmHg
              <br />ความดัน<span className='emph'>ต่ำ</span>สุด <span className='emphValue'>{this.state.pressure.diastolic_blood_pressure.value}</span> mmHg
              <br />ความดัน<span className='emph'>สูง</span>สุด <span className='emphValue'>{this.state.pressure.diastolic_blood_pressure.value}</span> mmHg
            </div>
          </div>
          <Divider style={divider}/>
          <div className='template'>
            <div>
              <img src="/static/pics/measurement_result/heartRate.jpg" className='image'/>
            </div>
            <div className="content">
              อัตราการเต้นหัวใจ <span className='emphValue'>{this.state.pulse.heart_rate.value.avg}</span> ครั้ง/นาที
            </div>
          </div>
          <style jsx>{`
            .template {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 1%;
              margin-bottom: 1%;
            }
            .image {
              width: 200px;
              height: auto;
            }
            .emph {
              font-weight: 400;
            }
            .emphValue {
              font-weight: 400;
              font-size: 2em;
            }
            .content{
              font-size: 2.5em;
              margin-left: 10%;
            }
          `}</style>
          <style jsx global>{`
            body {
              font-family: Kanit;
              color: #393939;
              animation: fadein 1s;
              font-weight: 200;
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
