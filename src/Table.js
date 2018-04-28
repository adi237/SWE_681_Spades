import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Flexbox from 'flexbox-react';
import { hideSplashScreen } from './LoadMaskHelper.js';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import ComponentLoadMask from './ComponentLoadMask.js';
import Dialog from 'material-ui/Dialog';
import socketIOClient from 'socket.io-client'
import Avatar from 'material-ui/Avatar';
import ListItem from 'material-ui/List/ListItem';
import NumberInput from 'material-ui-number-input';
import { makeServerCall } from './ServerCallHelper.js';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import './Card.css';

const style = {margin: 5};
const flexCenter = {alignItems: 'center'};


/*

card.rank

1 - A
2 - 2
3 - 3
..
10 - 10
11 - J
12 - Q
13 - K

card.suit

Suits:
0 - Spades
1 - Hearts 
2 - Clubs
3 - Diamond

*/

class GamePlayBoard extends Component {
	
	
	//if(this.props.GameInfo.gameInitiator == this.props.CurrentPlayerInfo.playerId) means that this is the server. Meaning all deals will happend here and then distributed to the players.
	componentDidMount() {
		var context = this;
		var centralContainerHeight = document.getElementsByClassName('CentralOuterContainer') ? document.getElementsByClassName('CentralOuterContainer')[0].clientHeight : "350px";
		var playArea = document.getElementById('CardPlayArea') ? document.getElementById('CardPlayArea') : null;
		
		if(playArea)
			playArea.style.height = centralContainerHeight + "px";
		
		window.onload = function(e){ 
			context.renderInitialDeck(context);
		}
	}
	
	deck;
	endpoint = "https://ec2-34-227-161-141.compute-1.amazonaws.com:5001"
	socket = socketIOClient(this.endpoint);
	//socket.emit(eventName, msg);
	state = {
		scoreCardDialogOpen: false,
		bidDialogOpen: false,
		bidValue: null,
		quitGameDialogOpen:false,
		bidErrorText: ''
    };
	
	renderInitialDeck(context){
		
		var cont = document.getElementById('container');
		
		this.deck = window.Deck();
		
		// add to DOM
		this.deck.mount(cont);
		this.deck.intro();
		this.deck.shuffle();
		this.deck.fan();
		
		
		/*this.deck.cards.forEach(function (card, i) {
			  card.enableDragging()
			  card.enableFlipping()
		});*/
		
		//context.dealCards();
	}

	openCloseDialog(type,open){
		
		switch(type){
			case 'ScoreCard':
				this.setState({scoreCardDialogOpen: open});
			break;
			case 'Bid':
				this.setState({bidDialogOpen: open});
			break;
			case 'Quit':
				this.setState({quitGameDialogOpen: open});
			break;
		}
	
	}
	
