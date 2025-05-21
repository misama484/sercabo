const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../data/preguntasTema2Ley82006_con_tema.json');
const preguntas = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

let sql = `INSERT INTO preguntas (pregunta, respuesta_correcta, opciones, tema)\nVALUES\n`;

sql += preguntas.map(p => {
  // Escapar comillas simples en la pregunta y opciones
  const pregunta = p.pregunta.replace(/'/g, "''");
  const respuesta = p.respuesta_correcta.replace(/'/g, "''");
  const opciones = JSON.stringify(p.opciones).replace(/'/g, "''");
  const tema = p.tema;
  return `(
  '${pregunta}',
  '${respuesta}',
  '${opciones}'::jsonb,
  ${tema}
)`;
}).join(',\n');

sql += ';\n';

fs.writeFileSync(path.join(__dirname, '../data/insert_preguntasT2.sql'), sql, 'utf8');
console.log('Script SQL generado en data/insert_preguntasT2.sql');