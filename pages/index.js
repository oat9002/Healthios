import React from 'react';
import Router from 'next/router';
import Head from 'next/head';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import Loading from './loading';
import cryptoJs from 'crypto-js';

const configJson = import('../static/appConfig.json');

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isLoading: false
    };
    this.piIp = this.props.config.piIp;
    this.serverIp = this.props.config.serverIp;
    this.insertCard = this.insertCard.bind(this);
    this.readFingerprint = this.readFingerprint.bind(this)
  }

  static async getInitialProps({ req, query }) {
    const config = await configJson
    return { config }
  }

  componentDidMount() {
    this.insertCard();
    this.readFingerprint();
  }

  

  insertCard() {
    let urlIsStart = this.piIp + '/thid/start'
    let urlIsInsertCard = this.piIp + '/thid/valid';
    let urlIsCardReadable = this.piIp + '/thid/readable';
    let urlLogin = this.serverIp + '/api/auth/login';
    let urlGetData = this.piIp + '/thid';

    axios.get(urlIsStart)
    .then(resStart => {
      return resStart.data.status;
    })
    .then(status => {
      if(status) {
        return axios.get(urlIsInsertCard)
      }
    })
    .then(resIsInsertCard => {
      if(resIsInsertCard !== 'undefined' && resIsInsertCard.data.status) {
        return axios.get(urlIsCardReadable)
      }
    })
    .then(resIsCardReadable => {
      if(resIsCardReadable !== 'undefined' && resIsCardReadable.data.status) { 
        this.setState({
          isLoading: true
        });

        axios.get(urlGetData)
        .then(resGetData => {
          axios({
            url: urlLogin,
            auth: {
              username: resGetData.data.data.idNumber,
              password: resGetData.data.data.birthOfDate.replace(/\//g, '')
            }
          }).then(resLogin => {
            if(typeof(Storage) !== "undefined") {
              localStorage.setItem('data', cryptoJs.AES.encrypt(JSON.stringify(resLogin.data.user), this.props.config.aesSecret).toString());
              localStorage.setItem('token', resLogin.data.token);
            }
            Router.push('/loginComplete');
          }).catch(err => {
            if(err.response.status == 401) {
              Router.push({pathname: '/registerWithCard', query: {first: 'card'}});
            }
            else {
              console.log(err);
              setTimeout(() => {
                this.insertCard();
              }, 1000);
            }
          })
        })
      }
      else {
        setTimeout(() => {
          this.insertCard();
        }, 1000);
      }
    })
    .catch(err => {
      console.log(err);
      setTimeout(() => {
        this.insertCard();
      }, 1000);
    })
  }

  readFingerprint() {
    let urlStartReadFingerprint = this.piIp + '/finger/start/scan';
    let urlIsUseFingerprint = this.piIp + '/finger/valid/scan';
    let urlCompareFingerprint = this.piIp + '/finger/valid/compare';
    let urlGetData = this.piIp + '/finger';
    let urlLogin = this.serverIp + '/api/auth/login';
    let isStart = false;

    if(!isStart) {
      axios.get(urlStartReadFingerprint)
      .then(res => {
        if(res.data.status) {
          isStart = true;
        }
        else {
          setTimeout(() => {
            this.readFingerprint()
          });
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
          return axios.get(urlCompareFingerprint)
          .then(res => {
            return res.data.status;
          })
        }
        else {
          setTimeout(() => {
            this.readFingerprint()
          });
        }
      })
      .then(isCompareFinish => {
        if(isCompareFinish) {
          return axios.get(urlGetData)
          .then(res => {
            if(res.data.status) {
              return res.data.data.idNumber;
            }
            return null;
          })
        }
        else {
          setTimeout(() => {
            this.readFingerprint()
          });
        }
      })
      .then(userKey => {
        if(userKey != null) {
          this.setState({
            isLoading: true
          });

          axios({
            url: urlLogin,
            auth: {
              username: 'kmitl-test2',
              password: 'test1234'
            },
            headers : {
              'x-user-key': userKey
            }
          }).then(resLogin => {
            if(typeof(Storage) !== "undefined") {
              localStorage.setItem('data', cryptoJs.AES.encrypt(JSON.stringify(resLogin.data.user), this.props.config.aesSecret).toString());
              localStorage.setItem('token', resLogin.data.token);
            }
            Router.push('/loginComplete');
          }).catch(err => {
            console.log(err);
            setTimeout(() => {
              this.readFingerprint()
            });
          })
        }
        else {
          Router.push({pathname: '/registerWithFingerprintLoading', query: {first: 'fingerprint'}});
        }
      }) 
    }
  }

  render() {
    let isLoading = this.state.isLoading;

    return (
      <MuiThemeProvider>
        {isLoading ? (
          <Loading></Loading>
        ) : (
          <div>
            <Head>
              <link href="https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai" rel="stylesheet" />
              <link href="/static/css/animate.css" rel="stylesheet" />
            </Head>
            <div>
              <img className='rubberBand bounce animated' id='logo' src="/static/pics/logo.png" />
            </div>
            <div className='content'>
              <div>
                <span className='emph'>แตะ</span><span>นิ้วบนเครื่องแสกนลายนิ้วมือ</span>
                <br/>
                <img className='pulse animated infinite' src='/static/pics/fingerprints.svg'/>
              </div>
              <div id='center'>
                <span>หรือ</span>
              </div>
              <div>
                <span className='emph'>เสียบ</span><span>บัตรประชาชน</span>
                <br/>
                <img className='slideInUp animated infinite' src="/static/pics/id.png"/>
              </div>
            </div>
            {/* <button id='submit' onClick={() => Router.push('/register')}>Register</button> */}
            <style jsx>{`
              #center {
                width 20%;
              }
              div {
                width: 100%
                text-align: center;
                margin-top: 3%;
                margin-bottom: 3%;
              }
              #logo {
                width: 20%;
                height: auto;
              }
              img {
                heigh: auto;
                width: 40%;
              }
              span {
                font-size: 3em;
              }
              .emph {
                font-size: 5em;
                font-weight: 300;
              }
            `}</style>
          <style jsx global>{`
            .content {
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
            }
            body {
              background-color: #f7f7f7;
              font-family: Kanit;
              color: #393939;
              animation: fadein 1s;
              font-weight: 200;
              overflow: hidden;
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
