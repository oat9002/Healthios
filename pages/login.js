import Router from 'next/router';


const Login = () => (
  <div>
    <p>Tap your finger to fingerprint scanner</p>
    <img src='/static/pics/fingerprints.svg'/>
    <br/>
    <button id='submit' onClick={() => Router.push('/register')}>Register</button>
    <style jsx>{`
      form {
        position: fixed;
        text-align: center;
        top: 35%;
        left: 45%;
        transform: translate(-35%, -45%);
      }
      h1 {
        font-family: Roboto Light;
      }
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
        position: fixed;
        text-align: center;
        font-family: Roboto Light;
        top: 35%;
        left: 42%;
        transform: translate(-35%, -42%);
        animation: fadein 1s;
      }
      @keyframes fadein {
          from { opacity: 0; };
          to   { opacity: 1; };
      }
      p {
        font-size: 48px;
        color: #999999;
      }
      img {
        heigh: 10%
        width: 10%
      }
      `}</style>
  </div>
)

export default Login
