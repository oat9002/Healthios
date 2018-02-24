import React from 'react';
import LoadingTemplate from '../components/loadingTemplate';
import axios from 'axios';
import Router from 'next/router';

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
    console.log(retry)
    if(retry !== this.props.config.maxRetry) {
      let urlRegister = this.props.config.serverIp + '/api/auth/register';
      let data = this.props.url.query.patientInfo;
      axios.post(urlRegister, data)
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
        this.register(++retry)
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
