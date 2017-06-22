import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Divider from "material-ui/Divider";
import Paper from "material-ui/Paper";
import Head from "next/head";

export default class extends React.Component {
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
            <link href="https://fonts.googleapis.com/css?family=Kanit:300,400" rel="stylesheet"/>
          </Head>
          <h1 className="bounce animated title">ข้อมูลส่วนตัว</h1>
          <div className="content">
            <Paper className='profile' zDepth={2} style={{marginRight: '50px', height:'300px', width:'auto'}}>
              <img className='pic' src="/static/pics/1.jpg"/>
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
                          สรัล รักวิจิตรศิลป์
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
                          Sarun Rakwijitsil
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
                          อายุ(ปี)
                        </td>
                        <td className='value'>
                          22
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
                          วันเกิด(ไทย)
                        </td>
                        <td className='value'>
                          1 ธ.ค. 2537
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
                          วันเกิด(อังกฤษ)
                        </td>
                        <td className='value'>
                          1 Dec 1994
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
                          493 ซ.นาคบำรุง แขวงคลองมหานาค เขตป้อปราบฯ
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
              padding: 5px 5px 5px 5px
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
              width: 200px
              font-weight: bold;
            }
            .value {
              max-width:200px;
              word-wrap:break-word;
            }
          `}</style>
          <style jsx global>{`
            body {
              font-family: Kanit Light;
              color: #393939;
              background-color: #f7f7f7;
            }
          `}</style>
        </div>
      </MuiThemeProvider>
    );
  }
}
