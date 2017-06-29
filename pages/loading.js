import React from 'react';
import LoadingTemplate from '../components/loadingTemplate';

export default class Loading extends React.Component {
  render() {
    return (
      <LoadingTemplate text='กำลังทำงาน...'></LoadingTemplate>
    );
  }
}
