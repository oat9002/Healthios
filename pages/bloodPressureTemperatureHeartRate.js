import React from 'react';
import Head from 'next/head';
import Loading from './loading';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Router from 'next/router';

export default class BloodPressureTemperatureHeartRate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcess: false
    };
    this.piIp = 'http://161.246.6.201:8080';
    this.interval = null;
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      axios.all([axios.get(this.piIp + '/pressure/valid'), axios.get(this.piIp + '/thermal/valid'), axios.get(this.piIp + '/pulse/valid')])
      .then(axios.spread((pressureValid, theremalValid, pulseValid) => {
        if(pressureValid.data.status || theremalValid.data.status || pulseValid.data.status) {
          return true;
        }
        else {
          return false;
        }
      }))
      .then(valid => {
        this.setState({
          isProcess: true
        });
        axios.all([axios.get(this.piIp + '/pressure/finish'), axios.get(this.piIp + '/thermal/finish'), axios.get(this.piIp + '/pulse/valid')])
        .then(axios.spread((pressureFinish, thermalFinish, pulseFinish) => {
          if(pressureFinish.data.status && thermalFinish.data.status && pulseFinish.data.status) {
            return true;
          }
          else {
            return false;
          }
        }))
        .then(finish => {
          if(finish) {
              axios.all([axios.get(this.piIp + '/pressure/'), axios.get(this.piIp + '/thermal/'), axios.get(this.piIp + '/pulse/')])
            .then(axios.spread((pressure, thermal, pulse) => {
              if(typeof(Storage) !== "undefined") {
                localStorage.setItem('pressure', JSON.stringify(pressure.data.data));
                localStorage.setItem('thermal', JSON.stringify(thermal.data.data));
                localStorage.setItem('pulse', JSON.stringify(pulse.data.data));
              }
              Router.push('/measurementResult');
            }))
          }
        })
      })
      .catch(err => {
        console.log(err);
      })
    }, 2000)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let isProcess = this.state.isProcess;

    return (
      <MuiThemeProvider>
        { isProcess ? (
          <Loading></Loading>
        ) : (
          <div className='content'>
            <Head>
              <link href="https://fonts.googleapis.com/css?family=Kanit:200,400" rel="stylesheet"/>
              <link rel="stylesheet" href="/static/css/animate.css"/>
            </Head>
            <span>กรุณาใส่ปลอกเเขนที่เตรียมไว้ให้</span><br/>
            {/* <img className='pulse animated infinite' src="/static/pics/footprint.png" alt=""/> */}
            <style jsx>{`
              span {
                font-size: 74px;
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
