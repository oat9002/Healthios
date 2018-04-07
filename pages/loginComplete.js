import React from 'react';
import CompleteTemplate from '../components/completeTemplate';
import Router from 'next/router';
import PropTypes from 'prop-types';

registerComplete.propTypes = {
  url: PropTypes.object
};

export default class registerComplete extends React.Component {

  componentDidMount() {
    setTimeout(() => {
      Router.push({ pathname: '/welcome', query: { first: this.props.url.query.first } });
    }, 3000);  
  }

  render() {
    return(
      <CompleteTemplate text='เข้าสู่ระบบสำเร็จ'></CompleteTemplate>
    );
  }
}
