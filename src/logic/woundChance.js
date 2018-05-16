import round from './round';

function woundChance(state) {
  const { toughness, strength, reRollOnesDamage, woundPercentage: originalWoundPercentage, hits, wounds } = state;
  const newWoundPercentage = 0;
  let rollToWound = 0;
  if (toughness === strength) {
    originalWoundPercentage = 3 / 6;
    rollToWound = 4;
  }
  if (toughness >= strength * 2) {
    originalWoundPercentage = 1 / 6;
    rollToWound = 6;
  }
  if (toughness * 2 <= strength) {
    originalWoundPercentage = 5 / 6;
    rollToWound = 2;
  }
  if (toughness < strength) {
    originalWoundPercentage = 4 / 6;
    rollToWound = 3;
  }
  if (toughness > strength) {
    originalWoundPercentage = 2 / 6;
    rollToWound = 5;
  }

  if (reRollOnesDamage) {
    originalWoundPercentage += 1 / 6 * (1 - (rollToWound - 1) / 6);
  }
  if (newWoundPercentage !== originalWoundPercentage || this.round(woundPercentage * hits) !== wounds) {
    return { newWoundPercentage: woundPercentage, rollToWound, wounds: this.round(woundPercentage * hits) };
  }
}

export default woundChance;
