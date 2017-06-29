import React from 'react';
import Router from 'next/router';
import Head from 'next/head';

export default class MeasurementResult extends React.Component {
  render() {
    return (
      <div>
        {localStorage.getItem('weight')}
        <br/>
        {localStorage.getItem('height')}
        <br/>
        {localStorage.getItem('pressure')}
        <br/>
        {localStorage.getItem('thermal')}
        <br/>
        {localStorage.getItem('pulse')}
        <br/>
      </div>
    );
  }
}
