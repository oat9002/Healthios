import React from 'react';
import Head from 'next/head';
import Loading from './loading';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Router from 'next/router';

const configJson = import('../static/appConfig.json');

export default class BloodPressure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcess: false
    };
    this.isSensorStart = false;
    this.pageTimeout = null;
  }

  componentDidMount() {
    this.startSensor();
    this.readBloodPressure();
    this.pageTimeout = setTimeout(() => {
      Router.push('/');
    }, this.props.config.pageTimeout)
  }

  componentWillUnmount() {
     clearTimeout(this.pageTimeout);
  }

  static async getInitialProps({ req, query }) {
    const config = await configJson
    return { config }
  }

  startSensor = () => {
    let urlStartSensor = this.props.config + '/pressure/start';
    if(!this.isSensorStart) {
      axios.get(urlStartSensor)
        .then(res => {
          if(!res.data.status) {
            this.startSensor();
          }
          else {
            this.isSensorStart = true;
          }
        })
        .catch(err => {
          console.log(err);
          this.startSensor();
        })
      }
  }

  readBloodPressure = () => {
    if(this.isSensorStart) {
      let urlIsSensorReady = this.props.config.piIp + '/pressure/valid';
      let urlIsSensorFinishRead = this.props.config.piIp + '/pressure/finish';
      let urlGetData = this.props.config.piIp + '/pressure';

      axios.get(urlIsSensorReady)
        .then(res => {
          return res.data.status
        })
        .then(isSensorReady => {
          if(isSensorReady) {
            this.setState({
              isLoading: true
            });
            return axios.get(urlIsSensorFinishRead)
          }
        })
        .then(resIsSensorFinishRead => {
          if(resIsSensorFinishRead !== undefined && resIsSensorFinishRead.data.status) {
            return axios.get(urlGetData)
          }
        })
        .then(resGetData => {
          if(resGetData !== undefined && resGetData.data.status) {
            if(typeof(Storage) !== "undefined") {
              localStorage.setItem('pressure', JSON.stringify(resGetData.data.data));
            }
            else {
              //if not support HTML 5 local storage
            }
            Router.push('/temperature');
          }
          else {
            setTimeout(() => {
              this.readBloodPressure();
            }, 1000)
          }
        })
        .catch(err => {
          console.log(err);
          setTimeout(() => {
            this.readBloodPressure();
          }, 1000)
        })
    }
  }

  componentWillUnmount() {
    clearInterval(this.pageTimeout);
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
