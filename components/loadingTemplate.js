import React from 'react';
import Head from 'next/head';
import LinearProgress from 'material-ui/LinearProgress';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class LoadingTemplate extends React.Component {
  render() {
    return(
      <MuiThemeProvider>
        <div>
          <Head>
            <link href="https://fonts.googleapis.com/css?family=Kanit:200,400" rel="stylesheet"/>
            <link href="/static/css/animate.css" rel="stylesheet" />
          </Head>
          <div className='content'>
            <p className='pulse animated infinite'>{this.props.text}</p>
            <div>
              <LinearProgress  mode="indeterminate"></LinearProgress>
            </div>
          </div>
          <style jsx>{`
            .content {
              position: absolute;
              top: 30%;
              text-align: center;
              width: 100%;
            }
            .content div{
              margin-left: 10%;
              width: 80%;
            }
            p {
              font-size: 60px;
              margin-bottom: 0;
            }
          `}</style>
          <style jsx global>{`
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
      </MuiThemeProvider>
    );
  }
}
