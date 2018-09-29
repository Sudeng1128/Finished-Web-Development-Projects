import React from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
// lets u run Tracker.autorun
import {Tracker} from 'meteor/tracker';
// Players is our data base
import {Players, calculatePlayerPositions} from '../imports/api/players.js';
// import default dont need {}
import App from '../imports/ui/App.js';

// auto update the screen from the database  
Meteor.startup(() => {
    Tracker.autorun(() => {
      // keeps the list in descending order by score
      let players = Players.find({}, {sort: {score: -1}}).fetch();
      let positionedPlayers = calculatePlayerPositions(players);
      const title = 'Score Keep'
      ReactDOM.render(<App title={title} players={positionedPlayers}/>, document.getElementById('app'));
    });
});
  