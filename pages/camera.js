import React from 'react';
import Webcam from 'react-webcam';

class Camera extends React.Component {
  constructor(props) {
    super(props);
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    console.log(imageSrc);
  };

  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: 'user'
    };

    return (
      <div>
        <Webcam
          audio={false}
          height={800}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={800}
          videoConstraints={videoConstraints}
        />
        <button onClick={this.capture}>Capture photo</button>
      </div>
    );
  }
  
}

export default Camera;