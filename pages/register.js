import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';

const Register = () => (
  <MuiThemeProvider>
    <form action="#" method='POST'>
      <h1>Register</h1>
      <br/>
      <TextField floatingLabelText="Firstname" name='firstname'/>
      <br/>
      <TextField floatingLabelText="Lastname" name='lastname'/>
      <br/>
      <TextField multiLine={true} name='address' floatingLabelText='Address' style={{textAlign: 'left'}}></TextField>
      <br/>
      <TextField floatingLabelText="Email" type='email' name='email'/>
      <br/>
      <input id='submit' type="submit" value='Submit'/>
      <style jsx>{`
        form {
          position: fixed;
          text-align: center;
          top: 35%;
          left: 45%;
          transform: translate(-35%, -45%);
          animation: fadein 1s;
        }
        @keyframes fadein {
            from { opacity: 0; };
            to   { opacity: 1; };
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
        `}</style>
    </form>
  </MuiThemeProvider>
);

export default Register
