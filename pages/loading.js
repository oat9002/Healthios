import React from 'react';
import Head from 'next/head';
import LinearProgress from 'material-ui/LinearProgress';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class Loading extends React.Component {
  render() {
    return(
      <MuiThemeProvider>
        <div>
          <Head>
            <link href="https://fonts.googleapis.com/css?family=Kanit:300,400" rel="stylesheet"/>
            <link href="/static/css/animate.css" rel="stylesheet" />
          </Head>
          <div>
            <p className='pulse animated infinite'>กำลังทำงาน...</p>
            <LinearProgress  mode="indeterminate"></LinearProgress>
          </div>
          <style jsx>{`
            div {
              margin-top: 20%;
              text-align: center;
              margin-left: 20%;
              margin-right: 20%;
            }
            p {
              font-size: 36px;
              margin-bottom: 0;
            }
          `}</style>
          <style jsx global>{`
            body {
              font-family: Kanit Light;
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
      </MuiThemeProvider>
    );
  }
}
