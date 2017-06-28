import React from 'react';

export default class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentWillMount() {
    if(typeof(Storage) !== "undefined") {
      this.setState({
        data: JSON.parse(localStorage.getItem('data'))
      });
    }
  }

  render() {
    return(
      <div>
        Welcome! {this.state.data.token}
      </div>
    );
  }
}
