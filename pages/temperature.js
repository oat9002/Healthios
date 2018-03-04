import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';

const configJson = import('../static/appConfig.json');

export default class Temperature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
    this.isSensorStart = false;
    this.pageTimeout = null;
  }

  componentDidMount() {
    this.startSensor();
    this.readTemperature();
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
    let urlStartSensor = this.props.config + '/thermal/start';
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
          startSensor();
        })
      }
  }

  readTemperature = () => {
    if(this.isSensorStart) {
      let urlIsSensorReady = this.props.config.piIp + '/thermal/valid';
      let urlIsSensorFinishRead = this.props.config + '/thermal/finish';
      let urlGetData = this.props.config + '/thermal';

      axios.get(urlIsSensorReady)
        .then(res => {
          return res.data.status
        })
        .then(isSensorReady => {
          if(isSensorReady) {
            return axios.get(urlIsSensorFinishRead)
              .then(res => {
                return res.data.status
              })
              .catch(err => {
                console.log(err);
                setTimeout(() => {
                  this.readTemperature();
                }, 1000)
              })
          }
          else {
            setTimeout(() => {
              this.readTemperature();
            }, 1000)
          }
        })
        .then(isSensorFinishRead => {
          if(isSensorFinishRead) {
            axios.get(urlGetData)
              .then(res => {
                if(typeof(Storage) !== "undefined") {
                  localStorage.setItem('thermal', JSON.stringify(res.data.data));
                }
                else {
                  //if not support HTML 5 local storage
                }
              })
              .catch(err => {
                console.log(err);
                setTimeout(() => {
                  this.readTemperature();
                }, 1000)
              })
          }
          else {
            setTimeout(() => {
              this.readTemperature();
            }, 1000)
          }
        })
        .catch(err => {
          console.log(err);
          setTimeout(() => {
            this.readTemperature();
          }, 1000)
        })
    }
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <Head>
            <link href="https://fonts.googleapis.com/css?family=Kanit:200,400" rel="stylesheet"/>
            <link rel="stylesheet" href="/static/css/animate.css"/>
          </Head>
          <div>
            <div className='content'>
              กรุณาเอานิ้ว<span className='emph'>แตะ</span>เครื่องหมายตามรูป
            </div>
            <div>
              <img src="/static/pics/temperatureNew.jpg"/>
            </div>
          </div>
          <style jsx>{`
            div {
              text-align: center;
            }
            img {
              width: 30%;
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
