import React from 'react';
import LoadingTemplate from '../components/loadingTemplate';
import axios from 'axios';
import Router from 'next/router';

export default class RegisterWtihCardLoading extends React.Component {
  constructor(props) {
    super(props);
    this.serverIp = 'http://203.151.85.73:8080';
  }

  componentDidMount() {
    let urlRegister = this.serverIp + '/api/auth/register';
    let status = false;
    setTimeout(() => {
      let data = this.props.url.query.patientInfo;
      axios.post(urlRegister, data)
      .then(resRegister => {
        if(typeof(Storage) !== "undefined") {
          localStorage.setItem('data', JSON.stringify(resRegister.data));
        }
        if(this.props.url.query.first == 'card'){
          Router.push('/registerWithFingerprint'); //must change to registerWithFingerprint
        }
        else if(this.props.url.query.first == 'fingerprint') {
          Router.push('/registerComplete');
        }
      })
      .catch(err => {
        console.log(err);
      })
    }, 3000);
  }

  render() {
    return (
      <LoadingTemplate text='กำลังลงทะเบียนด้วยบัตรประชาชน...'></LoadingTemplate>
    );
  }
}
