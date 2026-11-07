const test = require('node:test');
const assert = require('node:assert/strict');
const { rankProjects } = require('../match');

const names = ['40', 'DOGS-CONTENT', 'dogs-ai', 'money24', 'wearedogs', 'wordsmith', 'wordsmith-sidebar'];

test('ignores spaces and case', () => {
  assert.equal(rankProjects(names, 'Money 24')[0], 'money24');
  assert.equal(rankProjects(names, 'We Are Dogs')[0], 'wearedogs');
});

test('ignores punctuation in folder names', () => {
  assert.equal(rankProjects(names, 'dogs content')[0], 'DOGS-CONTENT');
});

test('ranks exact, then prefix, then substring', () => {
  assert.deepEqual(rankProjects(names, 'wordsmith'), ['wordsmith', 'wordsmith-sidebar']);
  assert.deepEqual(rankProjects(names, 'dogs'), ['dogs-ai', 'DOGS-CONTENT', 'wearedogs']);
});

test('matches abbreviations', () => {
  assert.equal(rankProjects(names, 'wdogs')[0], 'wearedogs');
});

test('empty input keeps every project in order', () => {
  assert.deepEqual(rankProjects(names, '  '), names);
});

test('no match returns nothing', () => {
  assert.deepEqual(rankProjects(names, 'zzz'), []);
});
