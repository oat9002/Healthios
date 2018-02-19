import React from 'react';
import Router from 'next/router';
import Head from 'next/head';
import { Card, CardMedia, CardText, CardTitle } from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Divider from 'material-ui/Divider';

export default class MeasurementResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weight: '',
      height: '',
      pressure: '',
      thermal: '',
      pulse: '',
    };
  }

  componentWillMount() {
    if(typeof(Storage) != 'undefined') {
      this.setState({
        weight: localStorage.getItem('weight'),
        height: localStorage.getItem('height'),
        pressure: localStorage.getItem('pressure'),
        thermal: localStorage.getItem('thermal'),
        pulse: localStorage.getItem('pulse')
      });
    }
  }

  render() {
    const textStyle = {
      fontFamily: 'Kanit',
      fontWeight: 300,
      fontSize: '28px'
    }
    const divider = {
      'width': '60%',
      'marginLeft': '20%'
    }

    return (
      <MuiThemeProvider>
        <div>
          <Head>
            <link href="https://fonts.googleapis.com/css?family=Kanit:200,400" rel="stylesheet"/>
            <link href="/static/css/animate.css" rel="stylesheet" />
          </Head>
          <div className='template'>
            <div>
              <img src="/static/pics/weight.jpg" className='image' />
            </div>
            <div className="content">
              น้ำหนัก {this.state.weight} กก.
            </div>
          </div>
          <Divider style={divider}/>
          <div className='template'>
            <div>
              <img src="/static/pics/height.jpg" className='image'/>
            </div>
            <div className="content">
              ส่วนสูง {this.state.height} ซม.
            </div>
          </div>
          <Divider style={divider}/>
          <div className='template'>
            <div>
              <img src="/static/pics/temperature.jpg" className='image'/>
            </div>
            <div className="content">
              อุณหภูมิ {this.state.thermal} องศาเซลเซียส
            </div>
          </div>
          <Divider style={divider}/>
          <div className='template'>
            <div>
              <img src="/static/pics/bloodPressure.png" className='image'/>
            </div>
            <div className="content">
              ความดันเลือดเฉลี่ย 
              <br />ความดันเลือดต่ำสุด
              <br />ความดันเลือดสูงสุด
            </div>
          </div>
          <Divider style={divider}/>
          <div className='template'>
            <div>
              <img src="/static/pics/heartRate.jpg" className='image'/>
            </div>
            <div className="content">
              อัตราหารเต้นหัวใจ
            </div>
          </div>
          <style jsx>{`
            .template {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 1%;
              margin-bottom: 1%;
            }
            .image {
              width: 200px;
              height: auto;
            }
            .content{
              font-size: 2.5em;
              margin-left: 10%;
            }
          `}</style>
          <style jsx global>{`
            body {
              font-family: Kanit;
              color: #393939;
              animation: fadein 1s;
              background-color: #f7f7f7;
            }
            @keyframes fadein {
                from { opacity: 0; };
                to   { opacity: 1; };
            }
          `}</style>
        </div>
      </MuiThemeProvider>
    );
  }
}
