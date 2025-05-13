const fs = require("fs");
const path = require("path");

// Ruta del archivo JSON
const filePath = path.join(__dirname, "preguntasTema1RROO.json");

// Leer el archivo JSON
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error al leer el archivo:", err);
    return;
  }

  try {
    // Parsear el JSON
    const preguntas = JSON.parse(data);

    // Cambiar "respuestas" por "opciones" en cada objeto
    const preguntasActualizadas = preguntas.map((pregunta) => {
      const { respuestas, ...resto } = pregunta;
      return {
        ...resto,
        opciones: respuestas, // Renombrar "respuestas" a "opciones"
      };
    });

    // Guardar el JSON actualizado
    fs.writeFile(
      filePath,
      JSON.stringify(preguntasActualizadas, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error("Error al escribir el archivo:", err);
          return;
        }
        console.log("Archivo actualizado correctamente.");
      }
    );
  } catch (error) {
    console.error("Error al procesar el JSON:", error);
  }
});