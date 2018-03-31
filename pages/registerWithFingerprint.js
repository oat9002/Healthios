import React from 'react';
import Head from 'next/head';
import LoadingTemplate from '../components/loadingTemplate';
import Router from 'next/router';
import axios from 'axios';

const configJson = import('../static/appConfig.json');

export default class RegisterWithFingerprint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextState: false,
      isRegister: false
    };
    this.fingerprintInterval = null;
    this.pageTimeout = null;
  }

  static async getInitialProps({ req, query }) {
    const config = await configJson
    return { config }
  }

  componentDidMount() {
    this.readFingerprint();
    this.pageTimeout = setTimeout(() => {
      Router.push('/');
    }, this.props.config.pageTimeout)
  }

  componentWillUnmount() {
    clearTimeout(this.pageTimeout);
  }

  readFingerprint = () => {
    const piIp = this.props.config.piIp
    let urlStartReadFingerprint = piIp + '/finger/start/scan';
    let urlIsUseFingerprint = piIp + '/finger/valid/scan';
    let isStart = false;
    
    setTimeout(() => {
      this.fingerprintInterval = setInterval(() => {
        if(!isStart) {
          axios.get(urlStartReadFingerprint)
          .then(res => {
            if(res.data.status) {
              isStart = true;
            }
          })
        }
        else {
          axios.get(urlIsUseFingerprint)
          .then(res => {
            return res.data.status;
          })
          .then(isUseFingerPrint => {
            if(isUseFingerPrint) {
              Router.push({pathname: '/registerWithFingerprintLoading', query: {first: this.props.query.first}});
            }
          })
          .catch(err => {
            console.log(err);
          })
        }
      }, 1000);
    }, 3000)
  }

  componentWillUnmount() {
    clearInterval(this.fingerprintInterval);
  }

  scanStateRender = () => {
    return !this.state.nextState ? 
    (
      <div>
        <span>กรุณา<span className='emph'>แตะ</span>นิ้วบนเครื่องแสกนลายนิ้วมือ</span>
        <br/>
        <img className='pulse animated infinite' src="/static/pics/fingerprints.svg"/>
      </div>
    ) : (
      <div>
        <span>กรุณา<span className='emph'>แตะ</span>นิ้วบนเครื่องแสกนลายนิ้วมือ<span className='emph'>อีกครั้ง</span></span>
        <br/>
        <img className='pulse animated infinite' src="/static/pics/fingerprints.svg"/>
      </div>
    )
  }

  render() {
    return (
      <div className='content'>
        <Head>
          <link href="https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai" rel="stylesheet" />
          <link href="/static/css/animate.css" rel="stylesheet" />
        </Head>
        {
          !this.state.isRegister ? (
            this.scanStateRender()
          ) : (
            <LoadingTemplate text='กำลังลงทะเบียนด้วยลายนิ้วมือ...'></LoadingTemplate>
          )
        }
      
        <style jsx>{`
          img {
            heigh: auto;
            width: 30%;
          }
          span {
            font-size: 4em;
          }
          .emph {
            font-size: 2em;
            font-weight: bold;
          }
          `}</style>
          <style jsx global>{`
            .content {
              text-align: center;
              margin-top: 13%;
            }
            body {
              font-family: Kanit;
              font-weight: 200;
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
    );
  }
}
