import React from 'react';
import Head from 'next/head';
import Router, { withRouter } from 'next/router';
import cryptoJs from 'crypto-js';
import * as Config from '../static/appConfig.json';

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    const decryptUserInfo = cryptoJs.AES.decrypt(sessionStorage.getItem('userInfo'), Config.aesSecret).toString(cryptoJs.enc.Utf8);

    this.setState({
      data: JSON.parse(decryptUserInfo)
    });

    setTimeout(() => {
      Router.replace('/weightAndHeight');
    }, 5000);
  }

  render() {
    let data = this.state.data;

    return(
      <div>
        <Head>
          <link href="https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai" rel="stylesheet" />
          <link rel="stylesheet" href="/static/css/animate.css"/>
        </Head>
        <div className='content'>
          <span>ยินดีต้อนรับ</span><br/> {data ? data.id_card.thaiFullName : 'someone'}
        </div>
        <style jsx>{`
          .content {
            position: absolute;
            width: 100%;
            text-align: center;
            top: 35%;
            font-size: 56px;
            font-weight: 300;
          }
          span {
            font-size: 64px;
            font-weight: bold;
          }
        `}</style>
        <style jsx global>{`
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
    );
  }
}

export default withRouter(Welcome);
