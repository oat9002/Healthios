import React from 'react';
import Divider from 'material-ui/Divider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import Head from 'next/head';
import PropTypes from 'prop-types';

const resultTemplate = (props) => {
  return (
    <MuiThemeProvider>
      <div>
        <Head>
          <title>Result</title>
          <link href='/static/css/animate.css' rel='stylesheet' />
          <link href='https://fonts.googleapis.com/css?family=Kanit:200,300&amp;subset=thai' rel='stylesheet' />
        </Head>
        <h1 className='bounce animated title'>ข้อมูลส่วนตัว</h1>
        <div className='content'>
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
                        {props.thaiName}
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
                        {props.engName}
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
                        {props.gender}
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
                        {props.age}
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
                        {props.dateOfBirth}
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
                        {props.address}
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
                        {props.idNumber}
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
};

resultTemplate.propTypes = {
  thaiName: PropTypes.string.isRequired,
  engName: PropTypes.string.isRequired,
  age: PropTypes.string.isRequired,
  dateOfBirth: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  idNumber: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired
};

export default resultTemplate;
