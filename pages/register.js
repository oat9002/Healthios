import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Head from 'next/head';
import Router from 'next/router';
import axios from 'axios';

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.piIp = 'http://161.246.6.201:8080';
    this.serverIp = 'http://203.151.85.73:8080'
    this.interval = null;
  }

  componentDidMount() {
    let urlIsInsertCard = this.piIp + '/thid/valid';
    let urlIsCardReadablt = this.piIp + '/thid/readable';
    let urlGetData = this.piIp + '/thid';
    let urlRegister = this.serverIp + '/api/auth/register';
    let status = false;
    setTimeout(() => {
      this.interval = setInterval(() => {
        axios.get(urlIsInsertCard)
        .then(resInsertCard => {
          if(resInsertCard.data.status) {
            axios.get(urlIsCardReadablt)
            .then(resCardReadable => {
              if(resCardReadable.data.status) {
                axios.get(urlGetData)
                .then(resGetData => {
                  let data = resGetData.data.data;
                  axios.post(urlRegister, data)
                  .then(resRegister => {
                    if(typeof(Storage) !== "undefined") {
                      localStorage.setItem('data', JSON.stringify(resRegister.data));
                    }
                    Router.push('/registerComplete');
                  })
                })
              }
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
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return(
      <div className='content'>
        <Head>
          <link href="https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai" rel="stylesheet" />
          <link href="/static/css/animate.css" rel="stylesheet" />
        </Head>
        <div>
          <span className='emph'>ไม่พบข้อมูลผู้ใช้</span>
          <br/>
          <span>กรุณา<span className='emph2'>เสียบ</span>บัตรประชาชนเพื่อลงทะเบียน</span>
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
