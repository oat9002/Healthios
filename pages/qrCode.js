import React from 'react';
import QRCode from 'qrcode.react';
import Head from 'next/head';
import Router, { withRouter } from 'next/router';

class QrCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qrData: ''
    };
  }

  componentDidMount() {
    this.setQrcode();
    setTimeout(() => {
      Router.replace('/final');
    }, 15000);
  }

  setQrcode = () => {
    if(typeof(Storage) !== 'undefined') {
      let data = JSON.parse(sessionStorage.getItem('registerResult'));
      this.setState({
        qrData: data.user.firstTimeKey //Fixme 
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
            แสกน QR Code เพื่อเปลี่ยนรหัสผ่านแอปพลิเคชัน
          </div>
          <div className='qr'>
            <QRCode value={ this.state.qrValue === '' ? 'www.google.co.th' : this.state.qrData } size={ 128 * 4 }/>
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

export default withRouter(QrCode);