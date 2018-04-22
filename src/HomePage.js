import React from 'react';
import { connect } from 'react-redux';
import { hideSplashScreen } from './LoadMaskHelper.js';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { withRouter } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import ComponentLoadMask from './ComponentLoadMask.js';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import { makeServerCall } from './ServerCallHelper.js';
import Flexbox from 'flexbox-react';


class HomePage extends React.Component {
	
	
	state = {
		passwordPromptDialogOpen: false,
		activeGamesList:[],
		selectedGameListIndex: null
    };
	
	componentDidMount(){
		//make call to get the list of active games and then update the state.
		//make call to get the data from the server and then create rows.
		var activeGamesList = [{
			id:'G001',
			nameOfInitiatingPlayer: 'Jhanvi Rafalia',
			numOfPlayers: '0/4',
			passwordProtected: true,
			password: 'qwerty'
		},{
			id:'G002',
			nameOfInitiatingPlayer: 'Aditya Trivedi',
			numOfPlayers: '3/4',
			passwordProtected: false
		}];
		
		this.setState({activeGamesList: activeGamesList});
	}
	
	gotoGamePlayArea(){
		this.props.history.push('/game');
	}
	
	onSuccessJoinGame(){
		
		//Make Servercall indicating the request of user to join.
		this.gotoGamePlayArea();
	}
	
	openCloseDialog(type,open){
		
		switch(type){
			case 'PasswordPrompt':
				this.setState({passwordPromptDialogOpen: open});
			break;
		}
	
	}
	
	refreshActiveGameList(){
		//make server call to get the list of active games
		//set the state of active games.
		this.setState({activeGamesList: []});
	}
	
	createActiveGameRows(){
		var rows = [];
		for(var index=0;index<this.state.activeGamesList.length;index++)
		{
			let temp = index;
			rows.push(
				<TableRow key = { index } style = {{ height:'24px' }}>
					<TableRowColumn>{this.state.activeGamesList[index].id}</TableRowColumn>
					<TableRowColumn>{this.state.activeGamesList[index].nameOfInitiatingPlayer}</TableRowColumn>
					<TableRowColumn>{this.state.activeGamesList[index].numOfPlayers}</TableRowColumn>
					{this.state.activeGamesList[index].passwordProtected ? <TableRowColumn><i className="fa fa-lock fa-2x" /></TableRowColumn> : <TableRowColumn></TableRowColumn>}
					<TableRowColumn>
						{ this.state.activeGamesList[index].passwordProtected ?
							<RaisedButton 
								primary={true} 
								label="Join"
								onClick={() =>  {this.setState({selectedGameListIndex: temp}); this.openCloseDialog('PasswordPrompt',true);} } 
								
							/>
						:
							<RaisedButton 
								primary={true} 
								label="Join" 
								onClick={this.onSuccessJoinGame.bind(this)}
							/>
						}
					</TableRowColumn>
				</TableRow>
			);
		}
		
		return rows;
	}
	
	createHistoryRows(list){
		var rows=[];
		
		for(var index=0;index<this.props.UserInfo.historyGamesList.length;index++)
		{
			let temp = index;
			rows.push(
				<TableRow key = { index } style = {{ height:'24px' }}>
					<TableRowColumn>{this.props.UserInfo.historyGamesList[index].date}</TableRowColumn>
					<TableRowColumn>{this.props.UserInfo.historyGamesList[index].result}</TableRowColumn>
					<TableRowColumn>{this.props.UserInfo.historyGamesList[index].score}</TableRowColumn>
					<TableRowColumn>{this.props.UserInfo.historyGamesList[index].coinsEarned}</TableRowColumn>
				</TableRow>
			);
		}
		
		return rows;
	}
	
