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
		var centralContainerHeight = document.getElementsByClassName('CentralOuterContainer') ? document.getElementsByClassName('CentralOuterContainer')[0].clientHeight : "350px";
		var playArea = document.getElementById('CardPlayArea') ? document.getElementById('CardPlayArea') : null;
		
		if(playArea)
			playArea.style.height = centralContainerHeight + "px";
		
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
		
		
		/*this.deck.cards.forEach(function (card, i) {
			  card.enableDragging()
			  card.enableFlipping()
		});*/
		
		//context.dealCards();
	}
	
	dealCards(){
		var northAvatar = document.getElementsByClassName('NorthAvatar') ? document.getElementsByClassName('NorthAvatar')[0] : null;
		var NorthOuterContainer = document.getElementsByClassName('NorthOuterContainer') ? document.getElementsByClassName('NorthOuterContainer')[0] : null;
		var SouthContainer = document.getElementsByClassName('SouthContainer') ? document.getElementsByClassName('SouthContainer')[0] : null;
		var westAvatar = document.getElementsByClassName('WestAvatar') ? document.getElementsByClassName('WestAvatar')[0] : null;
		var eastAvatar = document.getElementsByClassName('EastAvatar') ? document.getElementsByClassName('EastAvatar')[0] : null;
		var southAvatar = document.getElementsByClassName('SouthAvatar') ? document.getElementsByClassName('SouthAvatar')[0] : null;
		 

		var context = this;
		var counter=0;
		//var x = northAvatar.getBoundingClientRect().x - eastAvatar.getBoundingClientRect().x;
		//var y = northAvatar.getBoundingClientRect().y - eastAvatar.getBoundingClientRect().y;
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
				
				x: position.x,
				y: position.y
			});
		}
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
			  <Flexbox flexGrow={4} className="CentralOuterContainer" flexDirection="row" style={{alignItems: 'center'}}>
				  
				  {/*WEST PLAYER*/}
				  <Flexbox flexGrow={2} className="WestContainer">
					<ListItem
					  leftAvatar={<Avatar className="WestAvatar">YN</Avatar>}
					>
					  Your Name
					</ListItem>
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
