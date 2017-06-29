import React from 'react';
import LoadingTemplate from '../components/loadingTemplate';
import axios from 'axios';
import Router from 'next/router';

export default class RegisterWtihCardLoading extends React.Component {
  constructor(props) {
    super(props);
    this.piIp = 'http://161.246.6.201:8080';
    this.serverIp = 'http://203.151.85.73:8080'
    this.interval = null;
  }

  componentDidMount() {
    let urlIsInsertCard = this.piIp + '/thid/valid';
    let urlIsCardReadablt = this.piIp + '/thid/readable';
    let urlGetData = this.piIp + '/thid';
    let urlRegister = this.serverIp + '/api/auth/register';
    let status = false;
    setTimeout(() => {
      this.interval = setInterval(() => {
        axios.get(urlIsInsertCard)
        .then(resInsertCard => {
          return resInsertCard.data.status;
        })
        .then(status => {
          if(status) {
            return axios.get(urlIsCardReadablt)
            .then(resCardReadable => {
              return resCardReadable.data.status;
            })
          }
          else {
            return false;
          }
        })
        .then(status => {
          if(status) {
            axios.get(urlGetData)
            .then(resGetData => {
              let data = resGetData.data.data;
              axios.post(urlRegister, data)
              .then(resRegister => {
                if(typeof(Storage) !== "undefined") {
                  localStorage.setItem('data', JSON.stringify(resRegister.data));
                }
                if(this.props.url.query.first == 'card'){
                  Router.push('/registerComplete'); //must change to registerWithFingerprint
                }
                else if(this.props.url.query.first == 'fingerprint') {
                  Router.push('/registerComplete');
                }
              })
            })
          }
        })
        .catch(err => {
          console.log(err);
        })
      }, 5000);
    }, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <LoadingTemplate text='กำลังลงทะเบียนด้วยบัตรประชาชน...'></LoadingTemplate>
    );
  }
}
