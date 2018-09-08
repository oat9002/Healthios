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
    this.pageTimeout = null;
    this.retryTimeout = null;
    this.isStart = false;
  }

  static async getInitialProps({ req, query }) {
    const config = await configJson
    return { config }
  }

  componentDidMount() {
    this.process();
    this.pageTimeout = setTimeout(() => {
      Router.push('/');
    }, this.props.config.pageTimeout)
  }

  componentWillUnmount() {
    clearTimeout(this.pageTimeout);
    clearTimeout(this.retryTimeout);
  }

  process = () => {
    let urlStartReadFingerprint = this.props.config.piIp + '/finger/start/template';
    let urlReadFingerprint = this.props.config.piIp + '/finger/valid/template1';
    let urlReadFingerprint2 = this.props.config.piIp + '/finger/valid/template2';
    let urlIsFinish = this.props.config.piIp + '/finger/template';
    let urlRegister = this.props.config.serverIp + '/api/auth/register/fingerprint';

    if(!this.isStart) {
      axios.get(urlStartReadFingerprint)
        .then(resStartReadFingerprint => {
          if(resStartReadFingerprint.data.status) {
            this.isStart = true;
            this.process();
          }
          else {
            this.retryProcess();
          }
        })
        .catch(err => {
          console.log(err);
          this.retryProcess();
        })
    }
    else {
      axios.get(urlReadFingerprint)
        .then(resReadFingerprint => {
          return resReadFingerprint.data.status;
        })
        .then(status => {
          if(status) {
            if(!this.state.nextState) {
              this.setState({
                nextState: true
              });
            }
           
            return axios.get(urlReadFingerprint2);
          }
        })
        .then(resReadFingerprint2 => {
          if(resReadFingerprint2 !== undefined && resReadFingerprint2.data.status) {
            return axios.get(urlIsFinish);
          }
        })
        .then(resIsFinish => {
          if(!this.state.isRegister) {
            this.setState({
              isRegister: true
            });
          }

          if(resIsFinish !== undefined && resIsFinish.data.status) {
            axios.post(urlRegister, 
              {
                'userId': JSON.parse(localStorage.getItem('registerCardInfo')).user._id,
                'fingerPrint': [resIsFinish.data.data]
              },
              { 
                headers : {
                  'X-Station-Key': '5ab75943167f6f116e668a85',
                  'X-Provider-Key': '5ab75831edfaaa6507e1e010'
                }
              }
            )
            .then(resRegister => {
              if(!resRegister.data.error) {
                if(typeof(Storage) !== undefined) {
                  localStorage.setItem('registerFingerprintInfo', JSON.stringify(resRegister.data));
                }
                
                Router.push('/registerComplete');
              }
              else {
                this.retryProcess();
              }
            })
            .catch(err => {
              console.log(err);
              this.retryProcess();
            })
          }
          else {
            this.retryProcess();
          }
        })
        .catch(err => {
          console.log(err);
          this.retryProcess();
        })
    }
  }

  retryProcess = () => {
    this.retryTimeout = setTimeout(this.process, this.props.config.retryTimeout);
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
            !this.state.nextState ? 
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
