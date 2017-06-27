import React from "react";
import Divider from "material-ui/Divider";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from "material-ui/Paper";
import Head from "next/head";
import PropTypes from 'prop-types';
import axios from 'axios';

export default class ResultTemplate extends React.Component {
  render() {
    const style = {
      marginLeft: 20
    };
    return (
      <MuiThemeProvider>
        <div>
          <Head>
            <title>Result</title>
            <link href="/static/css/animate.css" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai" rel="stylesheet" />
          </Head>
          <h1 className="bounce animated title">ข้อมูลส่วนตัว</h1>
          <div className="content">
            <Paper className='profile' zDepth={2} style={{marginRight: '50px', height:'300px', width:'auto'}}>
              <img className='pic' src={this.props.imgSrc}/>
            </Paper>
            <Paper zDepth={2}>
              <div className='info'>
                <div className='text'>
                  <table>
                    <tbody>
                      <tr>
                        <td className='key'>
                          ชื่อ(ไทย)
                        </td>
                        <td className='value'>
                          {this.props.thaiName}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Divider></Divider>
              </div>
              <div className='info'>
                <div className='text'>
                  <table>
                    <tbody>
                      <tr>
                        <td className='key'>
                          ชื่อ(อังกฤษ)
                        </td>
                        <td className='value'>
                          {this.props.engName}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Divider></Divider>
              </div>
              <div className='info'>
                <div className='text'>
                  <table>
                    <tbody>
                      <tr>
                        <td className='key'>
                          เพศ
                        </td>
                        <td className='value'>
                          {this.props.gender}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Divider></Divider>
              </div>
              <div className='info'>
                <div className='text'>
                  <table>
                    <tbody>
                      <tr>
                        <td className='key'>
                          อายุ
                        </td>
                        <td className='value'>
                          {this.props.age}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Divider></Divider>
              </div>
              <div className='info'>
                <div className='text'>
                  <table>
                    <tbody>
                      <tr>
                        <td className='key'>
                          วันเกิด
                        </td>
                        <td className='value'>
                          {this.props.dateOfBirth}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Divider></Divider>
              </div>
              <div className='info'>
                <div className='text'>
                  <table>
                    <tbody>
                      <tr>
                        <td className='key'>
                          ที่อยู่
                        </td>
                        <td className='value'>
                          {this.props.address}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <Divider></Divider>
                </div>
              </div>
              <div className='info'>
                <div className='text'>
                  <table>
                    <tbody>
                      <tr>
                        <td className='key'>
                          เลขประจำตัวประชาชน
                        </td>
                        <td className='value'>
                          {this.props.idNumber}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Paper>
          </div>
          <style jsx>{`
            .content {
              display: flex;
              justify-content: center;
            }
            .title {
              text-align: center;
              font-size: 50px;
            }
            .pic {
              width: auto;
              height: 300px;
            }
            .info {
              padding: 0px 5px 5px 5px
            }
            .text {
              padding-bottom: 5px
            }
            .longText {
              width: 100px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .key {
              font-family: Kanit;
              width: 200px
              font-weight: bold;
            }
            .value {
              font-family: Kanit;
              width:200px;
              word-wrap:break-word;
            }
          `}</style>
          <style jsx global>{`
            body {
              font-family: Kanit;
              font-weight: 200;
              color: #393939;
              background-color: #f7f7f7;
              animation: fadein 1s;
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

// ResultTemplate.propTypes = {
//   imgSrc: PropTypes.element.isRequired,
//   thaiName: PropTypes.element.isRequired,
//   engName: PropTypes.element.isRequired,
//   age: PropTypes.element.isRequired,
//   dateOfBirth: PropTypes.element.isRequired,
//   address: PropTypes.element.isRequired,
//   idNumber: PropTypes.element.isRequired,
//   gender: PropTypes.element.isRequired
// }
