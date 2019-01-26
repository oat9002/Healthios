import React from 'react';
import CompleteTemplate from '../components/completeTemplate';
import Router, { withRouter } from 'next/router';

class LoginComplete extends React.Component {

  componentDidMount() {
    setTimeout(() => {
      Router.replace({ pathname: '/welcome'});
    }, 3000);  
  }

  render() {
    return(
      <CompleteTemplate text='เข้าสู่ระบบสำเร็จ'></CompleteTemplate>
    );
  }
}

export default withRouter(LoginComplete);
