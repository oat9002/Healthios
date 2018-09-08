import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LoadingTemplate from '../components/loadingTemplate';
import Head from 'next/head';
import Router from 'next/router';
import axios from 'axios';

const configJson = import('../static/appConfig.json');

export default class registerWithCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFromCard: false,
      isLoading: false
    };
    this.piIp = this.props.config.piIp;
    this.serverIp = this.props.config.serverIp;
    this.fingerprintInterval = null;
    this.pageTimeout = null;
    this.retryTimeout = null;
  }

  static async getInitialProps({ req, query }) {
    const config = await configJson
    return { config }
  }

  setIsFromCard() {
    if(this.props.url.query.first === 'card' && !this.state.isFromCard) {
      this.setState({
        isFromCard: true,
      });
    }
  }

  componentDidMount() {
    this.setIsFromCard();
    this.process();
    this.pageTimeout = setTimeout(() => {
      Router.push('/');
    }, this.props.config.pageTimeout)
  }

  componentWillUnmount() {
    clearTimeout(this.pageTimeout);
    clearTimeout(this.retryTimeout);
  }

  prepareDataForRegister = (data) => {
    let dateOfBirth = parseInt(data.birthOfDate.substring(0,2));
    let monthOfBirth = parseInt(data.birthOfDate.substring(3,5));
    let yearOfBirth = parseInt(data.birthOfDate.substring(6, data.birthOfDate.length));

    data.birthOfDate = yearOfBirth + '-' + monthOfBirth + '-' + dateOfBirth;
  }

  process = () => {
    let urlIsInsertCard = this.piIp + '/thid/valid';
    let urlIsCardReadable = this.piIp + '/thid/readable';
    let urlLogin = this.serverIp + '/api/auth/login';
    let urlGetData = this.piIp + '/thid';

    axios.get(urlIsInsertCard)
    .then(resInsertCard => {
      return resInsertCard.data.status;
    })
    .then(status => {
      if(status) {
        if(!this.state.isLoading) {
          this.setState({
            isLoading: true
          });
        }
       
        return axios.get(urlIsCardReadable)
      }
    })
    .then(resIsCardReadable => {
      if(resIsCardReadable !== undefined && resIsCardReadable.data.status) {
        axios.get(urlGetData)
        .then(res => {
          this.register(res.data.data);
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

  register = (patientInfo) => {
    let urlRegister = this.props.config.serverIp + '/api/auth/register/card';

    this.prepareDataForRegister(patientInfo);

    axios.post(urlRegister, 
      patientInfo, 
      { 
        headers : {
          'X-Station-Key': '5ab75943167f6f116e668a85',
          'X-Provider-Key': '5ab75831edfaaa6507e1e010'
        },
        auth: {
          username: 'kmitl-test2',
          password: 'test1234'
        } 
      }
    )
    .then(resRegister => {
      if(typeof(Storage) !== undefined) {
        localStorage.setItem('registerCardInfo', JSON.stringify(resRegister.data));
      }

      Router.push({ pathname: '/registerWithFingerprint', query: { first: this.props.url.query.first }});
    })
    .catch(err => {
      console.log(err);
      this.retryProcess();
    })
  }

  retryProcess = () => {
    this.retryTimeout = setTimeout(this.process, this.props.config.retryTimeout);
  }

  render() {
    return(
      <MuiThemeProvider>
        <div className='content'>
          <Head>
            <link href="https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai" rel="stylesheet" />
            <link href="/static/css/animate.css" rel="stylesheet" />
          </Head>
          {
            this.state.isFromCard || this.state.isLoading ? (
              <LoadingTemplate text='กำลังลงทะเบียนด้วยบัตรประชาชน...'></LoadingTemplate>
            ) : 
            (
              <div>
                <span>กรุณา<span className='emph'>เสียบ</span>บัตรประชาชน</span>
                <br/>
                <img className='slideInUp animated infinite' src="/static/pics/id.png"/>
              </div>
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
            .emph2 {
              font-weight: bold;
              color: blue;
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
      </MuiThemeProvider>
    );
  }
}
