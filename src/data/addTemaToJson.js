const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../data/preguntasTema6SeguridadEnLasFas.json');
const outputPath = path.join(__dirname, '../data/preguntasTema6SeguridadEnLasFas_con_tema.json');

const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const newData = data.map(obj => ({
  ...obj,
  tema: 6
}));

fs.writeFileSync(outputPath, JSON.stringify(newData, null, 2), 'utf8');

console.log('Archivo actualizado con el campo "tema" añadido.');