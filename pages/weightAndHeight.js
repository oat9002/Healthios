import React from 'react';
import Head from 'next/head';

export default class WeightAndHeight extends React.Component {
  render() {
    return(
      <div className='content'>
        <Head>
          <link href="https://fonts.googleapis.com/css?family=Kanit:200,400" rel="stylesheet"/>
          <link rel="stylesheet" href="/static/css/animate.css"/>
        </Head>
        <span>กรุณายืนให้ตรงรูปและยืนหลังตรง</span><br/>
        <img className='pulse animated infinite' src="/static/pics/footprint.png" alt=""/>
        <style jsx>{`
          span {
            font-size: 74px;
          }
        `}</style>
        <style jsx global>{`
          .content {
            position: absolute;
            top: 25%;
            width: 100%;
            text-align: center;
          }
          body {
            font-family: Kanit;
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
