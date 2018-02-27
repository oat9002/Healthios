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
        pressure: JSON.parse(localStorage.getItem('pressure')),
        thermal: localStorage.getItem('thermal'),
        pulse: localStorage.getItem('pulse')
      });
    }
  }

  componentDidMount() {
    setTimeout(() => {
      Router.push('/final');
    }, 5000);
  }

  render() {
    const textStyle = {
      fontFamily: 'Kanit',
      fontWeight: 300,
      fontSize: '28px'
    }
    const divider = {
      'width': '70%',
      'marginLeft': '15%'
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
              น้ำหนัก <span className='emphValue'>{this.state.weight}</span> กก.
            </div>
          </div>
          <Divider style={divider}/>
          <div className='template'>
            <div>
              <img src="/static/pics/height.jpg" className='image'/>
            </div>
            <div className="content">
              ส่วนสูง <span className='emphValue'>{this.state.height}</span> ซม.
            </div>
          </div>
          <Divider style={divider}/>
          <div className='template'>
            <div>
              <img src="/static/pics/temperature.jpg" className='image'/>
            </div>
            <div className="content">
              อุณหภูมิ <span className='emphValue'>{this.state.thermal}</span>  ํC
            </div>
          </div>
          <Divider style={divider}/>
          <div className='template'>
            <div>
              <img src="/static/pics/bloodPressure.png" className='image'/>
            </div>
            <div className="content">
              ความดัน<span className='emph'>เฉลี่ย</span> <span className='emphValue'>{this.state.pressure[1]}</span> mmHg
              <br />ความดัน<span className='emph'>ต่ำ</span>สุด <span className='emphValue'>{this.state.pressure[0]}</span> mmHg
              <br />ความดัน<span className='emph'>สูง</span>สุด <span className='emphValue'>{this.state.pressure[2]}</span> mmHg
            </div>
          </div>
          <Divider style={divider}/>
          <div className='template'>
            <div>
              <img src="/static/pics/heartRate.jpg" className='image'/>
            </div>
            <div className="content">
              อัตราการเต้นหัวใจ <span className='emphValue'>{this.state.pulse}</span> ครั้ง/นาที
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
            .emph {
              font-weight: 400;
            }
            .emphValue {
              font-weight: 400;
              font-size: 2em;
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
              font-weight: 200;
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