	render() {
		hideSplashScreen();
		var activeGamesRows = this.createActiveGameRows();
		var historyRows = this.createHistoryRows();
		var context = this;
		return (
			<div>
			{/*<AppBar
					title={
						<div onClick={this.gotoGamePlayArea.bind(this)}>
							Welcome To Spades
						</div>
					}
					iconElementLeft={<div />}
				/>*/}
				
				
				
				<Flexbox className="HomeOuterContainer" flexDirection="column" minHeight="100vh">
					<Flexbox className="HomeTopOuterContainer" flexDirection="row" flexGrow={1} >
						
						
						{/* User Information Card */}
						<Paper 
							style={{
									  flex:1,
									  margin: 20,
									  textAlign: 'center',
									  display: 'inline-block',
							}} 
							zDepth={2}>
						
						<Flexbox 
							flexDirection="row"
							
						>
							{/* Avatar Container */}
							<Flexbox 
								flexGrow={1}
								style={{
									margin: 20,
									textAlign: 'center',
									display: 'inline-block',
								}} 
							>
								<Avatar
								  id="userAvatar"
								  size={100}
								  src="./img/spade.png"
								  backgroundColor="white"
								  style={{margin: 5, flex:1}}
								/>
							</Flexbox>
							
							{/* User Information Container */}
							<Flexbox 
								flexGrow={3}
								style={{
									margin: 20,
									textAlign: 'center',
									display: 'inline-block',
								}}
							>
								<h1>{this.props.UserInfo.infoDetails.name}</h1>
								<br />
								<hr />
								
								{/* USER STATS */}
								<Flexbox 
									flexDirection="row"
									style={{
										margin: 20,
										textAlign: 'center',
										display: 'inline-block',
									}}
								>
									<Flexbox 
										flexGrow={1}
										style={{
											margin: 20,
											textAlign: 'center',
											display: 'inline-block',
										}}
									>
										<h2>Games Played </h2> <br />
										 <span style={{fontSize: "25px"}}> {this.props.UserInfo.userStatistics.gamesPlayed} < /span>
									</Flexbox>
									
									<Flexbox 
										flexGrow={1}
										style={{
											margin: 20,
											textAlign: 'center',
											display: 'inline-block',
										}}
									>
										<h2> Win/Loss </h2><br />
										<span style={{fontSize: "25px"}}> {this.props.UserInfo.userStatistics.winLoss} </span>
									</Flexbox>
									
									<Flexbox 
										flexGrow={1}
										style={{
											margin: 20,
											textAlign: 'center',
											display: 'inline-block',
										}}
									>
										<h2> Coins </h2> <br />
										<span style={{fontSize: "40px"}}> {this.props.UserInfo.userStatistics.coins} </span>
									</Flexbox>
									
								</Flexbox>
							</Flexbox>
							
						</Flexbox>
							
						</Paper>
						
						{/* History */}
						<Paper 
							style={{
								  flex:1,
								  margin: 20,
								  textAlign: 'center',
								  display: 'inline-block',
								  overflow: 'auto'
							}}
							zDepth={2} >
							
							<Table
									selectable={true}
								>
									<TableHeader
										displaySelectAll={false}
										adjustForCheckbox={false}
									>
									  <TableRow>
										<TableHeaderColumn>Date</TableHeaderColumn>
										<TableHeaderColumn>Win/Loss</TableHeaderColumn>
										<TableHeaderColumn>Final Score</TableHeaderColumn>
										<TableHeaderColumn>Coins Earned</TableHeaderColumn>
									  </TableRow>
									
									</TableHeader>
									
									<TableBody
										displayRowCheckbox={false}
									>
									{historyRows}
									  
									</TableBody>
								</Table>
							
						</Paper>
					</Flexbox>
					
					{/* Active Games */}
					<Flexbox className="HomeBottomOuterContainer" flexDirection="column" element="header" flexGrow={1} >
						<Paper 
							style={{
									  flex:1,
									  margin: 20,
									  textAlign: 'center',
									  display: 'inline-block',
									  overflow: 'auto'
							}} 
							zDepth={2} >
								
								<Table
									selectable={true}
								>
									<TableHeader
										displaySelectAll={false}
										adjustForCheckbox={false}
									>
									  <TableRow>
										<TableHeaderColumn>Game ID</TableHeaderColumn>
										<TableHeaderColumn>Initiating Player</TableHeaderColumn>
										<TableHeaderColumn>Players</TableHeaderColumn>
										<TableHeaderColumn>Password Protected</TableHeaderColumn>
										<TableHeaderColumn><RaisedButton primary={true} label="Refresh" onClick={this.refreshActiveGameList.bind(this)}/></TableHeaderColumn>
									  </TableRow>
									
									</TableHeader>
									
									<TableBody
										displayRowCheckbox={false}
									>
									
									{activeGamesRows}
									  
									</TableBody>
								</Table>
						</Paper>
					</Flexbox>
				</Flexbox>
				
				
				
				{/* Password Prompt Dialog */}
				<Dialog
				  title="Password Prompt"
				  modal={false}
				  open={this.state.passwordPromptDialogOpen}
				  onRequestClose={() => this.openCloseDialog('PasswordPrompt',false)}
				>
				This game is password protected. Please note that all passowords are a maximum of 10 characters. Please enter the password. <br />
					<TextField
					  id="gameJoinPassword"
					  type="password"
					/><br />
					<label id="err" style={{color:'red'}}>{context.state.lblErrText}</label>
					<RaisedButton 
						label="Join" 
						onClick={() => {
								context.setState({lblErrText: ""});
								if(document.getElementById('gameJoinPassword').value.length < 11 && context.state.activeGamesList[context.state.selectedGameListIndex].password === document.getElementById('gameJoinPassword').value)
								{
									context.openCloseDialog('PasswordPrompt',false);
									//make server call for player to join.
									context.onSuccessJoinGame();
								}else{
									context.setState({lblErrText: "Incorrect Password or Too Long"});
								}
							}
						} 
						primary={true}/>
				</Dialog>
				
				
				
				<FloatingActionButton 
                    style = {{
                        top: '5px',
                        right: '5px',
                        position: 'absolute',
                        zIndex: '10',
                    }} 
					backgroundColor = 'white'
                    onClick = { () => this.props.history.push('/logout') }
                >
                    <i 
                        className = "fa fa-2x fa-times" 
                        style = {{
							color:'red',
                        }}
                    /> 
                </FloatingActionButton>
				
			</div>
		);
	}
}


/**
 * Maps portions of the store to props of your choosing
 * @param state: passed down through react-redux's 'connect'
 **/
const mapStateToProps = function(state){
  return {
	  UserInfo: state.globalObject.UserInfo
  }
}

export default withRouter(connect(mapStateToProps)(HomePage));