import woundChance from './woundChance';

import statBlock from './statBlock';

console.log(woundChance);

describe('Wound chance can acuratly calculate and update', () => {
  test('Should get back an object with specific properties', () => {
    expect(typeof woundChance(statBlock)).toEqual('object');
  });
});
