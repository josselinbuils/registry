/* tslint:disable:prefer-template max-classes-per-file restrict-plus-operands */

// See https://gist.github.com/THEtheChad/c645ffd510133b983dec
// semver.org version 2.0.0

// The actual regexps go on exports.re
const re = [] as RegExp[];
const src = [] as string[];
let R = 0;

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

const NUMERICIDENTIFIER = R++;
src[NUMERICIDENTIFIER] = '0|[1-9]\\d*';
const NUMERICIDENTIFIERLOOSE = R++;
src[NUMERICIDENTIFIERLOOSE] = '[0-9]+';

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

const NONNUMERICIDENTIFIER = R++;
src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';

// ## Main Version
// Three dot-separated numeric identifiers.

const MAINVERSION = R++;
src[MAINVERSION] =
  '(' +
  src[NUMERICIDENTIFIER] +
  ')\\.' +
  '(' +
  src[NUMERICIDENTIFIER] +
  ')\\.' +
  '(' +
  src[NUMERICIDENTIFIER] +
  ')';

const MAINVERSIONLOOSE = R++;
src[MAINVERSIONLOOSE] =
  '(' +
  src[NUMERICIDENTIFIERLOOSE] +
  ')\\.' +
  '(' +
  src[NUMERICIDENTIFIERLOOSE] +
  ')\\.' +
  '(' +
  src[NUMERICIDENTIFIERLOOSE] +
  ')';

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

const PRERELEASEIDENTIFIER = R++;
src[PRERELEASEIDENTIFIER] =
  '(?:' + src[NUMERICIDENTIFIER] + '|' + src[NONNUMERICIDENTIFIER] + ')';

const PRERELEASEIDENTIFIERLOOSE = R++;
src[PRERELEASEIDENTIFIERLOOSE] =
  '(?:' + src[NUMERICIDENTIFIERLOOSE] + '|' + src[NONNUMERICIDENTIFIER] + ')';

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

const PRERELEASE = R++;
src[PRERELEASE] =
  '(?:-(' +
  src[PRERELEASEIDENTIFIER] +
  '(?:\\.' +
  src[PRERELEASEIDENTIFIER] +
  ')*))';

const PRERELEASELOOSE = R++;
src[PRERELEASELOOSE] =
  '(?:-?(' +
  src[PRERELEASEIDENTIFIERLOOSE] +
  '(?:\\.' +
  src[PRERELEASEIDENTIFIERLOOSE] +
  ')*))';

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

const BUILDIDENTIFIER = R++;
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+';

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

const BUILD = R++;
src[BUILD] =
  '(?:\\+(' + src[BUILDIDENTIFIER] + '(?:\\.' + src[BUILDIDENTIFIER] + ')*))';

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

const FULL = R++;
const FULLPLAIN =
  'v?' + src[MAINVERSION] + src[PRERELEASE] + '?' + src[BUILD] + '?';

src[FULL] = '^' + FULLPLAIN + '$';

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
const LOOSEPLAIN =
  '[v=\\s]*' +
  src[MAINVERSIONLOOSE] +
  src[PRERELEASELOOSE] +
  '?' +
  src[BUILD] +
  '?';

const LOOSE = R++;
src[LOOSE] = '^' + LOOSEPLAIN + '$';

const GTLT = R++;
src[GTLT] = '((?:<|>)?=?)';

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
const XRANGEIDENTIFIERLOOSE = R++;
src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*';
const XRANGEIDENTIFIER = R++;
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*';

const XRANGEPLAIN = R++;
src[XRANGEPLAIN] =
  '[v=\\s]*(' +
  src[XRANGEIDENTIFIER] +
  ')' +
  '(?:\\.(' +
  src[XRANGEIDENTIFIER] +
  ')' +
  '(?:\\.(' +
  src[XRANGEIDENTIFIER] +
  ')' +
  '(?:' +
  src[PRERELEASE] +
  ')?' +
  src[BUILD] +
  '?' +
  ')?)?';

const XRANGEPLAINLOOSE = R++;
src[XRANGEPLAINLOOSE] =
  '[v=\\s]*(' +
  src[XRANGEIDENTIFIERLOOSE] +
  ')' +
  '(?:\\.(' +
  src[XRANGEIDENTIFIERLOOSE] +
  ')' +
  '(?:\\.(' +
  src[XRANGEIDENTIFIERLOOSE] +
  ')' +
  '(?:' +
  src[PRERELEASELOOSE] +
  ')?' +
  src[BUILD] +
  '?' +
  ')?)?';

const XRANGE = R++;
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$';
const XRANGELOOSE = R++;
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$';

// Tilde ranges.
// Meaning is "reasonably at or greater than"
const LONETILDE = R++;
src[LONETILDE] = '(?:~>?)';

