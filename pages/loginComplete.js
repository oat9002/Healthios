import React from 'react';
import CompleteTemplate from '../components/completeTemplate';
import Router from 'next/router';

export default class registerComplete extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      Router.push('/welcome');
    }, 5000)  
  }

  render() {
    return(
      <CompleteTemplate text='เข้าสู่ระบบสำเร็จ'></CompleteTemplate>
    );
  }
}
