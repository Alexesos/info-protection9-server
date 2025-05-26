const express = require('express');
const cors = require('cors');
// const iconv = require('iconv-lite');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`\n--- Сервер запущен: http://localhost:${PORT} ---\n`);
});