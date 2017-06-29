import React from 'react';
import Head from 'next/head';
import Router from 'next/router';

export default class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentWillMount() {
    if(typeof(Storage) !== "undefined") {
      this.setState({
        data: JSON.parse(localStorage.getItem('data'))
      });
    }
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
          <span>ยินดีต้อนรับ</span><br/> {data ? data.user.thaiFullName : 'someone'}
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
