import React from 'react';
import Webcam from 'react-webcam';
import Head from 'next/head';
import Router from 'next/router';
import * as Config from '../static/appConfig.json';
import * as Utils from '../services/Utils';
import axios from 'axios';
import cryptoJs from 'crypto-js';

class Camera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 10,
    };

    this.countDown = null;
    this.pageTimeout = null;
  }

  componentDidMount() {
    this.countDown = setInterval(this.countDownToTakePicture, 1000);
    this.pageTimeout = setTimeout(() => {
      Router.replace('/');
    }, Config.pageTimeout);
  }

  componentWillUnmount() {
    clearTimeout(this.pageTimeout);
  }

  countDownToTakePicture = () => {
    let currentCounter = this.state.counter;

    if (currentCounter === 0) {
      clearInterval(this.countDown);
      this.capture();

      Router.replace('/weightAndHeight');
    }
    else {
      this.setState({
        counter: --currentCounter,
      });
    }
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imgData = this.webcam.getScreenshot();
    this.saveImgData(imgData);
  };

  saveImgData = async (imgData, retryCount = 0) => {
    const url = Config.serverIp + '/api/data/image';
    const blob = Utils.dataURItoBlob(imgData);
    const request = new FormData();
    request.append('profileImage', blob);

    const userId = sessionStorage.getItem('isLogin') === 'true'
      ? JSON.parse(cryptoJs.AES.decrypt(sessionStorage.getItem('userInfo'), Config.aesSecret).toString(cryptoJs.enc.Utf8))._id
      : JSON.parse(sessionStorage.getItem('registerResult')).data._id;

    try {
      const response = await axios.post(url, request, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-user-key': userId
        }
      });

      if (response.status !== 200 || response.status !== 201) {
        throw new Error(`Save image failed, Status: ${response.status}`);
      }
    }
    catch (err) {
      Utils.sendLogMessage('camera', err);

      if (retryCount !== 3) {
        this.saveImgData(imgData, ++retryCount);
      }
    }
  }

  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: 'user'
    };

    return (
      <React.Fragment>
        <Head>
          <link href="https://fonts.googleapis.com/css?family=Kanit:200,400" rel="stylesheet" />
          <link href="/static/css/animate.css" rel="stylesheet" />
        </Head>
        <div className='content'>
          <div>กรุณามองกล้องด้านบน</div>
          <Webcam
            style={{ textAlign: 'center' }}
            audio={false}
            ref={this.setRef}
            screenshotFormat="image/jpeg"
            width={1000}
            videoConstraints={videoConstraints}
          />
          <div className='counter'>{this.state.counter === 0 ? 'เรียบร้อย!' : this.state.counter}</div>
        </div>
        <style jsx>{`
          .counter {
            font-size: 2em;
            margin-top: 10px;
          }
          .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 900px;
          }
        `}
        </style>
        <style jsx global>{`
          body {
            font-family: Kanit;
            color: #393939;
            animation: fadein 1s;
            font-weight: bold;
            font-size: 3em;
            background-color: #f7f7f7;
          }
          @keyframes fadein {
              from { opacity: 0; };
              to   { opacity: 1; };
          }
        `}</style>
      </React.Fragment>

    );
  }
}

export default Camera;