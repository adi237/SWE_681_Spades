import React, { Component } from 'react';
import Flexbox from 'flexbox-react';
import { hideSplashScreen } from './LoadMaskHelper.js';
import Avatar from 'material-ui/Avatar';
import ListItem from 'material-ui/List/ListItem';
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

class Table extends Component {
	
	componentDidMount() {
		var context = this;
		window.onload = function(e){ 
			context.renderInitialDeck(context);
			
		}
	}
	
	deck;
	cardsObj: {
		P1: [],
		P2: [],
		P3: [],
		P4: [],
		currentPlayer: ''
	}
	
	renderInitialDeck(context){
		
		var cont = document.getElementById('container');
		
		this.deck = window.Deck();
		
		// add to DOM
		this.deck.mount(cont);
		this.deck.intro();
		this.deck.shuffle();
		this.deck.fan();
		
		
		this.deck.cards.forEach(function (card, i) {
			  card.enableDragging()
			  card.enableFlipping()
		});
		
		//context.dealCards();
	}
	
	dealCards(){
		var northAvatar = document.getElementsByClassName('NorthAvatar') ? document.getElementsByClassName('NorthAvatar')[0] : null;
		var NorthOuterContainer = document.getElementsByClassName('NorthOuterContainer') ? document.getElementsByClassName('NorthOuterContainer')[0] : null;
		var westAvatar = document.getElementsByClassName('WestAvatar') ? document.getElementsByClassName('WestAvatar')[0] : null;
		var eastAvatar = document.getElementsByClassName('EastAvatar') ? document.getElementsByClassName('EastAvatar')[0] : null;
		var southAvatar = document.getElementsByClassName('SouthAvatar') ? document.getElementsByClassName('SouthAvatar')[0] : null;

		var context = this;
		var counter=0;
		//var x = northAvatar.getBoundingClientRect().x - eastAvatar.getBoundingClientRect().x;
		//var y = northAvatar.getBoundingClientRect().y - eastAvatar.getBoundingClientRect().y;
		
		if(northAvatar && westAvatar && eastAvatar && southAvatar){
			this.deck.cards.forEach(function (card, i) {
				card.setSide('back');
				
				// explode
				//debugger;
				switch(i%4){
					case 0:
						context.cardAnimateTo(
							card,
							{
								i: i,
								x: northAvatar.getBoundingClientRect().x+counter-(window.innerWidth/2) ,
								y: northAvatar.getBoundingClientRect().bottom-(window.innerHeight/2),
								onComplete: context.onCompleteCardDealing(card,i)
							}
						);
						//context.cardAnimateTo(card,{i:i,x:x+counter,y:y});
					break;
					case 1:
						//context.cardAnimateTo(card,{i:i,x:eastAvatar.getBoundingClientRect().x,y:eastAvatar.getBoundingClientRect().y});
					break;
					case 2:
						//context.cardAnimateTo(card,{i:i,x:southAvatar.getBoundingClientRect().x,y:southAvatar.getBoundingClientRect().y});
					break;
					case 3:
						//context.cardAnimateTo(card,{i:i,x:westAvatar.getBoundingClientRect().x,y:westAvatar.getBoundingClientRect().y});
					break;
				}
				
				if(i%4==0)
					counter = counter+5;
			})
		}
		else{
			//display error
		}
	}
	
	cardAnimateTo(card,Obj){
		card.animateTo({
			delay: 1000 + Obj.i * 2, // wait 1 second + i * 2 ms
			duration: 5000,
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
	
	onCompleteCardDealing(card,index){
		debugger;
		//hide the cards of others.
	}
	
	render() {
		hideSplashScreen();
	  
		return (
		  <div className="Board">
			
			{/*OUTER CONTAINER*/}
			<Flexbox className="OuterContainer" flexDirection="column" minHeight="100vh">
			  
			  {/*NORTH PLAYER*/}
			  <Flexbox className="NorthOuterContainer" flexDirection="column" element="header" flexGrow={2} style={flexCenter}>
				
				<ListItem
				  leftAvatar={<Avatar className="NorthAvatar">YN</Avatar>}
				>
				  Your Name
				</ListItem>
				
			  </Flexbox>
			 
			  {/*CENTERAL INNER CONTAINER*/}
			  <Flexbox flexGrow={4} className="CentralOuterContainer" style={flexCenter}>
				<Flexbox className="InnerContainer" flexDirection="row" width="100%" height="100%">
				  
				  {/*WEST PLAYER*/}
				  <Flexbox flexGrow={2} className="WestContainer">
					<ListItem
					  leftAvatar={<Avatar className="WestAvatar">YN</Avatar>}
					>
					  Your Name
					</ListItem>
				  </Flexbox>
				 
				  {/*CARD AREA*/}
				  <Flexbox flexGrow={4} className="CardContainer">
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
					<ListItem
					  leftAvatar={<Avatar className="EastAvatar">YN</Avatar>}
					>
					  Your Name
					</ListItem>
				  </Flexbox>
				</Flexbox>
			  </Flexbox>
			 
 				{/*SOUTH PLAYER i.e. YOU*/}
			  <Flexbox element="footer" flexDirection="column" flexGrow={2} className="SouthContainer" style={flexCenter}>
				{/* empty space */}
				<Flexbox flexGrow={10} />
				<ListItem
				  leftAvatar={<Avatar className="SouthAvatar">YN</Avatar>}
				>
				  Your Name
				</ListItem>
			  </Flexbox>
			</Flexbox>
			
		  </div>
		);
  }
}

export default Table;
