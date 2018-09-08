import React from 'react';
import Head from 'next/head';
import Loading from './loading';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Router from 'next/router';

const configJson = import('../static/appConfig.json');

export default class WeightAndHeight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcess: false
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
    this.startSensor();
    this.readWeightAndHeight();
    this.pageTimeout = setTimeout(() => {
      Router.push('/');
    }, this.props.config.pageTimeout);
  }

  startSensor = () => {
    let urlStartWeightSensor = this.piIp + '/weight/start';
    let urlStartHeightSensor = this.piIp + '/height/start';

    axios.all([axios.get(urlStartWeightSensor), axios.get(urlStartHeightSensor)])
      .then(axios.spread((weightResponse, heightResponse) => {
        if(weightResponse.data.status && heightResponse.data.status) {
          this.startSensor = true;
        }
        else {
          throw `wieght status: ${ weightResponse.data.status }, height status: ${ heightResponse.data.status }`
        }
      }))
      .catch(err => {
        console.log(err);
        this.retryStartSensor();
      })
  }

  retryStartSensor = () => {
    this.startSensorTimeout = setTimeout(this.startSensor, this.props.config.retryTimeout);
  }

  readWeightAndHeight = () => {
    if(!this.isSensorStart) this.retryReadWeightAndHeight();

    axios.all([axios.get(this.piIp + '/weight/valid'), axios.get(this.piIp + '/height/valid')])
      .then(axios.spread((weightValid, heightValid) => {
        if(weightValid.data.status && heightValid.data.status) {
          return true;
        }

        return false;
      }))
      .then(valid => {
        if(!this.state.isProcess) {
          this.setState({
            isProcess: true
          });
        }
        
        if(valid) {
          axios.all([axios.get(this.piIp + '/weight/finish'), axios.get(this.piIp + '/height/finish')])
          .then(axios.spread((weighFinish, heightFinish) => {
            if(weighFinish.data.status && heightFinish.data.status) {
              return true;
            }
            else {
              return false;
            }
          }))
          .then(finish => {
            if(finish) {
              axios.all([axios.get(this.piIp + '/weight/'), axios.get(this.piIp + '/height/')])
              .then(axios.spread((weight, height) => {
                if(typeof(Storage) !== undefined) {
                  localStorage.setItem('weight', JSON.stringify(weight.data.data));
                  localStorage.setItem('height', JSON.stringify(height.data.data));
                }
                Router.push('/bloodPressure');
              }))
            }
          })
          .catch(err => {
            console.log(err);
            this.retryReadWeightAndHeight();
          })
        }
        else {
          this.retryReadWeightAndHeight();
        }
      })
      .catch(err => {
        console.log(err);
        this.retryReadWeightAndHeight();
      })
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
    let isProcess = this.state.isProcess;

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
