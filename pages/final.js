import React from 'react';
import Router, { withRouter } from 'next/router';
import Head from 'next/head';
import * as Logging from '../services/logging';
import * as Config from '../static/appConfig.json';
import axios from 'axios';

class Final extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCardInsert: false
    };

    this.pageTimeout = null;
    this.retryCheckDeattachCardTimeout = null;
  }

  componentDidMount() {
    this.pageTimeout = setTimeout(() => {
      Router.replace('/');
    }, Config.pageTimeout);

    this.checkDeattachCard();
  }

  componentWillUnmount() {
    clearTimeout(this.pageTimeout);
    clearTimeout(this.retryCheckDeattachCardTimeout);
  }

  checkDeattachCard = async () => {
    let urlIsInsertCard = Config.piIp + '/thid/valid';

    try {
      const resIsInsertCard = await axios.get(urlIsInsertCard);
      if (resIsInsertCard === undefined || resIsInsertCard.data.status) {
        this.setState({
          isCardInsert: true
        });
        throw new Error('Card is still inserted or validate failed.');
      }

      Router.replace('/');
    }
    catch (err) {
      Logging.sendLogMessage('Check deattach card failed', err);
      this.retryCheckDeattachCard();
    }
  }

  retryCheckDeattachCard = () => {
    this.retryCheckDeattachCardTimeout = setTimeout(this.checkDeattachCard, 1000);
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isCardInsert
          ? (
            <div className='content'>
              <Head>
                <link href="https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai" rel="stylesheet" />
                <link href="/static/css/animate.css" rel="stylesheet" />
              </Head>
              <span>เสร็จสิ้นการทำงาน</span>
              <br />
              <span className='sub'>กรุณาดึงบัตรประชาชนออก</span>
              <style jsx>{`
              .sub {
                font-size: 0.3em;
              }
              .content {
                font-size: 7em;
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
          )
          : null}
      </React.Fragment>

    );
  }
}

export default withRouter(Final);
