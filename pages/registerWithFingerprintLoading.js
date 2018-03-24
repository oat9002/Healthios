import React from 'react';
import LoadingTemplate from '../components/loadingTemplate';
import Router from 'next/router';

const configJson = import('../static/appConfig.json');

export default class RegisterWithFingerprintLoading extends React.Component {
  constructor(props) {
    super(props);
    this.fingerprintInterval = null;
    this.pageTimeout = null;
  }

  componentDidMount() {
    this.pageTimeout = setTimeout(() => {
      Router.push('/');
    });

    setTimeout(() => {
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
  
  componentWillUnmount() {
    clearTimeout(this.pageTimeout);
  }
  

  static async getInitialProps({ req, query }) {
    const config = await configJson
    return { config }
  }

  readFingerprint = (retry = 0) => {
    if(retry != this.props.confg.maxRetry) {
      const piIp = this.props.config.piIp;
      let urlIsUseFingerprint = piIp + 'finger/valid';
      let urlStartReadFingerprint = piIp + 'finger/start';
      let urlFinishReadFingerprint = piIp + 'finger/finish';

      return new Promise((resolve, reject) => {
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
            resolve(true);
          }
        })
        .catch(err => {
          console.log(err);
          this.setTimeout(() => {
            this.readFingerprint(++retry);
          }, 1000)
        })
      });
    }
    else {
      Router.push('/login');
    }
  }

  render() {
    return (
      <LoadingTemplate text='กำลังลงทะเบียนด้วยลายนิ้วมือ...'></LoadingTemplate>
    );
  }
}
