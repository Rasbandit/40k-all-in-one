import React, { Component } from 'react';
import Stats from './Stats';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      template: {
        id: 0,
        title: 'Title',
        description: '',
        shots: 36,
        ballistic: 4,
        hits: 0,
        toughness: 4,
        strength: 4,
        wounds: 0,
        armorPen: 0,
        armorSave: 4,
        invulnSave: 6,
        rollToWound: 0,
        damage: 0,
        hitPercentage: 1,
        fnpAmount: 6,
        fnpChance: 1 / 6,
        fnpDamage: 0,
        woundPercentage: 0.5,
        savePercentage: 0,
        feelNoPain: false,
        reRollOnesHits: false,
        reRollOnesDamage: false,
        cover: false,
        editTitle: false,
        damagePerShot: 1,
      },
      stats: [],
      currentId: 0,
    };
  }

  render() {
    return (
      <div className="stats">
        <Stats />
        <Stats />
      </div>
    );
  }
}

export default App;
