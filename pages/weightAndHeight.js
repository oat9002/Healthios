import React from 'react';
import Head from 'next/head';
import Loading from './loading';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Router from 'next/router';

export default class WeightAndHeight extends React.Component {
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
      axios.all([axios.get(this.piIp + '/weight/valid'), axios.get(this.piIp + '/height/valid')])
      .then(axios.spread((weightValid, heightValid) => {
        if(weightValid.data.status || heightValid.data.status) {
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
              if(typeof(Storage) !== "undefined") {
                localStorage.setItem('weight', JSON.stringify(weight.data.data));
                localStorage.setItem('height', JSON.stringify(height.data.data));
              }
              Router.push('/bloodPressureTemperatureHeartRate');
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
            <span>กรุณายืนให้ตรงรูปและยืนหลังตรง</span><br/>
            <img className='pulse animated infinite' src="/static/pics/footprint.png" alt=""/>
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
