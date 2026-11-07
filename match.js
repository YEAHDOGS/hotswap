// "Money 24" has to find "money24" and "We Are Dogs" has to find "wearedogs",
// so case, spaces and punctuation are all ignored when comparing.
const normalize = (text) => text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

function isSubsequence(query, target) {
  let i = 0;
  for (const char of target) {
    if (char === query[i]) i++;
  }
  return i === query.length;
}

// Lower is better; null means no match.
function score(query, target) {
  if (target === query) return 0;
  if (target.startsWith(query)) return 1;
  if (target.includes(query)) return 2;
  if (isSubsequence(query, target)) return 3;
  return null;
}

function rankProjects(names, input) {
  const query = normalize(input);
  if (!query) return [...names];
  return names
    .map((name) => ({ name, rank: score(query, normalize(name)) }))
    .filter(({ rank }) => rank !== null)
    .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name))
    .map(({ name }) => name);
}

module.exports = { rankProjects };
