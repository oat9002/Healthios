import React from 'react';
import LoadingTemplate from '../components/loadingTemplate';
import axios from 'axios';
import Router from 'next/router';
import cryptoJs from 'crypto-js';

const configJson = import('../static/appConfig.json');

export default class RegisterWtihCardLoading extends React.Component {
  constructor(props) {
    super(props);
  }

  static async getInitialProps({ req, query }) {
    const config = await configJson
    return { config }
  }

  componentDidMount() {
    setTimeout(() => {
      this.register();
    }, 3000);
  }

  register = (retry = 0) => {
    if(retry !== this.props.config.maxRetry) {
      let urlRegister = this.props.config.serverIp + '/api/auth/register';
      let data = JSON.parse(cryptoJs.AES.decrypt(this.props.url.query.patientInfo, this.props.config.aesSecret).toString(cryptoJs.enc.Utf8));
      console.log(data)
      axios.post(urlRegister, data, { headers: {'Register-Type': 'idcard'} })
      .then(resRegister => {
        if(typeof(Storage) !== "undefined") {
          localStorage.setItem('data', JSON.stringify(resRegister.data));
        }
        if(this.props.url.query.first == 'card'){
          Router.push({pathname: '/registerWithFingerprint', query: {first: this.props.url.query.first}});
        }
        else if(this.props.url.query.first == 'fingerprint') {
          Router.push('/registerComplete');
        }
      })
      .catch(err => {
        console.log(err);
        setTimeout(() => {
          this.register(++retry)
        }, 1000);
      })
    }
    else {
      Router.push('/login');
    }
  }

  render() {
    return (
      <LoadingTemplate text='กำลังลงทะเบียนด้วยบัตรประชาชน...'></LoadingTemplate>
    );
  }
}
