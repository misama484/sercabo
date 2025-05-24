const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../data/preguntasTema4CarreraMilitar.json');
const outputPath = path.join(__dirname, '../data/preguntasTema4CarreraMilitar_con_tema.json');

const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const newData = data.map(obj => ({
  ...obj,
  tema: 4
}));

fs.writeFileSync(outputPath, JSON.stringify(newData, null, 2), 'utf8');

console.log('Archivo actualizado con el campo "tema" añadido.');