import React from 'react';
import QRCode from 'qrcode.react';
import Head from 'next/head';
import Router from 'next/router';

export default class QrCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qrData: ''
    };
  }

  componentDidMount() {
    setTimeout(() => {
      Router.push('/final');
    }, 15000);
  }
  

  componentWillMount() {
    if(typeof(Storage) !== 'undefined') {
      let data = JSON.parse(localStorage.getItem('registerCardInfo'));
      this.setState({
        qrData: data //Fixme 
      });
    }
  }
  

  render() {
    return (
      <div>
        <Head>
          <link href="https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai" rel="stylesheet" />
          <link href="/static/css/animate.css" rel="stylesheet" />
        </Head>
        <div className='content'>
          <div className='txt'>
            scan this qrcode to change your password on monile application
          </div>
          <div className='qr'>
            <QRCode value={ this.state.qrValue === undefined ? 'www.google.co.th' : this.state.qrData } size={ 128 * 4 }/>
          </div>
        </div>
        <style jsx>{`
          .txt {
            font-size: 4em;
            margin-top: 6%;
            margin-bottom: 3%;
          }
          .content {
            width: 100%;
            text-align: center;
          }
        `}
        </style>
        <style jsx global>{`
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
