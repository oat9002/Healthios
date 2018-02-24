import React from 'react';
import Router from 'next/router';
import Head from 'next/head';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import Loading from './loading'

const configJson = import('../static/appConfig.json');

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isLoading: false
    };
    const mockUrl = 'http://localhost:55442';
    this.piIp = mockUrl != null ? mockUrl : this.props.config.piIp;
    this.serverIp = this.props.config.serverIp;
    this.cardInterval = null;
    this.fingerprintInterval = null;
    this.insertCard = this.insertCard.bind(this);
    this.readFingerprint = this.readFingerprint.bind(this)
  }

  static async getInitialProps({ req, query }) {
    const config = await configJson
    return { config }
  }

  componentWillMount() {
    let urlStartCardReading = this.piIp + '/thid/start';
    axios.get(urlStartCardReading).then(res => {});
  }

  componentDidMount() {
    this.insertCard();
    this.readFingerprint();
  }

  insertCard() {
    let urlIsInsertCard = this.piIp + '/thid/valid';
    let urlIsCardReadable = this.piIp + '/thid/readable';
    let urlLogin = this.serverIp + '/api/auth/login';
    let urlGetData = this.piIp + '/thid';

    this.cardInterval = setInterval(() => {
      axios.get(urlIsInsertCard)
      .then(resInsertCard => {
        return resInsertCard.data.status;
      })
      .then(status => {
        if(status) {
          return axios.get(urlIsCardReadable)
          .then(resIsCardReadable => {
            return resIsCardReadable.data.status;
          });
        }
      })
      .then(status => {
        if(status) {
          this.setState({
            isLoading: true
          });
          axios.get(urlGetData)
          .then(resGetData => {
            axios({
              url: urlLogin,
              auth: {
                username: resGetData.data.data.idNumber,
                password: resGetData.data.data.idNumber
              }
            }).then(resLogin => {
              if(typeof(Storage) !== "undefined") {
                localStorage.setItem('data', JSON.stringify(resLogin.data));
              }
              Router.push('/welcome');
            }).catch(err => {
              if(err.response.status == 401) {
                Router.push({pathname: '/registerWithCardLoading', query: {first: 'card', patientInfo: resGetData.data.data}});
              }
            })
          })
        }
      })
      .catch(err => {
        console.log(err);
      })
    }, 1000);
  }

  readFingerprint() {
    let urlIsUseFingerprint = this.piIp + 'finger/valid';
    let urlStartReadFingerprint = this.piIp + 'finger/start';
    let urlFinishReadFingerprint = this.piIp + 'finger/finish';
    let urlGetData = this.piIp + 'finger';

    this.fingerprintInterval = setInterval(() => {
      axios.get(urlIsUseFingerprint)
      .then(res => {
        console.log('use fingerprint: ' + res.data.status)
        return res.data.status;
      })
      .then(isUseFingerPrint => {
        if(isUseFingerPrint) {
          return axios.get(urlStartReadFingerprint)
          .then(res => {
            console.log('start reading fingerprint: ' + res.data.status)
            return res.data.status;
          })
        }
      })
      .then(isStartReadFingerprint => {
        if(isStartReadFingerprint) {
          return axios.get(urlFinishReadFingerprint)
          .then(res => {
            console.log('finnish reading fingerprint: ' + res.data.status)
            return res.data.status
          })
        }
      })
      .then(isFinishReadFingerprint => {
        if(isFinishReadFingerprint) {
          this.setState({
            isLoading: true
          });
          return axios.get(urlGetData)
          .then(res => {
            if(res.data.staus) {
                console.log('get data: ' + res.data.status)
                return res.data.data
            }
            return null;
          })
        }
      })
      .then(idNumber => {
        if(idNumber != null) {
          axios({
            url: urlLogin,
            auth: {
              username: idNumber,
              password: idNumber
            }
          }).then(resLogin => {
            if(typeof(Storage) !== "undefined") {
              //call server to get customer data
            }
            Router.push('/welcome');
          }).catch(err => {
            if(err.response.status == 401) {
              Router.push({pathname: '/registerWithFingerprintLoading', query: {first: 'fingerprint'}});
            }
          })
        }
      })
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.cardInterval);
    clearInterval(this.fingerprintInterval);
  }

  render() {
    let isLoading = this.state.isLoading;

    return (
      <MuiThemeProvider>
        {isLoading ? (
          <Loading></Loading>
        ) : (
          <div className='content'>
            <Head>
              <link href="https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai" rel="stylesheet" />
              <link href="/static/css/animate.css" rel="stylesheet" />
            </Head>
            <div>
              <span className='emph'>แตะ</span><span>นิ้วบนเครื่องแสกนลายนิ้วมือ</span>
              <br/>
              <img src='/static/pics/fingerprints.svg'/>
            </div>
            <div>
              <span>หรือ</span>
            </div>
            <div>
              <span className='emph'>เสียบ</span><span>บัตรประชาชน</span>
              <br/>
              <img className='slideInUp animated infinite' src="/static/pics/id.png"/>
            </div>
            <br/>
            {/* <button id='submit' onClick={() => Router.push('/register')}>Register</button> */}
            <style jsx>{`
            // #submit {
            //   margin-top: 50px;
            //   width: 100%;
            //   height: 50px;
            //   max-width: 200px;
            //   max-high: 50px;
            //   border-radius: 50px;
            //   border: 2px solid;
            //   background-color: white;
            //   color: black;
            //   font-size: 20px;
            //   transition: 0.8s;
            //   white-space: nowrap;
            // }
            // #submit:hover {
            //   background-color: black;
            //   color: white;
            //   transition: 0.8s;
            // }
            // #submit:active, #submit:focus, #submit.active {
            //   background-image: none;
            //   outline: 0;
            //   -webkit-box-shadow: none;
            //               box-shadow: none;
            // }
            div {
              width: 100%
              text-align: center;
            }
            img {
              heigh: auto;
              width: 20%;
            }
            span {
              font-size: 4em;
            }
            .emph {
              font-size: 5em;
              font-weight: 300;
            }
            `}</style>
          <style jsx global>{`
            .content {
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            body {
              background-color: #f7f7f7;
              font-family: Kanit;
              color: #393939;
              animation: fadein 1s;
              font-weight: 200;
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
