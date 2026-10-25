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
  if ((q.includes("plus") || q.includes("sum")) && nums.length >= 2) {
    return String(nums.reduce((a, b) => a + b, 0));
  }
  if ((q.includes("minus") || q.includes("difference")) && nums.length >= 2) {
    return String(nums.slice(1).reduce((a, b) => a - b, nums[0]));
  }
  if ((q.includes("multiplied") || q.includes("times") || q.includes("product")) && nums.length >= 2) {
    return String(nums.reduce((a, b) => a * b, 1));
  }
  if (q.includes("divided") && nums.length >= 2) {
    return String(nums.slice(1).reduce((a, b) => a / b, nums[0]));
  }
  if (q.includes("power") && nums.length >= 2) {
    return (BigInt(nums[0]) ** BigInt(nums[1])).toString();
  }
  if (q.includes("fibonacci") && nums.length > 0) {
    return String(fib(nums[0]));
  }
  if (q.includes("square") && q.includes("cube") && nums.length > 0) {
    return nums.filter(isSquareAndCube).join(", ");
  }
  if (q.includes("prime") && nums.length > 0) {
    return nums.filter(isPrime).join(", ");
  }

  if (q.includes("name")) return "Dilshod";
  if (q.includes("age")) return "67";

  return "";
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
