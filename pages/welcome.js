import React from 'react';

export default class Welcom extends React.Component {
  render() {
    return(
      <div>
        Welcome! {localStorage.getItem('data')}
      </div>
    );
  }
}
