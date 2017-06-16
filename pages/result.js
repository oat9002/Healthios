import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

export default class extends React.Component {
    render() {
        const style = {
            marginLeft: 20,
        }

        return (
            <MuiThemeProvider>
              <div>
                <h1>Result</h1>
                <div className='content'>
                  <div className='col' >
                    <Paper zDepth={2}>
                        <TextField hintText="First name" style={style} underlineShow={false} />
                        <Divider />
                        <TextField hintText="Middle name" style={style} underlineShow={false} />
                        <Divider />
                        <TextField hintText="Last name" style={style} underlineShow={false} />
                        <Divider />
                        <TextField hintText="Email address" style={style} underlineShow={false} />
                    </Paper>
                  </div>
                  <div className='col'>
                    <Paper zDepth={2}>
                      <TextField hintText="First name" style={style} underlineShow={false} />
                        <Divider />
                        <TextField hintText="Middle name" style={style} underlineShow={false} />
                        <Divider />
                        <TextField hintText="Last name" style={style} underlineShow={false} />
                        <Divider />
                        <TextField hintText="Email address" style={style} underlineShow={false} />
                        <Divider />
                    </Paper>
                  </div>
                </div>
              <style jsx>{`
                .content {
                  display: flex;
                  justify-content: space-between;
                  flex-direction: row;
                }
                .col {
                  width: 100%;
                  margin: 0 3px 3px 3px;
                }
                `}</style>
              </div>
            </MuiThemeProvider>
        );
    }
}
