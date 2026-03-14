function calculateBadge(endorsementCount) {
  if (endorsementCount >= 15) return 'Gold';
  if (endorsementCount >= 7) return 'Silver';
  if (endorsementCount >= 3) return 'Bronze';
  return 'None';
}
module.exports = { calculateBadge };
