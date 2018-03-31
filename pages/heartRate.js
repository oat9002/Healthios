import React from 'react';
import Head from 'next/head';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import Loading from './loading';

const configJson = import('../static/appConfig.json');

export default class HeartRate extends React.Component {
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
    this.readHearRate();
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
    let urlStartSensor = this.props.config + '/pulse/start';
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

  readHearRate = () => {
    if(this.isSensorStart) {
      let urlIsSensorReady = this.props.config.piIp + '/pulse/valid';
      let urlIsSensorFinishRead = this.props.config.piIp + '/pulse/finish';
      let urlGetData = this.props.config.piIp + '/pulse';

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
              localStorage.setItem('pulse', JSON.stringify(resGetData.data.data));
            }
            else {
              //if not support HTML 5 local storage
            }
            Router.push('/measurementResult');
          }
          else {
            setTimeout(() => {
              this.readHearRate();
            }, 1000)
          }
        })
        .catch(err => {
          console.log(err);
          setTimeout(() => {
            this.readHearRate();
          }, 1000)
        })
    }
  }

  render() {
    let isProcess = this.state.isLoading;

    return (
      <MuiThemeProvider>
        {
          isProcess ? (
            <Loading></Loading>
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
