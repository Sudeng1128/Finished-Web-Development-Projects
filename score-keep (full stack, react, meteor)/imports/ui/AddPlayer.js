import React from 'react';
import {Players} from '../api/players';

export default class AddPlayer extends React.Component {
  handleSubmit(e) {
    let playerName = e.target.playerName.value;

    e.preventDefault();

    if (playerName) {
      e.target.playerName.value = '';
      Players.insert({
        name: playerName,
        score: 0
      });
    }
  }

  // delete(e) {
  //   e.preventDefault();
  //   Players.remove({});
  // }

  render() {
    return (
      <div className='item'>
        <form className='form' onSubmit={this.handleSubmit.bind(this)}>
          <input className='form__input' type="text" name="playerName" placeholder="Player name"/>
          <button className='button'>Add Player</button>
          {/* <button className='button' onClick={this.delete.bind(this)}>Clear All</button> */}
        </form>
      </div>
    );
  }
};