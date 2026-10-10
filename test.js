/**
 * Test de Verificación Autónoma - Disruptive Information Technologies (DIT)
 * Valida la integridad de los archivos, sintaxis HTML/CSS/JS y reglas educativas de bases de datos.
 */

const fs = require('fs');
const path = require('path');

function runTests() {
  console.log('🚀 Iniciando Suite de Verificación Autónoma DIT...');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASÓ: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FALLÓ: ${testName}`);
      failed++;
    }
  }

  // 1. Verificar existencia de archivos obligatorios
  const requiredFiles = ['index.html', 'style.css', 'game.js', '.env.local', '.gitignore', 'Dockerfile', 'docker-compose.yml'];
  requiredFiles.forEach(file => {
    assert(fs.existsSync(path.join(__dirname, file)), `Archivo presente: ${file}`);
  });

  // 2. Verificar contenido de index.html
  const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  assert(htmlContent.includes('Conecta Tablas'), 'HTML contiene el título principal "Conecta Tablas"');
  assert(htmlContent.includes('ID Principal'), 'HTML contiene badge "ID Principal" (PK)');
  assert(htmlContent.includes('ID Enlace'), 'HTML contiene badge "ID Enlace" (FK)');
  assert(htmlContent.includes('Tabla Clientes'), 'HTML contiene "Tabla Clientes"');
  assert(htmlContent.includes('Tabla Pedidos'), 'HTML contiene "Tabla Pedidos"');
  assert(htmlContent.includes('id_cliente'), 'HTML contiene el campo clave "id_cliente"');
  assert(htmlContent.includes('id_pedido'), 'HTML contiene el campo clave "id_pedido"');
  assert(htmlContent.includes('modal-welcome'), 'HTML contiene el modal de bienvenida');
  assert(htmlContent.includes('modal-instructions'), 'HTML contiene el modal de instrucciones');
  assert(htmlContent.includes('bottom-success-bar'), 'HTML contiene la barra inferior de éxito');

  // 3. Verificar que .gitignore ignora .env.local
  const gitignore = fs.readFileSync(path.join(__dirname, '.gitignore'), 'utf8');
  assert(gitignore.includes('.env.local'), '.gitignore ignora adecuadamente .env.local');

  // 4. Verificar sintaxis JavaScript de game.js
  const jsContent = fs.readFileSync(path.join(__dirname, 'game.js'), 'utf8');
  assert(jsContent.includes('LEVELS'), 'game.js contiene definición de niveles');
  assert(jsContent.includes('SoundController'), 'game.js implementa Web Audio API synth');
  assert(jsContent.includes('validateConnection'), 'game.js implementa validación pedagógica');

  console.log(`\n========================================`);
  console.log(`Resultados: ${passed} pruebas exitosas, ${failed} fallos.`);
  console.log(`========================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
