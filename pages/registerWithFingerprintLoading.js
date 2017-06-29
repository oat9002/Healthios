import React from 'react';
import LoadingTemplate from '../components/loadingTemplate';

export default class RegisterWithFingerprintLoading extends React.Component {
  render() {
    return (
      <LoadingTemplate text='กำลังลงทะเบียนด้วยลายนิ้วมือ...'></LoadingTemplate>
    );
  }
}
