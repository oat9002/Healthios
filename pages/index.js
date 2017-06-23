import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Router from 'next/router';
import Head from 'next/head';

export default class Index extends React.Component {
  render() {
    return(
      <MuiThemeProvider>
        <div id='content'>
          <Head>
            <link href="https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai" rel="stylesheet" />
          </Head>
          <span id='title'>Healthios</span>
          <span id='description'>by KMITL</span>
          {/* <button id='start' onClick={() => Router.push('/login')}>Let's start</button> */}
          <style jsx>{`
            #content {
              position: fixed;
              text-align: center;
              top: 45%;
              left: 45%;
              transform: translate(-35%, -45%);
            }
            #title {
              font-size: 96px;
            }
            #description {
              text-align: right;
            }
            #start {
              width: 100%;
              height: 50px;
              max-width: 200px;
              max-high: 50px;
              border-radius: 50px;
              border: 2px solid;
              background-color: white;
              color: black;
              font-size: 20px;
              transition: 0.8s;
              white-space: nowrap;
            }
            #start:hover {
              background-color: black;
              color: white;
              transition: 0.8s;
            }
            #start:active, #start:focus, #start.active {
              background-image: none;
              outline: 0;
              -webkit-box-shadow: none;
                          box-shadow: none;
            }
            `}
          </style>
          <style jsx global>{`
            body {
              font-family: Kanit;
              background-color: #f7f7f7;
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