const TILDETRIM = R++;
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+';
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g');
const tildeTrimReplace = '$1~';

const TILDE = R++;
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$';
const TILDELOOSE = R++;
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$';

// Caret ranges.
// Meaning is "at least and backwards compatible with"
const LONECARET = R++;
src[LONECARET] = '(?:\\^)';

const CARETTRIM = R++;
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+';
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g');
const caretTrimReplace = '$1^';

const CARET = R++;
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$';
const CARETLOOSE = R++;
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$';

// A simple gt/lt/eq thing, or just "" to indicate "any version"
const COMPARATORLOOSE = R++;
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$';
const COMPARATOR = R++;
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$';

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
const COMPARATORTRIM = R++;
src[COMPARATORTRIM] =
  '(\\s*)' + src[GTLT] + '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')';

// this one has to use the /g flag
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g');
const comparatorTrimReplace = '$1$2$3';

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
const HYPHENRANGE = R++;
src[HYPHENRANGE] =
  '^\\s*(' +
  src[XRANGEPLAIN] +
  ')' +
  '\\s+-\\s+' +
  '(' +
  src[XRANGEPLAIN] +
  ')' +
  '\\s*$';

const HYPHENRANGELOOSE = R++;
src[HYPHENRANGELOOSE] =
  '^\\s*(' +
  src[XRANGEPLAINLOOSE] +
  ')' +
  '\\s+-\\s+' +
  '(' +
  src[XRANGEPLAINLOOSE] +
  ')' +
  '\\s*$';

// Star ranges basically just allow anything at all.
const STAR = R++;
src[STAR] = '(<|>)?=?\\s*\\*';

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (let i = 0; i < R; i++) {
  if (!re[i]) {
    re[i] = new RegExp(src[i]);
  }
}

class SemVer {
  build!: string[];
  major!: number;
  minor!: number;
  patch!: number;
  prerelease!: (number | string)[];
  raw!: string;
  version!: string;

  constructor(version: SemVer | string) {
    if (version instanceof SemVer) {
      version = version.version;
    }

    if (typeof version !== 'string') {
      throw new TypeError('Invalid Version: ' + version);
    }

    const m = version.trim().match(re[FULL]);

    if (!m) {
      throw new TypeError('Invalid Version: ' + version);
    }

    this.raw = version;

    // these are actually numbers
    this.major = +m[1];
    this.minor = +m[2];
    this.patch = +m[3];

    if (this.major < 0) {
      throw new TypeError('Invalid major version');
    }

    if (this.minor < 0) {
      throw new TypeError('Invalid minor version');
    }

    if (this.patch < 0) {
      throw new TypeError('Invalid patch version');
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = [];
    } else {
      this.prerelease = m[4]
        .split('.')
        .map((id) => (/^[0-9]+$/.test(id) ? +id : id));
    }

    this.build = m[5] ? m[5].split('.') : [];
    this.format();
  }

  format(): string {
    this.version = this.major + '.' + this.minor + '.' + this.patch;
    if (this.prerelease.length) {
      this.version += '-' + this.prerelease.join('.');
    }
    return this.version;
  }

  toString(): string {
    return this.version;
  }

  compare(other: SemVer | string): number {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other);
    }

    return this.compareMain(other) || this.comparePre(other);
  }

  compareMain(other: SemVer): number {
    return (
      compareIdentifiers(this.major, other.major) ||
      compareIdentifiers(this.minor, other.minor) ||
      compareIdentifiers(this.patch, other.patch)
    );
  }

  comparePre(other: SemVer): number {
    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1;
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1;
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0;
    }

    let i = 0;

    do {
      const a = this.prerelease[i];
      const b = other.prerelease[i];

      if (a === undefined && b === undefined) {
        return 0;
      } else if (b === undefined) {
        return 1;
      } else if (a === undefined) {
        return -1;
      } else if (a !== b) {
        return compareIdentifiers(a, b);
      }
    } while (++i);

    return 0;
  }
}

const numeric = /^[0-9]+$/;
function compareIdentifiers(a: number | string, b: number | string): number {
  const anum = numeric.test(a.toString());
  const bnum = numeric.test(b.toString());

  if (anum && bnum) {
    a = +a;
    b = +b;
  }

  return anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : a > b ? 1 : 0;
}

function compare(a: SemVer | string, b: SemVer | string): number {
  return new SemVer(a).compare(b);
}

export function rcompare(a: SemVer | string, b: SemVer | string): number {
  return compare(b, a);
}

function gt(a: SemVer | string, b: SemVer | string): boolean {
  return compare(a, b) > 0;
}