	dealCards(){
		var northAvatar = document.getElementsByClassName('NorthAvatar') ? document.getElementsByClassName('NorthAvatar')[0] : null;
		var NorthOuterContainer = document.getElementsByClassName('NorthOuterContainer') ? document.getElementsByClassName('NorthOuterContainer')[0] : null;
		var SouthContainer = document.getElementsByClassName('SouthContainer') ? document.getElementsByClassName('SouthContainer')[0] : null;
		var westAvatar = document.getElementsByClassName('WestAvatar') ? document.getElementsByClassName('WestAvatar')[0] : null;
		var eastAvatar = document.getElementsByClassName('EastAvatar') ? document.getElementsByClassName('EastAvatar')[0] : null;
		var southAvatar = document.getElementsByClassName('SouthAvatar') ? document.getElementsByClassName('SouthAvatar')[0] : null;
		
		
		//Update dealer
		

		var context = this;
		var counter=0;
		var randomVar;
		if(northAvatar && westAvatar && eastAvatar && southAvatar){
			this.deck.cards.forEach(function (card, i) {
				card.setSide('back');
				
				randomVar = i * 20;
				// explode
				//debugger;
				switch(i%4){
					case 0:
						context.cardAnimateTo(
							card,
							{
								i: i,
								x: northAvatar.getBoundingClientRect().x-(window.innerWidth/2) ,
								y: northAvatar.getBoundingClientRect().bottom-(window.innerHeight/2),
								onComplete: context.onCompleteCardDealingOthers(card,i,randomVar),
								randVar: randomVar
							}
						);
					break;
					case 1:
						context.cardAnimateTo(
							card,
							{
								i: i,
								x: eastAvatar.getBoundingClientRect().x-(window.innerWidth/2) ,
								y: eastAvatar.getBoundingClientRect().bottom-(window.innerHeight/2),
								onComplete: context.onCompleteCardDealingOthers(card,i,randomVar),
								randVar: randomVar
							}
						);
					break;
					case 2:
						context.cardAnimateTo(
							card,
							{
								i: i,
								x: southAvatar.getBoundingClientRect().x-100+counter-(window.innerWidth/2) ,
								y: SouthContainer.getBoundingClientRect().top-(window.innerHeight/2),
								onComplete: context.onCompleteCardDealingCurrentPlayer(card,i,randomVar,{x:southAvatar.getBoundingClientRect().x-100+counter-(window.innerWidth/2),y:SouthContainer.getBoundingClientRect().top-(window.innerHeight/2)}),
								randVar: randomVar
							}
						);
					break;
					case 3:
						context.cardAnimateTo(
							card,
							{
								i: i,
								x: westAvatar.getBoundingClientRect().x-(window.innerWidth/2) ,
								y: westAvatar.getBoundingClientRect().bottom-(window.innerHeight/2),
								onComplete: context.onCompleteCardDealingOthers(card,i,randomVar),
								randVar: randomVar
							}
						);
					break;
				}
				
				if(i%4==0)
					counter = counter+25;
			})
		}
		else{
			//display error
		}
	}
	
	dealCardsForPlayer(){
		
	}
	
	setBid(num){
		//this.state.bidValue is the entered bid.
	}
	
	cardAnimateTo(card,Obj){
		card.animateTo({
			delay: 1000 + Obj.randVar, // wait 1 second + i * 2 ms
			duration: 2000 + Obj.randVar,
			ease: 'quartOut',
			
			x: Obj.x,
			y: Obj.y,
			rot: Obj.rot ? Obj.rot : 0,
			onComplete: Obj.onComplete ? Obj.onComplete : null
		});
	}
	
	onAvatarClick(){
		//retrieve information.
	}
	
	onQuitGame(){
		this.openCloseDialog('Quit',false);
		this.props.history.push('/home');
		//move to homepage and give a penalty of 100 coins.
		
		if(this.props.GameInfo.gameReady)
		{
			//penalty of 100 coins.
		}
		else{
			// no penalty as game did not start.
			this.finishGame(true);
		}
		
		//send a quit to all others as well.
		
		//end the game for everyone.
		//emit end message.
	}
	
	finishGame(properEnd){
		var url = 'finishGame?gid=' + this.props.GameInfo.gameId + "&properEnd="+properEnd;
		makeServerCall(url, function(response, options){
			
			var result; 
        
			try {
				result = JSON.parse(response);
			}
			catch(e) {
				result = null;
			}
			
			
			
		});
	}
	
	/**
	 * This function opens/closes the floating menu on the bottom left corner.
	 */
    openCloseFloatingMenu() {
        var menuItems = document.getElementsByClassName('toggleOptionsMenuItems');
        var floatingToggleButton = document.getElementById("floatingToggleButton");
        var buttonElement = document.getElementById("collapsibleFloatingButton");
        var len = menuItems.length;
        var translate = 50; // as the 1st menu button should be little more higher than the spacing between the buttons.

        if (floatingToggleButton.classList.contains('fa-caret-up')) {
            floatingToggleButton.classList.remove('fa-caret-up');
            floatingToggleButton.classList.add('fa-caret-down');
            floatingToggleButton.style.margin = "2px 0px 0px 0px";
        }
        else {
            floatingToggleButton.classList.remove('fa-caret-down');
            floatingToggleButton.classList.add('fa-caret-up');
            floatingToggleButton.style.margin = "-2px 0px 0px 0px";
        }

        if (this.state.menuOpen) {
            for (var i = 0; i < len; i++) {
                menuItems[i].style.transform = '';
            }

            this.setState({ menuOpen: false });
        }
        else {
            for (var j = 0; j < len; j++) {
                menuItems[j].style.transform = 'translate(0px,' + translate + 'px)';
                translate = translate + 50;
            }

            this.setState({ menuOpen: true });
        }
    }
	
