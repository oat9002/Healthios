import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Head from 'next/head';
import Router from 'next/router';
import axios from 'axios';

const configJson = import('../static/appConfig.json');

export default class registerWithCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isLoading: false
    };
    this.piIp = this.props.config.piIp;
    this.serverIp = this.props.config.serverIp;
    this.cardInterval = null;
    this.fingerprintInterval = null;
    this.insertCard = this.insertCard.bind(this);
    this.pageTimeout = null;
  }

  static async getInitialProps({ req, query }) {
    const config = await configJson
    return { config }
  }

  componentDidMount() {
    this.insertCard();
    this.pageTimeout = setTimeout(() => {
      Router.push('/');
    }, this.props.config.pageTimeout)
  }

  insertCard() {
    let urlIsInsertCard = this.piIp + '/thid/valid';
    let urlIsCardReadable = this.piIp + '/thid/readable';
    let urlLogin = this.serverIp + '/api/auth/login';
    let urlGetData = this.piIp + '/thid';
    setTimeout(() => {
      this.cardInterval = setInterval(() => {
        axios.get(urlIsInsertCard)
        .then(resInsertCard => {
          return resInsertCard.data.status;
        })
        .then(status => {
          if(status) {
            axios.get(urlIsCardReadable)
            .then(resIsCardReadable => {
              return resIsCardReadable.data.status;
            })
          }
        })
        .then(status => {
          if(status) {
            axios.get(urlGetData)
            .then(res => {
              Router.push({pathname: '/registerWithCardLoading', query: {first: this.props.query.first, patientInfo: res.data.data}})
            })
            .catch(err => {
              console.log(err);
            })
          }
        })
        .catch(err => {
          console.log(err);
        })
      }, 1000);
    }, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.cardInterval);
    clearTimeout(this.pageTimeout);
  }

  render() {
    return(
      <div className='content'>
        <Head>
          <link href="https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai" rel="stylesheet" />
          <link href="/static/css/animate.css" rel="stylesheet" />
        </Head>
        <div>
          <span>กรุณา<span className='emph'>เสียบ</span>บัตรประชาชน</span>
          <br/>
          <img className='slideInUp animated infinite' src="/static/pics/id.png"/>
        </div>
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
    );
  }
}
