import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const Index = () => (
  <MuiThemeProvider>
    <div id='content'>
      <p id='title'>Healthios</p>
      <p id='description'>The future of self-care</p>
      <button id='start'>Let's start</button>
      <style jsx>{`
        #content {
          position: fixed;
          text-align: center;
          font-family: Roboto Light;
          top: 35%;
          left: 45%;
          transform: translate(-35%, -45%);
        }
        #title {
          font-size: 96px;
          color: #999999;
          margin-bottom: 2%;
        }
        #description {
          margin-bottom: 10%
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
    </div>
  </MuiThemeProvider>
)

export default Index
