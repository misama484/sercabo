const fs = require("fs");
const path = require("path");

// Ruta del archivo JSON
const filePath = path.join(__dirname, "preguntas.json");

// Leer el archivo JSON
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error al leer el archivo:", err);
    return;
  }

  try {
    // Parsear el JSON
    const preguntas = JSON.parse(data);

    // Eliminar la propiedad "fuentes" de cada objeto
    const preguntasSinFuentes = preguntas.map((pregunta) => {
      const { fuentes, ...resto } = pregunta; // Excluir "fuentes"
      return resto;
    });

    // Guardar el JSON actualizado
    fs.writeFile(
      filePath,
      JSON.stringify(preguntasSinFuentes, null, 2),
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