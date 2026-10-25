const OP_ALIASES: Record<string, string> = {
  "plus": "+",
  "minus": "-",
  "multiplied by": "*",
  "times": "*",
  "divided by": "/",
  "to the power of": "^",
  "power": "^",
};

export default function QueryProcessor(query: string): string {
  const q = query.toLowerCase().replace(/[^a-z0-9]/g, "");
  const nums = (query.match(/\d+/g) ?? []).map(Number);

  if (q.includes("shakespeare")) {
    return (
      "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
      "English poet, playwright, and actor, widely regarded as the greatest " +
      "writer in the English language and the world's pre-eminent dramatist."
    );
  }

  if (q.includes("playerid")) return "d1bcc070";
  if (q.includes("gameid")) return "a5d040da";
  if (q.includes("andrew")) return "dzk";

  const anagram = query.toLowerCase().match(/anagram of ([a-z]+)[:\s]+(.*)/);
  if (anagram) {
    const target = [...anagram[1]].sort().join("");
    const match = anagram[2]
      .split(/,|\s+or\s+/)
      .map((w) => w.replace(/[^a-z]/g, ""))
      .filter(Boolean)
      .find((w) => [...w].sort().join("") === target);
    if (match) return match;
  }

  const scrabble = query.toLowerCase().match(/scrabble score of ([a-z]+)/);
  if (scrabble) return String(scrabbleScore(scrabble[1]));

  // Trivia
  if (q.includes("eiffeltower")) return "Paris";
  if (q.includes("jamesbond")) return "Sean Connery";
  if (q.includes("banana")) return "yellow";
  if (q.includes("euro")) return "Peseta";
  if (q.includes("primeminister")) return "Keir Starmer";

  // Math
  if ((q.includes("largest") || q.includes("biggest")) && nums.length > 0) {
    return String(Math.max(...nums));
  }
  if ((q.includes("smallest") || q.includes("least")) && nums.length > 0) {
    return String(Math.min(...nums));
  }
  if (q.includes("square") && q.includes("cube") && nums.length > 0) {
    return nums.filter(isSquareAndCube).join(", ");
  }
  if (q.includes("prime") && nums.length > 0) {
    return nums.filter(isPrime).join(", ");
  }
  if (q.includes("fibonacci") && nums.length > 0) {
    return String(fib(nums[0]));
  }
  if (q.includes("sum") && nums.length >= 2) {
    return String(nums.reduce((a, b) => a + b, 0));
  }
  if (q.includes("product") && nums.length >= 2) {
    return String(nums.reduce((a, b) => a * b, 1));
  }
  if (q.includes("difference") && nums.length >= 2) {
    return String(nums[0] - nums[1]);
  }
  const expr = parseExpr(query);
  if (expr) {
    try {
      return collapse([...expr[0]], [...expr[1]], applyBig).toString();
    } catch {
      return String(collapse(expr[0].map(Number), [...expr[1]], applyNum));
    }
  }

  if (q.includes("name")) return "Dilshod";
  if (q.includes("age")) return "67";

  return "";
}

function parseExpr(query: string): [bigint[], string[]] | null {
  const tokens =
    query
      .toLowerCase()
      .match(/\d+|to\s+the\s+power\s+of|multiplied\s+by|divided\s+by|plus|minus|times|power/g) ??
    [];
  const vals: bigint[] = [];
  const ops: string[] = [];
  for (const t of tokens) {
    if (/^\d+$/.test(t)) {
      vals.push(BigInt(t));
    } else {
      const op = OP_ALIASES[t.replace(/\s+/g, " ")];
      if (op === undefined) return null;
      ops.push(op);
    }
  }
  if (vals.length < 2 || ops.length !== vals.length - 1) return null;
  return [vals, ops];
}

function collapse<T>(vals: T[], ops: string[], apply: (a: T, op: string, b: T) => T): T {
  for (const tier of ["^", "*/", "+-"]) {
    for (let i = 0; i < ops.length; ) {
      if (tier.includes(ops[i])) {
        vals[i] = apply(vals[i], ops[i], vals[i + 1]);
        vals.splice(i + 1, 1);
        ops.splice(i, 1);
      } else i++;
    }
  }
  return vals[0];
}

function applyBig(a: bigint, op: string, b: bigint): bigint {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "^": return a ** b;
    default:
      if (b === 0n || a % b !== 0n) throw new Error("inexact division");
      return a / b;
  }
}

function applyNum(a: number, op: string, b: number): number {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "^": return a ** b;
    default: return a / b;
  }
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function isSquareAndCube(n: number): boolean {
  const root = Math.round(Math.pow(n, 1 / 6));
  return Math.pow(root, 6) === n;
}

const SCRABBLE: Record<string, number> = {
  a: 1, e: 1, i: 1, l: 1, n: 1, o: 1, r: 1, s: 1, t: 1, u: 1,
  d: 2, g: 2,
  b: 3, c: 3, m: 3, p: 3,
  f: 4, h: 4, v: 4, w: 4, y: 4,
  k: 5,
  j: 8, x: 8,
  q: 10, z: 10,
};

function scrabbleScore(word: string): number {
  return [...word].reduce((sum, ch) => sum + (SCRABBLE[ch] ?? 0), 0);
}

function fib(n: number): number {
  if (n <= 2) return 1;
  let a = 1;
  let b = 1;
  for (let i = 3; i <= n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return b;
}
