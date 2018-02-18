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

  componentDidMount() {
    setInterval(() => {
      Router.push('/welcome')
    }, 5000)
  }

  render() {
    let textStyle = {
      fontFamily: 'Kanit',
      fontWeight: 300,
      fontSize: '28px'
    }
    let contentStyle = {
      display: 'flex',
      justifyContent: 'space-between'
    }

    return (
      <MuiThemeProvider>
        <div>
          <Head>
            <link href="https://fonts.googleapis.com/css?family=Kanit:200,400" rel="stylesheet"/>
            <link href="/static/css/animate.css" rel="stylesheet" />
          </Head>
          <div className='template'>
            <div className='content'>
              <Card>
                <CardMedia overlay={<CardTitle title='60 กก.' titleStyle={textStyle}></CardTitle>}>
                  <img src="/static/pics/weight.jpg" />
                </CardMedia>
              </Card>
            </div>
            <div className='content'>
              <Card>
                <CardMedia overlay={<CardTitle title='170 ซม.' titleStyle={textStyle}></CardTitle>}>
                  <img src="/static/pics/height.jpg" />
                </CardMedia>
              </Card>
            </div>
            <div className='content'>
              <Card>
                <CardMedia>
                  <img src="/static/pics/bloodPressure.jpg" />
                </CardMedia>
                <CardText style={textStyle}>
                  <div style={contentStyle}>
                    <div>
                      ความดันต่ำสุด
                    </div>
                    <div>
                      60 mmHg.
                    </div>
                  </div>
                  <div style={contentStyle}>
                    <div>
                      ความดันเฉลี่ย
                    </div>
                    <div>
                      80 mmHg.
                    </div>
                  </div>
                  <div style={contentStyle}>
                    <div>
                      ความดันสูงสุด
                    </div>
                    <div>
                      130 mmHg.
                    </div>
                  </div>
                </CardText>
              </Card>
            </div>
          </div>
          <div className='template'>
            <div className='content'>
              <Card>
                <CardMedia>
                  <img src="/static/pics/temperature.jpg" />
                </CardMedia>
                <CardText style={textStyle}>
                  <div style={contentStyle}>
                    <div>
                      อุณหภูมิ
                    </div>
                    <div>
                      37 องศาเซลเซียส
                    </div>
                  </div>
                </CardText>
              </Card>
            </div>
            <div className='content'>
              <Card>
                <CardMedia>
                  <img src="/static/pics/heartRate.jpg" />
                </CardMedia>
                <CardText style={textStyle}>
                  <div style={contentStyle}>
                    <div>
                      อัตราการเต้นหัวใจ
                    </div>
                    <div>
                      70 ครั้ง/นาที
                    </div>
                  </div>
                </CardText>
              </Card>
            </div>
            <div className='content'>
              <Card>
                <CardMedia>
                  <img src="/static/pics/weight.jpg" />
                </CardMedia>
                <CardText style={textStyle}>
                  60kg
                </CardText>
              </Card>
            </div>
          </div>
          <style jsx>{`
            .template {
              display: flex;
              justify-content: center;
              margin-top: 3%;
              margin-left: 5%;
              margin-right: 5%;
            }
            .content {
              width: 20%;
              margin: 0 1% 1% 1%;
            }
            table {
              text-align: center;
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
