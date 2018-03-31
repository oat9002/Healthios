import React from 'react';
import CompleteTemplate from '../components/completeTemplate';
import Router from 'next/router';

export default class registerComplete extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      Router.push('/registerResult');
    }, 3000);
  }

  render() {
    return (
      <CompleteTemplate text='ลงทะเบียนสำเร็จ'></CompleteTemplate>
    );
  }
}
