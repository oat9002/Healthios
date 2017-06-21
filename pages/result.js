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
          </Head>
          <h1 className="bounce animated center">Your information</h1>
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
                          Name(Thai)
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
                          Name(English)
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
                          Age
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
                          Date of Birth
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
                          Address
                        </td>
                        <td className='value'>
                          493 Narkbunrung Soi BumrungMueng Road Klongmahanark Sub-district
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
            div {
              font-family: Roboto Light;
            }
            .profile {

            }
            .center {
              text-align: center;
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
              display: block;
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
        </div>
      </MuiThemeProvider>
    );
  }
}
