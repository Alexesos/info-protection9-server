const iconv = require('iconv-lite');

const _alphabet = 'АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯABCDEFGHIJKLMNOPQRSTUVWXYZабвгґдеєжзийіїклмнопрстуфхцчшщьюяabcdefghijklmnopqrstuvwxyz';
const _ALPHABET = 'АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ';
const _adressSize = 3;

const factorize = (num) => {
    const factors = new Set();
    while(num % 2 === 0) {
        factors.add(2);
        num /= 2;
    }
    for(let i = 3; i <= Math.sqrt(num); i += 2) {
        while(num % i === 0) {
            factors.add(i);
            num /= i;
        }
    }
    if(num > 2) factors.add(num);
    return Array.from(factors);
};

const isPrimitiveRoot = (g, p) => {
    if(p === 2) return g === 1;
    const phi = p - 1;
    const factors = factorize(phi);
    
    return factors.every(factor => 
        BigInt(g) ** BigInt(phi / factor) % BigInt(p) !== 1n
    );
};

const findPrimitiveRoot = p => {
    if(!isPrime(p)) return null;
    
    for(let g = 2; g < p; g++) {
        if(isPrimitiveRoot(g, p)) return g;
    }
    return null;
};

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

    return (t1 + fn) % fn;
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

const zgortEncode = (message) => {
    const hex = stringToHex(message);
    const str = hex.join('');
    let res = 0;

    console.log(`Str: ${str}`);

    for (let i = 0; i < str.length; i+=_adressSize) {
        if (i + _adressSize >= str.length) {
            res += +str.slice(i, str.length - 1); // - 1
            console.log(`Res += ${str.slice(i, str.length - 1)}`);
        } else {
            res += +str.slice(i, i + _adressSize);
            console.log(`Res += ${str.slice(i, i + _adressSize)}`);
        }
    }

    console.log(`Res: ${res}`);

    return res.toString().slice(-_adressSize);
}

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

const modInverse = (k, p) => {
    let [a, b] = [k, p];
    let [x0, x1] = [1, 0];

    while (b !== 0) {
        const q = Math.floor(a / b);
        [a, b] = [b, a % b];
        [x0, x1] = [x1, x0 - q * x1];
    }

    if (a !== 1) {
        return null;
    }

    return (x0 + p) % p;
}

const getGamahl = (message) => {
    const m = +zgortEncode(message);
    const p = pqGen();
    const g = findPrimitiveRoot(p);
    const min = 1;
    const max = p - 1;

    const x = Math.floor(Math.random() * (max - min + 1)) + min;
    const y = Number((BigInt(g) ** BigInt(x)) % BigInt(p));

    //m = (x*a + k*b) % (p-1) b?

    const k = genCoprime(p - 1);
    const a = modPow(g, k, p);
    const k1 = modInverse(k, p - 1);
    // const b = k1 * (m - x * a) % (p - 1);
    const b = ((k1 * (m - x * a)) % (p - 1) + (p - 1)) % (p - 1);
    console.log(`b: ${b}`);

    return {
        p,
        publicKey: {y, g, p},
        privateKey: x,
        signature: {a, b},
        m
    };    
}

const checkGamahl = (y, a, b, p, g, m) => {
    const lhs = (BigInt(modPow(y, a, p)) * BigInt(modPow(a, b, p))) % BigInt(p);
    const rhs = BigInt(modPow(g, m, p));
    console.log(`lhs: ${lhs}, rhs: ${rhs}`);
    return lhs === rhs;
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
    getH,
    getGamahl,
    checkGamahl,
    zgortEncode
};