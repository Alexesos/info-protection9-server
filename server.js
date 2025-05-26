const express = require('express');
const cors = require('cors');
// const iconv = require('iconv-lite');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const _p = 3;
const _q = 4;

const getPad = (base) => Math.ceil(Math.log(256) / Math.log(base));

const stringToBase = (message, base) => {
    const buf = iconv.encode(message, 'win1251');
    const pad = getPad(base);
    return Array.from(buf).map(b => 
        b.toString(base).padStart(pad, '0')
    ).join(' ');
};

const baseToBytes = (str, base) => {
    const pad = getPad(base);
    return str.split(' ').map(chunk => 
        parseInt(chunk.padStart(pad, '0'), base)
    ).filter(num => !isNaN(num));
};

const mpscEncode = (message, p, q) => {
    const strInP = stringToBase(message, p);
    const bytesFromP = baseToBytes(strInP, p);

    const adjustedBytes = bytesFromP.map(b => (b + 1) % 256);
    const strPtoQ = adjustedBytes.map(b => 
        b.toString(q).padStart(getPad(q), '0')
    ).join(' ');

    const bytesFromQ = baseToBytes(strPtoQ, q);
    const finalBytes = bytesFromQ.map(b => b % 256);

    const folded = [];
    for (let i = 0; i < bytesFromP.length; i++) {
        folded.push((bytesFromP[i] ^ finalBytes[i]).toString(16).padStart(2, '0'));
    }

    return folded;
};

app.post('/api/hash/mpsc', (req, res) => {
    const { message } = req.body;

    const hash = mpscEncode(message, _p, _q);

    console.log(hash);

    res.json({ hash });
});

app.post('/api/check/mpsc', (req, res) => {
    const { message, hash } = req.body;

    const newHash = mpscEncode(message, _p, _q);
    const isValid = newHash.join(',') === hash.join(',');

    res.json({ isValid });
});

app.listen(PORT, () => {
    console.log(`\n--- Сервер запущен: http://localhost:${PORT} ---\n`);
});