import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Head from 'next/head';

export default class Register extends React.Component {
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
