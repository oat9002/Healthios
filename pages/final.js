import React from 'react';
import Router from 'next/router';
import Head from 'next/head';

export default class Final extends React.Component {
  render() {
    return (
      <div className='content'>
        <Head>
          <link href="https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai" rel="stylesheet" />
          <link href="/static/css/animate.css" rel="stylesheet" />
        </Head>
        <span>กรุณาดึงบัตรประชาชนออกเพื่อจบการทำงาน</span>
        <style jsx>{`
          .content {
            font-size: 60px;
            text-align: center;
            margin-top: 20%;
          }
          img {
            vertical-align:middle;
          }
        `}</style>
        <style jsx global>{`
          body {
            font-family: Kanit;
            color: #393939;
            background-color: #f7f7f7;
            animation: fadein 1s;
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
