const utils = require('./Utilities/Utilities');

const express = require('express');
const cors = require('cors');
// const iconv = require('iconv-lite');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const _n = 85;
const _e = 15;
const x = 6;
const k = 13;
const _hashTable = [];

// API ENDPOINTS

app.post('/api/write/EQS', (req, res) => {
    const { message } = req.body;
    const h = utils.zgortEncode(message);
    const { e, d, n } = utils.genKeys();

    let s = utils.modPow(h, d, n);

    // while (s === 1) {
    //     s = utils.modPow(h, d, n);
    // }

    console.log(`response: s=${s}, e=${e}, n=${n}, h=${h}`);
    res.json({ s, e, n, h });
});

app.post('/api/read/EQS', (req, res) => {
    const { m, s, e, n } = req.body;

    console.log(`request: m=${m}, s=${s}, e=${e}, n=${n}`);

    const h2 = utils.modPow(s, e, n);

    console.log(`h2=${h2}`);

    const isValid = Number(m) === h2;

    console.log(`isValid=${isValid}`);

    res.json({ isValid, m, h2 });
});

app.post('/api/write/EQS2', (req, res) => {
    console.log('\nAPI WRITE EQS GHAMAL\n');
    const { message } = req.body;
    const obj = utils.getGamahl(message);

    console.log('Obj:', obj);

    res.json({ result: obj });
});

app.post('/api/read/EQS2', (req, res) => {
    console.log('\nAPI READ EQS GHAMAL\n');

    const { message, publicKey, signature } = req.body;
    console.log(`message:`, message, 'publickey:', publicKey, 'sign:', signature);
    const { y, g, p } = publicKey;
    const { a, b } = signature;

    let m, isValid;

    try {
        m = +utils.zgortEncode(message);

        isValid = utils.checkGamahl(y, a, b, p, g, m);
    } catch (err) {
        console.error(err);
        res.json({ isValid: false });
    }

    res.json({ isValid });
});

app.listen(PORT, () => {
    console.log(`\n--- Сервер запущен: http://localhost:${PORT} ---\n`);
});