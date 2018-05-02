import React, { Component } from 'react';
import StatBlock from './StatBlock';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      template: {
        id: 0,
        title: 'Title',
        description: '',
        shots: 12,
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
        totalDamage: 0,
      },
      statBlocks: [],
      currentId: 0,
    };
  }

  createStatBlock() {
    const newBlock = { ...this.state.template };
    newBlock.id = this.state.currentId;
    this.setState({ statBlocks: [...this.state.statBlocks, newBlock], currentId: this.state.currentId + 1 });
  }

  componentDidMount() {
    this.createStatBlock();
  }

  render() {
    const statBlocks = this.state.statBlocks.map(block => <StatBlock key={block.id} block={block} />);
    return (
      <div className="stats">
        <div
          className="add-block"
          onClick={() => {
            this.createStatBlock();
          }}
        >
          Create Block
        </div>
        <section className="blocks">{statBlocks}</section>
      </div>
    );
  }
}

export default App;
