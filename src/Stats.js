import React, { Component } from 'react';
import Input from './Input'
import './Stats.css';

class Stats extends Component {
  constructor(obj) {
    super();

    this.state = {
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
      fnpChance: 1/6,
      fnpDamage: 0,
      woundPercentage: .50,
      savePercentage: 0,
      feelNoPain: false,
      reRollOnesHits: false,
      reRollOnesDamage: false,
      cover: false,
      editTitle: false,
      damagePerShot: 1
    };
  }

  handleChange = (property, value) => {
    const stringConverted = value.split('')
    const lastItem = stringConverted.length - 1;
    const aNumber = /^(0|[1-9]\d*)$/;
    if(aNumber.test(stringConverted[lastItem])) {
      if(property === 'ballistic' && +stringConverted[lastItem] < 7) {
        if(+stringConverted[lastItem] === 0 || +stringConverted[lastItem] === 1) {
          return
        }
        this.setState({[property]: +stringConverted[lastItem]})
      } else if (property === 'ballistic' && +stringConverted[lastItem] >= 7) {
        return
      }
      else {
        this.setState({[property]: +value})
      }
    } else if (stringConverted.length === 0) {
      this.setState({[property]: 0})
    }
  }

  handleChangeDice = (property, value) => {
    const stringConverted = value.split('')
    const lastItem = stringConverted.length - 1;
    const aNumber = /^(0|[1-9]\d*)$/;
    if((aNumber.test(stringConverted[lastItem]) && +stringConverted[lastItem] === 0 && property === 'armorSave') || property === 'armorPen' || property === 'invulnSave') {
      this.setState({[property]: +stringConverted[lastItem]})
    }
    if(aNumber.test(stringConverted[lastItem]) && +stringConverted[lastItem] < 7 && +stringConverted[lastItem] > 1){
      this.setState({[property]: +stringConverted[lastItem]})
    } else if (stringConverted.length === 0) {
      this.setState({[property]: 0})
    }
  }

  handleCheck(property, value) {
    console.log(property, value);
    this.setState({[property]: value})
  }

  calculateHitChance() {
    let hitPercentage = 0;
    if(this.state.hitPercentage !== 0) {
      hitPercentage = 1 - ((this.state.ballistic - 1) / 6)
    }
    if(this.state.reRollOnesHits) {
      hitPercentage += (1/6) * (1 - ((this.state.ballistic - 1) / 6))
    }
    if(hitPercentage !== this.state.hitPercentage || this.state.hits !== this.round(hitPercentage * this.state.shots)) {
      this.setState({hitPercentage, hits: this.round(hitPercentage * this.state.shots)}, this.calculateWoundChance)
      return
    }
    this.calculateWoundChance()
  }

  round(value) {
    if(value % 1 >= .5) {
      return Math.ceil(value)
    } else {
      return Math.floor(value)
    }
  }

  calculateWoundChance() {
    let woundPercentage = 0;
    let rollToWound = 0
    if(this.state.toughness === this.state.strength) {
      woundPercentage = 3/6;
      rollToWound = 4;
    }
    else if(this.state.toughness >= this.state.strength * 2) {
      woundPercentage = 1/6
      rollToWound = 6
    }
    else if(this.state.toughness * 2 <= this.state.strength) {
      woundPercentage = 5/6
      rollToWound = 2
    }
    else if(this.state.toughness < this.state.strength) {
      woundPercentage = 4/6
      rollToWound = 3
    }
    else if(this.state.toughness > this.state.strength) {
      woundPercentage = 2/6
      rollToWound = 5
    }
    if (this.state.reRollOnesDamage) {
      woundPercentage += (1/6) * (1 - ((rollToWound - 1) / 6))
    }
    if(this.state.woundPercentage !== woundPercentage || this.round(woundPercentage * this.state.hits) !== this.state.wounds) {
      console.log();
      this.setState({woundPercentage, rollToWound, wounds: this.round(woundPercentage * this.state.hits)}, this.calculatePenetration)
      return
    }
    this.calculatePenetration()
  }

  calculatePenetration() {
    const {armorPen, invulnSave, armorSave} = this.state
    let savePercentage = 0;
    if(armorSave + armorPen > invulnSave){
      savePercentage = invulnSave !== 0 ? (7 - invulnSave)/6 : 0;
    } else {
      savePercentage = armorSave !== 0 ? (7 - (armorSave + armorPen))/6 : 0;
    }
    if(this.state.cover) {
      savePercentage = armorSave !== 0 ? (7 - (armorSave - 1 + armorPen))/6 : 0;
    }
    if(this.state.savePercentage !== savePercentage || this.state.damage !== this.round(this.state.wounds - (this.state.wounds * this.state.savePercentage))) {
      this.setState({savePercentage, damage: this.round(this.state.wounds - (this.state.wounds * this.state.savePercentage))}, this.calculateFeelNoPain)
      return
    }
    this.calculateFeelNoPain()
  }

