import React from 'react';
import CompleteTemplate from '../components/completeTemplate';
import Router, { withRouter } from 'next/router';

class RegisterComplete extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      Router.replace('/registerResult');
    }, 3000);
  }

  render() {
    return (
      <CompleteTemplate text='ลงทะเบียนสำเร็จ'></CompleteTemplate>
    );
  }
}

export default withRouter(RegisterComplete);
