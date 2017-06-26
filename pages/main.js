import React from 'react';
import Index from './index'

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: true
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        valid: !this.state.valid
      });
    }, 2000)
  }

  render() {
    let valid = this.state.valid;

    return(
      <div>
        {valid ? (
          <Index></Index>
        ) : (
          <div>laksdjflkasjdflk;ajsdlk;fja;lskdjf;lkasdj</div>
        )}
      </div>
    );
  }
}