	onCompleteCardDealingOthers(card,index,randomVar){
		//hide the cards of others.
		setTimeout(function(){ card.$el.style.display = "none"; }, 3000 + randomVar);
	}
	
	onCompleteCardDealingCurrentPlayer(card,index,randomVar,position){
		setTimeout(function(){ card.setSide('front'); }, 3000 + randomVar);
		
		card.$el.addEventListener('mouseenter', onMouseEnter);
		card.$el.addEventListener('mouseleave', onMouseLeave);
		card.$el.addEventListener('mousedown', onClickCard);

		function onMouseEnter(){
			card.animateTo({
				delay: 200,
				duration: 1000,
				ease: 'quartOut',
				
				x: position.x,
				y: position.y-20
			});
		}
		
		function onMouseLeave(){
			card.animateTo({
				delay: 200,
				duration: 1000,
				ease: 'quartOut',
				
				x: position.x,
				y: position.y
			});
		}
		
		function onClickCard(){
			card.animateTo({
				delay: 500,
				duration: 1000,
				ease: 'quartOut',
				
				x: 100,
				y: 100
			});
		}
	}
	
	render() {
		hideSplashScreen();
		var context=this;
		this.socket.on("gameReady",(msg) => {
			try{
				var tempResult = JSON.parse(msg);
				context.props.dispatch(saveGameInfo(tempResult));
			}
			catch(err){
				console.log(err);
			}
		});
		
		return (
		  <div className="Board">
		  
			<div 
				style = {{ 
					position: "fixed",
					width: "100%",
					height: "100%",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "rgba(0,0,0,.5)",
					zIndex: 12,
					display: (this.props.GameInfo.gameReady ? (this.props.GameInfo.round.turn == this.props.CurrentPlayerInfo.playerId ? "none" : "") : "none") 
				}}
			>
				PLEASE WAIT FOR YOUR TURN.
			</div>

			
			{/*OUTER CONTAINER*/}
			<Flexbox className="OuterContainer" flexDirection="column" minHeight="100vh">
			  
			  {/*NORTH PLAYER*/}
			  <Flexbox className="NorthOuterContainer" flexDirection="column" element="header" flexGrow={2} style={flexCenter}>
				
				<ListItem
				  leftAvatar={<Avatar className="NorthAvatar">{this.props.GameInfo.gameReady ? (this.props.CurrentPlayerInfo.playerId == "P1" ? this.props.GameInfo.players[1].uname[0] : this.props.GameInfo.players[0].uname[0] ) : "?"}</Avatar>}
				>
					{this.props.GameInfo.gameReady ? (this.props.CurrentPlayerInfo.playerId == "P1" ? this.props.GameInfo.players[1].uname : this.props.GameInfo.players[0].uname ) : "?"}
				</ListItem>
				
			  </Flexbox>
			 
			  {/*CENTERAL INNER CONTAINER*/}
			  <Flexbox flexGrow={4} className="CentralOuterContainer" flexDirection="row" style={{alignItems: 'center'}}>
				  
				  {/*WEST PLAYER*/}
				  <Flexbox flexGrow={2} className="WestContainer">
				  </Flexbox>
				 
				  {/*CARD AREA*/}
				  <Flexbox flexGrow={4} className="CardContainer" style={{alignItems: 'center', border:'1px solid black'}}>
					<div 
						onClick={this.dealCards.bind(this)}
					>
					Card Container
					</div>
					
					<div 
						id="CardPlayArea"
						style={{
							width: '100%',
							height: '100%'
						}}
					>
					
					{/*<button onClick={() => this.emitSocketMessage('cardPlayed',{a:'b'})}>Change Color</button>*/}
					
					{	this.props.GameInfo.round.turn == this.props.CurrentPlayerInfo.playerId ?
						<h2> Please Select A Card To Play By Clicking On It. </h2>
						: null
					}
						<div 
							style = {{ 
								position: "fixed",
								width: "100%",
								height: "100%",
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								backgroundColor: "rgba(0,0,0,.5)",
								zIndex: 5,
								display: (this.props.GameInfo.gameReady ? "none" : "") 
							}}
						>
                                    <ComponentLoadMask bgColor="a" message="Please wait while other players join."/>
                        </div>
						<div 
							id="container"
							style={{
								width: 'auto',
								height: 'auto'
							}}
						/>
					</div>
					
				  </Flexbox>
				 
				  {/*EAST PLAYER*/}
				  <Flexbox flexGrow={2} className="EastContainer">
					  {/* empty space */}
					<Flexbox flexGrow={10} />
				  </Flexbox>
			  </Flexbox>
			 
 				{/*SOUTH PLAYER i.e. YOU*/}
			  <Flexbox element="footer" flexDirection="column" flexGrow={2} className="SouthContainer" style={flexCenter}>
				{/* empty space */}
				<Flexbox flexGrow={10} />
				<ListItem
				  leftAvatar={<Avatar className="SouthAvatar">{this.props.UserInfo.infoDetails.name[0]}</Avatar>}
				>
					{this.props.UserInfo.infoDetails.name}
				</ListItem>
			  </Flexbox>
			</Flexbox>
			
			{/* Score Dialog */}
			<Dialog
			  title="ScoreCard"
			  autoScrollBodyContent={true}
			  //modal={true}
			  open={this.state.scoreCardDialogOpen}
			  onRequestClose={() => this.openCloseDialog('ScoreCard',false)}
			>
			    <Table
					selectable={false}
				>
					<TableHeader
						displaySelectAll={false}
						adjustForCheckbox={false}
					>
					  <TableRow>
						<TableHeaderColumn></TableHeaderColumn>
						<TableHeaderColumn>You & Partner</TableHeaderColumn>
						<TableHeaderColumn>West & East</TableHeaderColumn>
					  </TableRow>
					
					</TableHeader>
					
					<TableBody
						displayRowCheckbox={false}
						stripedRows={true}
					>
					  <TableRow>
						<TableRowColumn>Combined Bid</TableRowColumn>
						<TableRowColumn>John Smith</TableRowColumn>
						<TableRowColumn>Employed</TableRowColumn>
					  </TableRow>
					  <TableRow>
						<TableRowColumn>Tricks Taken</TableRowColumn>
						<TableRowColumn>Randal White</TableRowColumn>
						<TableRowColumn>Unemployed</TableRowColumn>
					  </TableRow>
					  <TableRow>
						<TableRowColumn>Bags</TableRowColumn>
						<TableRowColumn>Stephanie Sanders</TableRowColumn>
						<TableRowColumn>Employed</TableRowColumn>
					  </TableRow>
					  <TableRow>
						<TableRowColumn>Bags from last round</TableRowColumn>
						<TableRowColumn>Steve Brown</TableRowColumn>
						<TableRowColumn>Employed</TableRowColumn>
					  </TableRow>
					  <TableRow>
						<TableRowColumn>Total Bags</TableRowColumn>
						<TableRowColumn>Christopher Nolan</TableRowColumn>
						<TableRowColumn>Unemployed</TableRowColumn>
					  </TableRow>
					  <TableRow>
						<TableRowColumn></TableRowColumn>
						<TableRowColumn><b>SCORING</b></TableRowColumn>
						<TableRowColumn></TableRowColumn>
					  </TableRow>
					  <TableRow>
						<TableRowColumn>Successful Bids</TableRowColumn>
						<TableRowColumn>Christopher Nolan</TableRowColumn>
						<TableRowColumn>Unemployed</TableRowColumn>
					  </TableRow>
					  <TableRow>
						<TableRowColumn>Bags Score</TableRowColumn>
						<TableRowColumn>Christopher Nolan</TableRowColumn>
						<TableRowColumn>Unemployed</TableRowColumn>
					  </TableRow>
					  <TableRow>
						<TableRowColumn>Failed Nil Bid</TableRowColumn>
						<TableRowColumn>Christopher Nolan</TableRowColumn>
						<TableRowColumn>Unemployed</TableRowColumn>
					  </TableRow>
					  <TableRow>
						<TableRowColumn><b>Points This Round</b></TableRowColumn>
						<TableRowColumn>Christopher Nolan</TableRowColumn>
						<TableRowColumn>Unemployed</TableRowColumn>
					  </TableRow>
					  <TableRow>
						<TableRowColumn><b>Previous Points</b></TableRowColumn>
						<TableRowColumn>Christopher Nolan</TableRowColumn>
						<TableRowColumn>Unemployed</TableRowColumn>
					  </TableRow>
					  <TableRow>
						<TableRowColumn><b>Total Points</b></TableRowColumn>
						<TableRowColumn>Christopher Nolan</TableRowColumn>
						<TableRowColumn>Unemployed</TableRowColumn>
					  </TableRow>
					</TableBody>
				</Table>
				<br />
				
				
				
			</Dialog>
			
			
			{/* Bid Dialog */}
			<Dialog
			  title="Bid"
			  modal={true}
			  open={this.state.bidDialogOpen}
			  onRequestClose={() => this.openCloseDialog('Bid',false)}
			>
			Please Enter a number between 0-13 <br />
			  <NumberInput
				id="num"
				value={this.state.bidValue}
				required
				min={0}
				max={13}
				strategy="warn"
				errorText={this.state.bidErrorText}
				/>
				<br />
				<RaisedButton label="Bid" onClick={this.setBid.bind(this)} primary={true}/>
			</Dialog>
			
			
			<Dialog
			  title="Are you sure?"
			  actions = {[
					  <RaisedButton
						label="Cancel"
						primary={true}
						onClick={() => this.openCloseDialog('Quit',false)}
					  />,
					  <RaisedButton
						label="Quit"
						primary={true}
						onClick={this.onQuitGame.bind(this)}
					  />,
			  ]}
			  modal={true}
			  open={this.state.quitGameDialogOpen}
			  onRequestClose={() => this.openCloseDialog('Quit',false)}
			>
				If you quit the game then you will receive a ban of <b><u>100 coins</u></b>. Are you sure you want to quit?
			</Dialog>
			
			{/* Main Floating Button */}
                <FloatingActionButton 
                    id = "collapsibleFloatingButton"
                    style = {{
                        top: '5px',
                        left: '5px',
                        position: 'absolute',
                        zIndex: '10',
                    }} 
                    mini = { true }
                    onClick = { this.openCloseFloatingMenu.bind(this) }
                >
                    <i 
                        id = "floatingToggleButton" 
                        className = "fa fa-caret-down" 
                        style = {{
                            fontSize: '1.8em',
                            margin: "2px 0px 0px 0px"
                        }}
                    /> 
                </FloatingActionButton>

                {/* Mini Floating Buttons */}
					
					{/* This button opens the scorecard. */}
				<FloatingActionButton 
                   style = { styles.floatingMiniStyles } 
                    className = "toggleOptionsMenuItems"
                    mini = { true }
                    onClick = {() => this.openCloseDialog('ScoreCard',true) }
                >
                    <i className = "fa fa-table" style = {{ fontSize: '1rem'}} />
                </FloatingActionButton>
					
					
					{/* This button cancels the game and exits. */}
                <FloatingActionButton 
                   style = { styles.floatingMiniStyles } 
                    className = "toggleOptionsMenuItems"
                    mini = { true }
                    onClick = {() => this.openCloseDialog('Quit',true) }
                >
                    <i className = "fa fa-times" style = {{ fontSize: '1rem'}} />
                </FloatingActionButton>
				
			
		  </div>
		);
  }
}


/**
 * Local styling
 **/
const styles = {
	floatingMiniStyles: {
		top: '5px',
		left: "5px",
		position: 'absolute',
		zIndex: '5',
        transition: '0.5s'
	}
};

/**
 * Constants defined to make dispatching for the redux store consistent
 **/
export const saveGameInfo = (gameInfo) => ({
    type: 'SAVE_GAME_INFO',
    gameInfo
});

export const setPlayersOnBoardGS = (PlayersOnBoard) => ({
    type: 'SET_PLAYERS_ON_BOARD',
    PlayersOnBoard
});

/**
 * Maps portions of the store to props of your choosing
 * @param state: passed down through react-redux's 'connect'
 **/
const mapStateToProps = function(state){
  return {
	  UserInfo: state.globalObject.UserInfo,
	  GameInfo: state.globalObject.GameInfo,
	  CurrentPlayerInfo: state.globalObject.CurrentPlayerInfo,
	  PlayersOnBoard : state.globalObject.PlayersOnBoard,
  }
}

export default withRouter(connect(mapStateToProps,null,null,{withRef:true})(GamePlayBoard));
