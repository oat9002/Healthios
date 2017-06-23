import Router from 'next/router';
import Head from 'next/head';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const Login = () => (
  <MuiThemeProvider>
    <div className='content'>
      <Head>
        <link href="https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai" rel="stylesheet" />
        <link href="/static/css/animate.css" rel="stylesheet" />
      </Head>
      <div>
        <span>แตะนิ้วบนเครื่องแสกนลายนิ้วมือ</span>
        <br/>
        <img src='/static/pics/fingerprints.svg'/>
      </div>
      <div>
        <span>หรือ</span>
      </div>
      <div>
        <span>เสียบบัตรประชาชน</span>
        <br/>
        <img className='slideInUp animated infinite' src="/static/pics/id.png"/>
      </div>
      <br/>
      {/* <button id='submit' onClick={() => Router.push('/register')}>Register</button> */}
      <style jsx>{`
        #submit {
          margin-top: 50px;
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
        #submit:hover {
          background-color: black;
          color: white;
          transition: 0.8s;
        }
        #submit:active, #submit:focus, #submit.active {
          background-image: none;
          outline: 0;
          -webkit-box-shadow: none;
                      box-shadow: none;
        }
        div {
          text-align: center;
          width: 50%;
        }
        img {
          heigh: 40%
          width: 40%
        }
        span {
          font-size: 48px
        }
        `}</style>
        <style jsx global>{`
          .content {
            display: flex:
            justify-content: center;
            align-items: center;
            margin-left: 13%;
            margin-top: 13%;
          }
          body {
            background-color: #f7f7f7;
            font-family: Kanit;
            color: #393939;
            animation: fadein 1s;
          }
          @keyframes fadein {
              from { opacity: 0; };
              to   { opacity: 1; };
          }
        `}</style>
    </div>
  </MuiThemeProvider>
)

export default Login
