import React from 'react';
import LoadingTemplate from '../components/loadingTemplate';
import Router from 'next/Router';

export default class RegisterWithFingerprintLoading extends React.Component {
  constructor(props) {
    super(props);
    this.fingerprintInterval = null;
  }

  componentDidMount() {
    this.setTimeout(() => {
      if(this.props.query.first === 'fingerprint') {
          Router.push({pathname: '/registerWithCard', query: {first: this.props.query.first}});
      }
      else if(this.props.query.first === 'card') {
        this.readFingerprint()
        .then(result => {
          Router.push('/registerComplete');
        })
      }
    }, 3000);
  }

  readFingerprint = () => {
    const mockUrl = 'http://203.151.85.73:55442/';
    let urlIsUseFingerprint = mockUrl + 'finger/valid';
    let urlStartReadFingerprint = mockUrl + 'finger/start';
    let urlFinishReadFingerprint = mockUrl + 'finger/finish';

    return new Promise((resolve, reject) => {
      this.fingerprintInterval = setInterval(() => {
        axios.get(urlIsUseFingerprint)
        .then(res => {
          return res.data.status;
        })
        .then(isUseFingerPrint => {
          if(isUseFingerPrint) {
            return axios.get(urlStartReadFingerprint)
            .then(res => {
              return res.data.status;
            })
          }
        })
        .then(isStartReadFingerprint => {
          if(isStartReadFingerprint) {
            return axios.get(urlFinishReadFingerprint)
            .then(res => {
              return res.data.status;
            })
          }
        })
        .then(isFinishReadFingerprint => {
          if(isFinishReadFingerprint) {
            clearInterval(this.fingerprintInterval);
            resolve(true);
          }
        })
        .catch(err => {
          console.log(err);
        })
      }, 1000);
    });
  }

  render() {
    return (
      <LoadingTemplate text='กำลังลงทะเบียนด้วยลายนิ้วมือ...'></LoadingTemplate>
    );
  }
}
