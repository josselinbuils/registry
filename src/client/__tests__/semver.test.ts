import { rcompare, satisfies } from '../semver';
import { rangeExclude, rangeInclude } from './__fixtures__/semver';

// See https://github.com/npm/node-semver/tree/master/test

describe('semver', () => {
  describe('rcompare', () => {
    it('rcompare', () => {
      expect(rcompare('1.0.0', '1.0.1')).toEqual(1);
      expect(rcompare('1.0.0', '1.0.0')).toEqual(0);
      expect(rcompare('1.0.0+0', '1.0.0')).toEqual(0);
      expect(rcompare('1.0.1', '1.0.0')).toEqual(-1);
    });
  });

  describe('satisfies', () => {
    it('range tests', () => {
      for (const [range, ver] of rangeInclude as any[][]) {
        try {
          expect(satisfies(ver, range)).toEqual(true);
        } catch (error) {
          console.error({ range, ver });
          throw error;
        }
      }
    });

    it('negative range tests', () => {
      for (const [range, ver] of rangeExclude as any[][]) {
        try {
          expect(satisfies(ver, range)).toEqual(false);
        } catch (error) {
          console.error({ range, ver });
          throw error;
        }
      }
    });

    it('invalid ranges never satisfied (but do not throw)', () => {
      const cases = [
        ['blerg', '1.2.3'],
        ['git+https://user:password0123@github.com/foo', '123.0.0'],
        ['^1.2.3', '2.0.0-pre'],
        ['0.x', undefined],
        ['*', undefined],
      ];

      for (const [range, ver] of cases as any[][]) {
        try {
          expect(satisfies(ver, range)).toEqual(false);
        } catch (error) {
          console.error({ range, ver });
          throw error;
        }
      }
    });
  });
});
