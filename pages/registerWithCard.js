import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Head from 'next/head';
import Router from 'next/router';
import axios from 'axios';

export default class registerWithCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isLoading: false
    };
    this.piIp = 'http://161.246.6.201:8080';
    this.serverIp = 'http://203.151.85.73:8080';
    this.cardInterval = null;
    this.fingerprintInterval = null;
    this.insertCard = this.insertCard.bind(this);
  }
  componentDidMount() {
    this.insertCard();
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
            Router.push({pathname: '/registerWithCardLoading', query: {first: 'fingerprint'}})
          }
        })
        .catch(err => {
          console.log(err);
        })
      }, 1000);
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.cardInterval);
  }

  render() {
    return(
      <div className='content'>
        <Head>
          <link href="https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai" rel="stylesheet" />
          <link href="/static/css/animate.css" rel="stylesheet" />
        </Head>
        <div>
          <span>กรุณา<span className='emph2'>เสียบ</span>บัตรประชาชน</span>
          <br/>
          <img className='slideInUp animated infinite' src="/static/pics/id.png"/>
        </div>
        <style jsx>{`
          img {
            heigh: 20%;
            width: 20%;
          }
          span {
            font-size: 48px;
          }
          .emph {
            font-size: 74px;
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