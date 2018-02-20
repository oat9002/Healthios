import React from 'react';
import Head from 'next/head';
import Router from 'next/Router';

export default class RegisterWithFingerprint extends React.Component {
  constructor(props) {
    super(props);
    this.fingerprintInterval = null;
  }

  componentDidMount() {
    this.readFingerprint();
  }

  readFingerprint = () => {
    const mockUrl = 'http://203.151.85.73:55442/';
    let urlIsUseFingerprint = mockUrl + 'finger/valid';
    let urlStartReadFingerprint = mockUrl + 'finger/start';
    let urlFinishReadFingerprint = mockUrl + 'finger/finish';
    let urlGetData = mockUrl + 'finger';
    this.setTimeout(() => {
      this.fingerprintInterval = setInterval(() => {
        axios.get(urlIsUseFingerprint)
        .then(res => {
          return res.data.status;
        })
        .then(isUseFingerPrint => {
          if(isUseFingerPrint) {
            Router.push({pathname: '/registerWithFingerprintLoad', query: {first: this.props.query.first}});
          }
        })
        .catch(err => {
          console.log(err);
        })
      }, 1000);
    }, 3000)
  }

  componentWillUnmount() {
    clearInterval(this.fingerprintInterval);
  }

  render() {
    return (
      <div className='content'>
        <Head>
          <link href="https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai" rel="stylesheet" />
          <link href="/static/css/animate.css" rel="stylesheet" />
        </Head>
        <div>
          <span>กรุณา<span className='emph2'>แตะ</span>นิ้วบนเครื่องแสกนลายนิ้วมือ</span>
          <br/>
          <img className='pulse animated infinite' src="/static/pics/fingerprints.svg"/>
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
