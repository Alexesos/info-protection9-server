const iconv = require('iconv-lite');

const isPrime = (n) => {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    const sqrt = Math.floor(Math.sqrt(n));
    for (let i = 3; i <= sqrt; i += 2) {
        if (n % i === 0) return false;
    }
    return true;
};

const gcd = (a, b) => {
    while (b !== 0) {
        const t = b;
        b = a % b;
        a = t;
    }
    return a;
};

const pqGen = () => {
    const min = 1;
    const max = 1000;
    while (true) {
        const candidate = Math.floor(Math.random() * (max - min + 1)) + min;
        if (candidate % 4 === 3 && isPrime(candidate)) return candidate;
    }
};

const genCoprime = (m) => {
    const min = 2;
    const max = m - 1;
    while (true) {
        const candidate = Math.floor(Math.random() * (max - min + 1)) + min;
        if (gcd(candidate, m) === 1) return candidate;
    }
};

const dGen = (fn, e) => {
    let q, a, b, r, t1, t2, t;
    if (e > fn) {
        a = e;
        b = fn;
    } else {
        a = fn;
        b = e;
    }

    t1 = 0;
    t2 = 1;

    while (b !== 0) {
        q = Math.floor(a / b);
        r = a % b;
        t = t1 - (t2 * q);

        a = b;
        b = r;
        t1 = t2;
        t2 = t;
    }

    return t1;
};

const getWordNums = (word) => {
    const nums = [];
    for (let i = 0; i < word.length; i++) {
        nums.push(_ALPHABET.indexOf(word[i]));
    }
    return nums;
};

const modPow = (base, exponent, modulus) => {
    base = BigInt(base);
    exponent = BigInt(exponent);
    modulus = BigInt(modulus);

    if (modulus === 1n) return 0n;

    let result = 1n;
    base = base % modulus;

    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result = (result * base) % modulus;
        }
        exponent = exponent / 2n;
        base = (base * base) % modulus;
    }

    return Number(result);
};

const stringToHex = (message) => {
    console.log(`Encoding message to hex: "${message}"`);
    const buf = iconv.encode(message, 'win1251');
    const bytes = Array.from(buf);
    console.log(`Hex representation:`, bytes);
    return bytes;
};

const checkEQS = () => {
    console.log(_hashTable);
    const s = Object.values(_hashTable).map((item) => item ** _e % _n);
    console.log(s);
};

const moduleHash = (message) => {
    const hex = stringToHex(message);

    return hex.map(item => item % hex.length);
}

const genKeys = () => {
    console.log('Gen Keys');
    let p = pqGen();
    let q;

    while (q === p || !p || !q) {
        q = pqGen();
        p = pqGen();
    }

    const n = p * q;
    const fn = (p - 1) * (q - 1);
    const e = genCoprime(fn);
    const d = dGen(fn, e);

    return { n, e, d };
};

const getS = (m, d, n) => {
    return m.map(item => {
        return modPow(item, d, n);
    });
}

const getH = (s, e, n) => {
    return s.map(item => modPow(item, e, n));
}

// ===== Экспорт всех функций =====
module.exports = {
    isPrime,
    gcd,
    pqGen,
    genCoprime,
    dGen,
    getWordNums,
    modPow,
    stringToHex,
    checkEQS,
    genKeys,
    moduleHash,
    getS,
    getH
};