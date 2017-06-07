const Login = () => (
  <div>
    <p>Tap your finger to fingerprint scanner</p>
    <img src='/static/pics/fingerprints.svg'/>
    <style jsx>{`
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
