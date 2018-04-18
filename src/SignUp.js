import React from 'react';
import { deleteCookie, getLoginCookieName, makeServerCall } from './ServerCallHelper.js';
import { withRouter } from 'react-router';
import { hideSplashScreen, showLoadMask, hideLoadMask } from './LoadMaskHelper.js';
import Flexbox from 'flexbox-react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';

class SignUp extends React.Component {

    render() {
        hideSplashScreen();

        return(
            <Dialog
                actions = {
                    [    ]
                }
                overlayStyle = {{ backgroundColor: 'white' }}
                contentStyle = {{ width:'30%', maxWidth: "none" }}
                modal = { true }
                open = { true }
            >   
                <div>
                    <div className="imgcontainer" style = {{ height:"50px", fontSize: '18px', textAlign: "center" }} >
						<img src="./img/spade.png" alt="Avatar" className="avatar" width="50px" height="50px"/>
                    </div>
					
					
					<div style = {{ textAlign: "center" }} >
						<TextField
						  id='UserText'
						  hintText="Username Field"
						  floatingLabelText="Username"
						  fullWidth={true}
						/><br />
						<TextField
						  id='PassText'
						  hintText="Password Field"
						  floatingLabelText="Password"
						  type="password"
						  fullWidth={true}
						/><br />
						<TextField
						  id='Name'
						  hintText="Name Field"
						  floatingLabelText="Name"
						  fullWidth={true}
						/><br />
						<TextField
						  id='Email'
						  hintText="lee@example.com"
						  floatingLabelText="Email"
						  fullWidth={true}
						/><br />
                    </div>
					
					<div className="imgcontainer" style = {{ height:"30px", fontSize: '18px', textAlign: "center" }} >
						
                    </div>
					
					<Flexbox className="ButtonContainer" flexDirection="row">
							<RaisedButton label="Sign Up" primary={true} onClick={this.onClickReset} fullWidth={true}/>
					</Flexbox>
					
					<div className="imgcontainer" style = {{ height:"10px", fontSize: '18px', textAlign: "center" }} >
						
                    </div>
                </div>  
            </Dialog>
        );
    }
}

export default SignUp;