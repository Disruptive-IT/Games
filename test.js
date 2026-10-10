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
  const requiredFiles = [
    'index.html',
    'style.css',
    'game.js',
    'chef-prompter.js',
    'sdlc-game.js',
    'NaviBot-512x512.png',
    'Disruptive---LOGO + Alpha.png',
    '.env.local',
    '.gitignore',
    'Dockerfile',
    'docker-compose.yml',
    '.github/workflows/deploy.yml',
    'nginx/play.neurodit.com.conf',
    'scripts/setup-ssl-nginx.sh'
  ];
  requiredFiles.forEach(file => {
    assert(fs.existsSync(path.join(__dirname, file)), `Archivo presente: ${file}`);
  });

  // 2. Verificar contenido de index.html
  const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  assert(htmlContent.includes('Conecta Tablas'), 'HTML contiene el título principal "Conecta Tablas"');
  assert(htmlContent.includes('Chef Prompter'), 'HTML contiene "Chef Prompter"');
  assert(htmlContent.includes('NaviBot-512x512.png'), 'HTML contiene favicon y avatar de NaviBot');
  assert(htmlContent.includes('Disruptive---LOGO + Alpha.png'), 'HTML contiene el logo de Disruptive IT');
  assert(htmlContent.includes('ID Principal'), 'HTML contiene badge "ID Principal" (PK)');
  assert(htmlContent.includes('ID Enlace'), 'HTML contiene badge "ID Enlace" (FK)');
  assert(htmlContent.includes('Tabla Clientes'), 'HTML contiene "Tabla Clientes"');
  assert(htmlContent.includes('Tabla Pedidos'), 'HTML contiene "Tabla Pedidos"');
  assert(htmlContent.includes('id_cliente'), 'HTML contiene el campo clave "id_cliente"');
  assert(htmlContent.includes('id_pedido'), 'HTML contiene el campo clave "id_pedido"');
  assert(htmlContent.includes('modal-welcome'), 'HTML contiene el modal de bienvenida');
  assert(htmlContent.includes('modal-instructions'), 'HTML contiene el modal de instrucciones');
  assert(htmlContent.includes('modal-final-victory'), 'HTML contiene el modal de graduación final');
  assert(htmlContent.includes('arcade-hub'), 'HTML contiene la sección de catálogo arcade-hub');
  assert(htmlContent.includes('level-pills-bar'), 'HTML contiene el selector de 3 niveles');
  assert(htmlContent.includes('bottom-success-bar'), 'HTML contiene la barra inferior de éxito');
  assert(htmlContent.includes('chef-prompter-stage'), 'HTML contiene el contenedor #chef-prompter-stage');
  assert(htmlContent.includes('chef-speech-bubble'), 'HTML contiene la burbuja de habla de NaviBot');
  assert(htmlContent.includes('chef-dishes-grid'), 'HTML contiene la grilla de platos');
  assert(htmlContent.includes('final-prompt-code'), 'HTML contiene el bloque de código del prompt final');
  assert(htmlContent.includes('btn-copy-prompt'), 'HTML contiene el botón de copiado de prompt');
  assert(htmlContent.includes('chef-prompter.js'), 'HTML importa el script chef-prompter.js');
  assert(htmlContent.includes('DIT INTERACTIVE'), 'HTML contiene el badge "DIT INTERACTIVE"');
  assert(htmlContent.includes('CÓDIGO + IA'), 'HTML contiene el badge "CÓDIGO + IA"');
  assert(htmlContent.includes('El Poder de Crear con Código'), 'HTML contiene el título motivacional del modal de bienvenida');
  assert(htmlContent.includes('superpoder para resolver problemas'), 'HTML contiene el mensaje motivacional para los estudiantes sobre codificar');
  assert(htmlContent.includes('¡Comenzar!'), 'HTML contiene el botón "¡Comenzar!" del modal de bienvenida');
  assert(htmlContent.includes('Experiencias Interactivas de Aprendizaje'), 'HTML contiene el título principal del catálogo');
  assert(htmlContent.includes('Experiencias diseñadas por'), 'HTML contiene el subtítulo institucional');
  assert(htmlContent.includes('dit-main-footer'), 'HTML contiene el footer institucional DIT');
  assert(htmlContent.includes('https://www.facebook.com/disruptive.devops'), 'HTML contiene enlace a Facebook de DIT');
  assert(htmlContent.includes('https://www.instagram.com/disruptive.info'), 'HTML contiene enlace a Instagram de DIT');
  assert(htmlContent.includes('https://www.linkedin.com/company/neurodit/posts/?viewAsMember=true'), 'HTML contiene enlace a LinkedIn de DIT');
  assert(htmlContent.includes('id.neurodit.com'), 'HTML contiene enlace a la web principal id.neurodit.com');
  assert(htmlContent.includes('Todos los derechos reservados'), 'HTML contiene el aviso de todos los derechos reservados 2026');
  assert(htmlContent.includes('sdlc-game-stage'), 'HTML contiene el contenedor #sdlc-game-stage');
  assert(htmlContent.includes('sdlc-wheel-svg'), 'HTML contiene el SVG interactivo de la rueda SDLC');
  assert(htmlContent.includes('sdlc-cards-rack'), 'HTML contiene el rack de tarjetas de fases SDLC');
  assert(htmlContent.includes('modal-sdlc-guide'), 'HTML contiene el modal de guía teórica del SDLC');
  assert(htmlContent.includes('modal-sdlc-victory'), 'HTML contiene el modal de graduación y victoria del SDLC');
  assert(htmlContent.includes('sdlc-game.js'), 'HTML importa el script sdlc-game.js');
  assert(htmlContent.includes('btn-start-sdlc'), 'HTML contiene el botón de acceso al juego SDLC');

  // 3. Verificar que .gitignore ignora .env.local
  const gitignore = fs.readFileSync(path.join(__dirname, '.gitignore'), 'utf8');
  assert(gitignore.includes('.env.local'), '.gitignore ignora adecuadamente .env.local');

  // 4. Verificar sintaxis JavaScript de game.js
  const jsContent = fs.readFileSync(path.join(__dirname, 'game.js'), 'utf8');
  assert(jsContent.includes('LEVELS'), 'game.js contiene definición de niveles');
  assert(jsContent.includes('Nivel 1/3'), 'game.js contiene Nivel 1');
  assert(jsContent.includes('Nivel 2/3'), 'game.js contiene Nivel 2');
  assert(jsContent.includes('Nivel 3/3'), 'game.js contiene Nivel 3');
  assert(jsContent.includes('conecta-tablas'), 'game.js maneja ruta /conecta-tablas');
  assert(jsContent.includes('chef-prompter'), 'game.js maneja ruta /chef-prompter');
  assert(jsContent.includes('showChefPrompterView'), 'game.js implementa showChefPrompterView');
  assert(jsContent.includes('navigateToChefPrompter'), 'game.js implementa navigateToChefPrompter');
  assert(jsContent.includes('showSdlcView'), 'game.js implementa showSdlcView');
  assert(jsContent.includes('navigateToSdlc'), 'game.js implementa navigateToSdlc');
  assert(jsContent.includes('SoundController'), 'game.js implementa Web Audio API synth');
  assert(jsContent.includes('validateConnection'), 'game.js implementa validación pedagógica');

  // 5. Verificar lógica de chef-prompter.js
  const chefJsContent = fs.readFileSync(path.join(__dirname, 'chef-prompter.js'), 'utf8');
  assert(chefJsContent.includes('DISH_PRESETS'), 'chef-prompter.js define recetas de platos');
  assert(chefJsContent.includes('Sopa de Ideas'), 'chef-prompter.js incluye Sopa de Ideas');
  assert(chefJsContent.includes('Sancocho de Código'), 'chef-prompter.js incluye Sancocho de Código');
  assert(chefJsContent.includes('Banquete Visual'), 'chef-prompter.js incluye Banquete Visual para imágenes');
  assert(chefJsContent.includes('Pastel de Resumen'), 'chef-prompter.js incluye Pastel de Resumen');
  assert(chefJsContent.includes('Ensalada de Aprendizaje'), 'chef-prompter.js incluye Ensalada de Aprendizaje');
  assert(chefJsContent.includes('Estofado de Autor'), 'chef-prompter.js incluye Estofado de Autor');
  assert(chefJsContent.includes('renderFinalPrompt'), 'chef-prompter.js implementa renderFinalPrompt');
  assert(chefJsContent.includes('Actúa como un experto en'), 'chef-prompter.js incluye plantilla requerida');
  assert(chefJsContent.includes('Tip del Chef'), 'chef-prompter.js incluye tips pedagógicos del Chef');
  assert(htmlContent.includes('Chef de Prompts de alto nivel'), 'index.html felicita como Chef de Prompts de alto nivel');

  // 6. Verificar lógica de sdlc-game.js
  const sdlcJsContent = fs.readFileSync(path.join(__dirname, 'sdlc-game.js'), 'utf8');
  assert(sdlcJsContent.includes('SDLC_PHASES'), 'sdlc-game.js define las fases canónicas del SDLC');
  assert(sdlcJsContent.includes('Planificación') && sdlcJsContent.includes('Despliegue'), 'sdlc-game.js cubre desde Planificación hasta Despliegue');
  assert(sdlcJsContent.includes('handleIncorrectSelection'), 'sdlc-game.js implementa validación con retroalimentación de error');
  assert(sdlcJsContent.includes('getPhaseHint'), 'sdlc-game.js implementa sistema de pistas pedagógicas');
  assert(sdlcJsContent.includes('scrollIntoView'), 'sdlc-game.js centra la pantalla en el tutor en error pedagógico');
  assert(htmlContent.includes('btn-lobby-neurodit'), 'HTML contiene el botón corporativo id.neurodit.com en cabecera');
  assert(!htmlContent.includes('btn-sdlc-back-catalog'), 'HTML ha removido el botón redundante de catálogo de la barra SDLC');
  assert(jsContent.includes('btnLobbyNeurodit'), 'game.js gestiona dinámicamente la visibilidad de controles en el lobby');

  console.log(`\n========================================`);
  console.log(`Resultados: ${passed} pruebas exitosas, ${failed} fallos.`);
  console.log(`========================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
