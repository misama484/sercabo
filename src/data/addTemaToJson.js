const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../data/preguntasTema2Ley82006.json');
const outputPath = path.join(__dirname, '../data/preguntasTema2Ley82006_con_tema.json');

const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const newData = data.map(obj => ({
  ...obj,
  tema: 2
}));

fs.writeFileSync(outputPath, JSON.stringify(newData, null, 2), 'utf8');

console.log('Archivo actualizado con el campo "tema" añadido.');