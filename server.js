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
    console.log(`EQS REQUEST`);
    const { message } = req.body;
    let keys = utils.genKeys();
    console.log('KEYS', keys);
    while (keys.d < 0) {
        keys = utils.genKeys();
    } 
    const m = utils.moduleHash(message);
    console.log(`Module Hash:`, m);
    console.log('m', m);
    const s = utils.getS(m, keys.d, keys.n);
    console.log('s', s);
    m.forEach((item, index) => {
        _hashTable.push({[item]: s[index]});
    });

    console.log(`TO h -> s: ${s}, e: ${keys.e}, n: ${keys.n}`);
    const h = utils.getH(s, keys.e, keys.n);
    console.log(`h: ${h}`);

    res.json({ _hashTable, keys });
});

app.post('/api/read/EQS', (req, res) => {
    console.log(`EQS READ CALL`);
    const { message, keys } = req.body;
    const [e, n] = keys;

    console.log(`Body: message=${message}, keys=${keys}, e=${e}, n=${n}`);

    const array = message.split(',');
    const s = array
        .map(Number)
        .filter((item, index) => index % 2 !== 0);
    
    const m = array
        .map(Number)
        .filter((item, index) => index % 2 === 0);

    console.log(`s:`, s);

    const h = utils.getH(s, e, n);
    const isValid = m.join('') === h.join('');
    console.log(h);
    console.log(isValid);

    res.json({ isValid });
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