  calculateFeelNoPain() {
    let fnpChance = this.state.fnpChance;
    if(this.state.feelNoPain) {
      fnpChance = 1 - ((this.state.fnpAmount - 1) / 6)
    }
    if(fnpChance !== this.state.fnpChance || this.state.fnpDamage !== this.round(this.state.damage - (fnpChance * this.state.damage))) {
      this.setState({fnpChance, fnpDamage: this.round(this.state.damage - (fnpChance * this.state.damage))})
    }
  }

  componentDidMount() {
    this.calculateHitChance()
  }


  componentDidUpdate() {
    this.calculateHitChance()
  }


  render() {
    // console.log(this.state);
    const {shots, ballistic, hits, toughness, strength, wounds, armorPen, armorSave, invulnSave, damage, hitPercentage, fnpAmount, fnpChance, fnpDamage, woundPercentage, savePercentage, feelNoPain, damagePerShot, reRollOnesDamage,cover, editTitle, title} = this.state
    return (
      <div className="calculator">
        <div className="title">
          { editTitle ?
            <input id="title" className="title-input" type="text" value={title} onBlur={() => {this.setState({editTitle: !editTitle})}} onChange={({target:{value: title}}) => {this.setState({title})}}/>
          : <h1 onClick={() => {this.setState({editTitle: !editTitle}, () => {
            document.querySelector('#title').focus()
          })}}>{title}</h1> }
        </div>
        <div className="two-column">
          <Input label='Shots' property='shots' data={shots} handleChange={this.handleChange}/>
          <Input label='BS' property='ballistic' data={ballistic + '+'} handleChange={this.handleChangeDice}/>
          <Input label='Toughness' property='toughness' data={toughness} handleChange={this.handleChange}/>
          <Input label='Strength' property='strength' data={strength}handleChange={this.handleChange}/>
          <Input label='AP' property='armorPen' data={armorPen}handleChange={this.handleChangeDice}/>
          <Input label='Save' property='armorSave' data={armorSave + '+'}handleChange={this.handleChangeDice}/>
          <Input label='Invuln Save' property='invulnSave' data={invulnSave + '+'}handleChange={this.handleChangeDice}/>
          <Input label='Damage' property='damagePerShot' data={damagePerShot} handleChange={this.handleChange}/>
          {feelNoPain ? <Input label='FNP' property='fnpAmount' data={fnpAmount + '+'}handleChange={this.handleChangeDice}/>: <div className="filler"/>}
        </div>
        <div className="two-column-bottom">
          <div className="option" onClick={() => {this.handleCheck("reRollOnesHits", !this.state.reRollOnesHits)}}>
            <input id="reRollOnesHits" checked={this.state.reRollOnesHits} type="checkbox"/>Reroll Ones, Hits
          </div>
          <div className="option" onClick={() => {this.handleCheck("reRollOnesDamage", !reRollOnesDamage)}}>
            <input type="checkbox" checked={reRollOnesDamage}/>Reroll Ones, Wounds
          </div>
          <div className="option" onClick={() => {this.handleCheck("cover", !cover)}}>
            <input id="cover" type="checkbox" checked={cover}/>Target In Cover
          </div>
          <div className="option" onClick={() => {this.handleCheck('feelNoPain', !feelNoPain)}}>
            <input id="feelNoPain" type="checkbox" checked={feelNoPain}/>Feel No Pain
          </div>
          <h3>Hit Chance: {this.round(hitPercentage * 100)}%</h3>
          <h3>Hits: {hits}</h3>
          <h3>Wound Chance: {this.round(woundPercentage * 100)}%</h3>
          <h3>Wounds: {wounds}</h3>
          <h3>Save Chance: {this.round(savePercentage * 100)}%</h3>
          <h3>After Save: {damage}</h3>
          <h3 style={{display: this.state.feelNoPain ?'grid': 'none'}}>FNP Chance: {this.round(fnpChance * 100)}%</h3>
          <h3 style={{display: this.state.feelNoPain ?'grid': 'none'}}>FNP Damage: {fnpDamage}</h3>
          <div className='bottomFiller' style={{display: !this.state.feelNoPain ? 'grid': 'none'}}/>
          <div className='bottomFiller' style={{display: !this.state.feelNoPain ? 'grid': 'none'}}/>
          {this.state.feelNoPain ?
            <h3 className="doubleWide">Damage Chance Per Shot: {this.round((fnpDamage / shots) * 100)}%</h3>
            :
            <h3 className="doubleWide">Damage Chance Per Shot: {this.round((damage / shots) * 100)}%</h3>
          }
        </div>
      </div>
    );
  }
}

export default Stats;
