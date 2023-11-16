import { expect, test } from 'bun:test';
import { FA } from './fa';
import { SpecialTransition } from './fa-config';

test('parse /a*b+/', () => {
  // q: q(a), r(b)
  // r: r(b)
  const fa = new FA({
    states: ['q', 'r'],
    initialState: 'q',
    finalStates: ['r'],
    transitions: [
      { from: 'q', to: 'q', via: 'a' },
      { from: 'q', to: 'r', via: 'b' },
      { from: 'r', to: 'r', via: 'b' },
    ],
  });

  expect(fa.match('ab')).toBe('ab');
  expect(fa.match('aab')).toBe('aab');
  expect(fa.match('aabb')).toBe('aabb');
  expect(fa.match('aabbcb')).toBe('aabb');
  expect(fa.match('aac')).toBeNull();
});

test('parse /[ab]*a/', () => {
  // any [ab] string ending in a
  // q: q(b), r(a)
  // r: r(a), q(b)
  const fa = new FA({
    states: ['q', 'r'],
    initialState: 'q',
    finalStates: ['r'],
    transitions: [
      { from: 'q', to: 'q', via: 'b' },
      { from: 'q', to: 'r', via: 'a' },
      { from: 'r', to: 'r', via: 'a' },
      { from: 'r', to: 'q', via: 'b' },
    ],
  });

  expect(fa.match('a')).toBe('a');
  expect(fa.match('aaaaaa')).toBe('aaaaaa');
  expect(fa.match('ababababaa')).toBe('ababababaa');
  expect(fa.match('ababa436abaa')).toBe('ababa');
  expect(fa.match('bbbbb436abaa')).toBeNull();
});

test('parse /^„([^”]*)”/u', () => {
  // any unicode string enclosed by „ and ”
  // q: r(„)
  // r: r(anyOneUnicode), s(”)
  // s:
  const fa = new FA({
    states: ['q', 'r', 's'],
    initialState: 'q',
    finalStates: ['s'],
    transitions: [
      { from: 'q', to: 'r', via: '„' },
      {
        from: 'r',
        to: 'r',
        isSpecial: true,
        via: SpecialTransition.anyOneUnicode,
        except: '”',
      },
      { from: 'r', to: 's', via: '”' },
    ],
  });

  expect(fa.match('aagg')).toBeNull();
  expect(fa.match('„aagg”')).toBe('„aagg”');
  expect(fa.match('„Si atunci a zis: „Sa se faca lumina acuma ni!””')).toBe(
    '„Si atunci a zis: „Sa se faca lumina acuma ni!”'
  );
});

test('parse /([0-9]+)/', () => {
  // any unicode string enclosed by „ and ”
  // q: r([0-9])
  // r: r([0-9]
  const generateTransition = (from: string, to: string) => {
    return Array(10)
      .fill(0)
      .map((_, idx) => idx)
      .map((digit) => ({ from, to, via: digit.toString() }));
  };
  const fa = new FA({
    states: ['q', 'r'],
    initialState: 'q',
    finalStates: ['r'],
    transitions: [
      ...generateTransition('q', 'r'),
      ...generateTransition('r', 'r'),
    ],
  });

  expect(fa.match('aagg')).toBeNull();
  expect(fa.match('141552')).toBe('141552');
  expect(fa.match('00141552')).toBe('00141552');
  expect(fa.match('00141552asag334')).toBe('00141552');
});
