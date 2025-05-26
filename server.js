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
    console.log('m', m);
    const s = utils.getS(m, keys.d, keys.n);
    console.log('s', s);
    m.forEach((item, index) => {
        _hashTable.push({[item]: s[index]});
    });

    res.json({ _hashTable, keys });
});

app.post('/api/read/EQS', (req, res) => {
    const { message, keys } = req.body;
    const h = utils.getH(s, keys.e, keys.n);

    console.log(message);
    console.log(h);
});

app.listen(PORT, () => {
    console.log(`\n--- Сервер запущен: http://localhost:${PORT} ---\n`);
});