function lt(a: SemVer | string, b: SemVer | string): boolean {
  return compare(a, b) < 0;
}

function eq(a: SemVer | string, b: SemVer | string): boolean {
  return compare(a, b) === 0;
}

function neq(a: SemVer | string, b: SemVer | string): boolean {
  return compare(a, b) !== 0;
}

function gte(a: SemVer | string, b: SemVer | string): boolean {
  return compare(a, b) >= 0;
}

function lte(a: SemVer | string, b: SemVer | string): boolean {
  return compare(a, b) <= 0;
}

function cmp(a: SemVer | string, op: string, b: SemVer | string): boolean {
  let ret;
  switch (op) {
    case '===':
      if (typeof a === 'object') {
        a = a.version;
      }
      if (typeof b === 'object') {
        b = b.version;
      }
      ret = a === b;
      break;
    case '!==':
      if (typeof a === 'object') {
        a = a.version;
      }
      if (typeof b === 'object') {
        b = b.version;
      }
      ret = a !== b;
      break;
    case '':
    case '=':
    case '==':
      ret = eq(a, b);
      break;
    case '!=':
      ret = neq(a, b);
      break;
    case '>':
      ret = gt(a, b);
      break;
    case '>=':
      ret = gte(a, b);
      break;
    case '<':
      ret = lt(a, b);
      break;
    case '<=':
      ret = lte(a, b);
      break;
    default:
      throw new TypeError('Invalid operator: ' + op);
  }
  return ret;
}

class Comparator {
  static ANY = {};

  operator!: string;
  semver!: SemVer | typeof Comparator.ANY;
  value: string;

  constructor(comp: Comparator | string) {
    if (comp instanceof Comparator) {
      comp = comp.value;
    }

    this.parse(comp);

    if (this.semver === Comparator.ANY) {
      this.value = '';
    } else {
      this.value = this.operator + (this.semver as SemVer).version;
    }
  }

  parse(comp: string): void {
    const r = re[COMPARATOR];
    const m = comp.match(r);

    if (!m) {
      throw new TypeError('Invalid comparator: ' + comp);
    }

    this.operator = m[1];
    if (this.operator === '=') {
      this.operator = '';
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = Comparator.ANY;
    } else {
      this.semver = new SemVer(m[2]);
    }
  }

  toString(): string {
    return this.value;
  }

  test(version: SemVer | string): boolean {
    if (this.semver === Comparator.ANY) {
      return true;
    }

    if (typeof version === 'string') {
      version = new SemVer(version);
    }

    return cmp(version, this.operator, this.semver as SemVer);
  }
}

class Range {
  range!: string;
  raw: string;
  set: Comparator[][];

  constructor(range: string) {
    // First, split based on boolean or ||
    this.raw = range;
    this.set = range
      .split(/\s*\|\|\s*/)
      .map((r) => {
        return this.parseRange(r.trim());
      }, this)
      .filter((c) => c.length);

    if (!this.set.length) {
      throw new TypeError('Invalid SemVer Range: ' + range);
    }

    this.format();
  }

  format(): string {
    this.range = this.set
      .map((comps) => comps.join(' ').trim())
      .join('||')
      .trim();
    return this.range;
  }

  // if ANY of the sets match ALL of its comparators, then pass
  test(version: SemVer | string | any): boolean {
    if (!version) {
      return false;
    }

    if (typeof version === 'string') {
      version = new SemVer(version);
    }

    for (const set of this.set) {
      if (testSet(set, version)) {
        return true;
      }
    }
    return false;
  }

  toString(): string {
    return this.range;
  }

  parseRange(range: string): Comparator[] {
    range = range.trim();
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = re[HYPHENRANGE];
    range = range.replace(hr, hyphenReplace);
    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace);
    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re[TILDETRIM], tildeTrimReplace);

    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re[CARETTRIM], caretTrimReplace);

    // normalize spaces
    range = range.split(/\s+/).join(' ');

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    const set = range
      .split(' ')
      .map((comp) => {
        return parseComparator(comp);
      })
      .join(' ')
      .split(/\s+/);

    return set.map((comp) => new Comparator(comp));
  }
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator(comp: string): string {
  comp = replaceCarets(comp);
  comp = replaceTildes(comp);
  comp = replaceXRanges(comp);
  comp = replaceStars(comp);
  return comp;
}

