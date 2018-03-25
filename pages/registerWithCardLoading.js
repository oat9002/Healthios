import React from 'react';
import LoadingTemplate from '../components/loadingTemplate';
import axios from 'axios';
import Router from 'next/router';
import cryptoJs from 'crypto-js';

const configJson = import('../static/appConfig.json');

export default class RegisterWtihCardLoading extends React.Component {
  constructor(props) {
    super(props);
    this.pageTimeout = null;
  }

  static async getInitialProps({ req, query }) {
    const config = await configJson
    return { config }
  }

  componentDidMount() {
    setTimeout(() => {
      this.register();
    }, 3000);
    this.pageTimeout = setTimeout(() => {
      Router.push('/');
    }, this.props.config.pageTimeout)
  }

  componentWillUnmount() {
    clearTimeout(this.pageTimeout);
  }

  prepareDataForRegister = (data) => {
    let dateOfBirth = parseInt(data.birthDate.substring(0,2));
    let monthOfBirth = parseInt(data.birthDate.substring(3,5));
    let yearOfBirth = parseInt(data.birthDate.substring(6, birthDate.length));

    data.birthDate = dateOfBirth + '-' + monthOfBirth + '-' + yearOfBirth;
  }

  register = () => {
    let urlRegister = this.props.config.serverIp + '/api/auth/register/card';
    let data = JSON.parse(cryptoJs.AES.decrypt(this.props.url.query.patientInfo, this.props.config.aesSecret).toString(cryptoJs.enc.Utf8));

    this.prepareDataForRegister(data);

    axios.post(urlRegister, 
      data, 
      { 
        headers : {
          'X-Station-Key': '5ab75943167f6f116e668a85'
        },
        auth: {
          username: 'kmitl-test2',
          password: 'test1234'
        } 
      }
    )
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
        this.register();
      }, 1000);
    })
  }

  render() {
    return (
      <LoadingTemplate text='กำลังลงทะเบียนด้วยบัตรประชาชน...'></LoadingTemplate>
    );
  }
}
