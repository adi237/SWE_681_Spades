import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'font-awesome/css/font-awesome.min.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import RedirectRouter from './Router.js';

import './index.css';


injectTapEventPlugin();

/**
 * The initial state of the store (prior to loading table data)
 **/
const initialStore = {
    UserInfo: {
		infoDetails:{
			name:'Aditya Trivedi',
			email: 'atrived4@gmu.edu',
			dob: '23/07/1992',
			
		},
		historyGamesList:[{
				id:'G001',
				result: 'win',
				score: '500/250',
				date: '02/02/2017',
				coinsEarned: 100
			},{
				id:'G010',
				result: 'loss',
				date: '02/02/2017',
				score: '250/500',
				coinsEarned: 10
			},{
				id:'G001',
				result: 'win',
				date: '02/02/2017',
				score: '500/250',
				coinsEarned: 100
			}
		],
		userStatistics:{
			gamesPlayed: 20,
			winLoss: "19/1",
			coins: 1000
		},
	},
	GameInfo: {
		gameReady: true,
		gameId: 'G001',
		gameInitiator: 'P1',
		turn: 'P1',
		cards:{
			P1:[],
			P2:[],
			P3:[],
			P4:[]
		},
		dealer: 'P4'
	},
	CurrentPlayerInfo: {
		playerId: 'P1',
		cards:[]
	},
    isUserLoggedIn: false
};


/**
 * Redux Reducer which handles all changes to the store
 * @param state: The current state of the store
 * @param action: The action that called for a change on the store
 **/
const globalReducer = function(state = initialStore, action) {
    var stateVal, previousRange, selected, display, i;
    
    switch (action.type) {
        /**
         * Initializes the Filter structure
         * @param action.storeFilterStruc: What to set the initial Filter sub-structure to
         **/
        case 'INIT':
            return {
                ...state,
                Filter: action.storeFilterStruc,
            }
		
		case 'SAVE_USER_INFO':
            return {
                ...state,
                Filter: action.storeFilterStruc,
            }
			
			/*{ 
                    ...state,
                    ModalDisplay: {
                        ...state.ModalDisplay,
                        settingsModal: settingsDisplay,
                        statisticsModal: statisticsDisplay,
                        alertsModal: alertsDisplay,
                        legendModal: legendDisplay,
                        allViewsModal: allViewsDisplay,
                        helpModal: helpDisplay,
                        adminModal: adminDisplay,
                        selectedFilteredModal: selectedFilteredDisplay
                    }
                };*/
		
		
        /**
         * Shouldn't reach here unless theres a typo in the action
         **/
        default:
            console.log("TYPO IN ACTION: " + action.type);
            //debugger;
            return state;
    }
};


const dummyReducer = function(state = initialStore, action) {
  return state;
}

const reducers = combineReducers({
  globalObject: globalReducer,
  dummyState: dummyReducer
});

let store = createStore(reducers);

ReactDOM.render(<Provider store = { store }><RedirectRouter /></Provider>, document.getElementById('root'));
registerServiceWorker();