function isX(id: any): boolean {
  return !id || id.toLowerCase() === 'x' || id === '*';
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes(comp: string): string {
  return comp.trim().split(/\s+/).map(replaceTilde).join(' ');
}

function replaceTilde(comp: string): string {
  const r = re[TILDE];
  return comp.replace(r, (_, M, m, p, pr) => {
    let ret;

    if (isX(M)) {
      ret = '';
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0- <1.3.0-
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
    } else if (pr) {
      if (pr.charAt(0) !== '-') {
        pr = '-' + pr;
      }
      ret =
        '>=' + M + '.' + m + '.' + p + pr + ' <' + M + '.' + (+m + 1) + '.0';
    }
    // ~1.2.3 == >=1.2.3 <1.3.0
    else {
      ret = '>=' + M + '.' + m + '.' + p + ' <' + M + '.' + (+m + 1) + '.0';
    }

    return ret;
  });
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets(comp: string): string {
  return comp.trim().split(/\s+/).map(replaceCaret).join(' ');
}

function replaceCaret(comp: string): string {
  const r = re[CARET];
  return comp.replace(r, (_, M, m, p, pr) => {
    let ret;

    if (isX(M)) {
      ret = '';
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    } else if (isX(p)) {
      if (M === '0') {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
      } else {
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0';
      }
    } else if (pr) {
      if (pr.charAt(0) !== '-') {
        pr = '-' + pr;
      }
      if (M === '0') {
        if (m === '0') {
          ret =
            '>=' +
            M +
            '.' +
            m +
            '.' +
            p +
            pr +
            ' <' +
            M +
            '.' +
            m +
            '.' +
            (+p + 1);
        } else {
          ret =
            '>=' +
            M +
            '.' +
            m +
            '.' +
            p +
            pr +
            ' <' +
            M +
            '.' +
            (+m + 1) +
            '.0';
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + pr + ' <' + (+M + 1) + '.0.0';
      }
    } else {
      if (M === '0') {
        if (m === '0') {
          ret =
            '>=' + M + '.' + m + '.' + p + ' <' + M + '.' + m + '.' + (+p + 1);
        } else {
          ret = '>=' + M + '.' + m + '.' + p + ' <' + M + '.' + (+m + 1) + '.0';
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + ' <' + (+M + 1) + '.0.0';
      }
    }

    return ret;
  });
}

function replaceXRanges(comp: string): string {
  return comp.split(/\s+/).map(replaceXRange).join(' ');
}

function replaceXRange(comp: string): string {
  comp = comp.trim();
  const r = re[XRANGE];
  return comp.replace(r, (ret, gtlt, M, m, p) => {
    const xM = isX(M);
    const xm = xM || isX(m);
    const xp = xm || isX(p);
    const anyX = xp;

    if (gtlt === '=' && anyX) {
      gtlt = '';
    }

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0';
      } else {
        // nothing is forbidden
        ret = '*';
      }
    } else if (gtlt && anyX) {
      // replace X with 0
      if (xm) {
        m = 0;
      }
      if (xp) {
        p = 0;
      }

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>=';
        if (xm) {
          M = +M + 1;
          m = 0;
          p = 0;
        } else if (xp) {
          m = +m + 1;
          p = 0;
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<';
        if (xm) {
          M = +M + 1;
        } else {
          m = +m + 1;
        }
      }

      ret = gtlt + M + '.' + m + '.' + p;
    } else if (xm) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
    }

    return ret;
  });
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars(comp: string): string {
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[STAR], '');
}

// This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace(
  $0: any,
  from: string,
  fM: string,
  fm: string,
  fp: string,
  fpr: string,
  fb: string,
  to: string,
  tM: string,
  tm: string,
  tp: string,
  tpr: string
): string {
  if (isX(fM)) {
    from = '';
  } else if (isX(fm)) {
    from = '>=' + fM + '.0.0';
  } else if (isX(fp)) {
    from = '>=' + fM + '.' + fm + '.0';
  } else {
    from = '>=' + from;
  }

  if (isX(tM)) {
    to = '';
  } else if (isX(tm)) {
    to = '<' + (+tM + 1) + '.0.0';
  } else if (isX(tp)) {
    to = '<' + tM + '.' + (+tm + 1) + '.0';
  } else if (tpr) {
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;
  } else {
    to = '<=' + to;
  }

  return (from + ' ' + to).trim();
}

function testSet(set: Comparator[], version: SemVer): boolean {
  for (const comp of set) {
    if (!comp.test(version)) {
      return false;
    }
  }

  if (version.prerelease.length) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (const comp of set) {
      if (comp.semver === Comparator.ANY) {
        continue;
      }

      if ((comp.semver as SemVer).prerelease.length > 0) {
        const allowed = comp.semver as SemVer;
        if (
          allowed.major === version.major &&
          allowed.minor === version.minor &&
          allowed.patch === version.patch
        ) {
          return true;
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false;
  }

  return true;
}

export function satisfies(version: string, range: string): boolean {
  try {
    return new Range(range).test(version);
  } catch (er) {
    return false;
  }
}
