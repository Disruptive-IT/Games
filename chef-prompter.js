/**
 * DIT - Chef Prompter: La Cocina de los Prompts de Disruptive IT
 * Minijuego interactivo guiado por NaviBot para aprender Ingeniería de Prompts
 * Estructura de receta: Contexto (Base), Instrucción (Proteína) y Formato (Emplatado).
 */

(() => {
  'use strict';

  // =========================================================================
  // Recetas Predefinidas y Sugerencias de la Cocina
  // =========================================================================
  const DISH_PRESETS = [
    {
      id: 'ideas',
      emoji: '💡',
      name: 'Sopa de Ideas',
      category: 'Creatividad / Generación',
      desc: 'Ideal para lluvia de ideas, nombres de proyectos, campañas y conceptos frescos.',
      defaultContextRole: 'Estratega Creativo e Innovador de Producto',
      contextSuggestions: [
        'Tengo una startup de tecnología educativa y quiero lanzar una función innovadora.',
        'Somos una agencia digital buscando conceptos disruptivos para redes sociales.',
        'Estoy diseñando un videojuego indie 2D y necesito mecánicas sorprendentes.'
      ],
      defaultAction: 'Dame 5 ideas innovadoras con su propuesta de valor única y público objetivo.',
      actionSuggestions: [
        'Genera 5 conceptos creativos con un ángulo no convencional.',
        'Dame 3 propuestas de nombres pegajosos con su eslogan correspondiente.',
        'Plantea 4 enfoques distintos para resolver un problema de retención de usuarios.'
      ]
    },
    {
      id: 'codigo',
      emoji: '💻',
      name: 'Sancocho de Código',
      category: 'Programación / Desarrollo',
      desc: 'Para diseñar algoritmos, resolver bugs, crear componentes o estructurar APIs.',
      defaultContextRole: 'Arquitecto de Software Senior y Desarrollador Fullstack',
      contextSuggestions: [
        'Soy un desarrollador construyendo una aplicación web moderna con JavaScript vanilla.',
        'Estamos desarrollando una API REST segura en Node.js que procesa pagos.',
        'Estoy optimizando el rendimiento de una base de datos relacional PostgreSQL con alto tráfico.'
      ],
      defaultAction: 'Escribe el código limpio, modular y documentado con buenas prácticas y manejo de errores.',
      actionSuggestions: [
        'Escribe una función modular con TypeScript explicando cada paso clave.',
        'Diseña un schema de base de datos relacional con claves primarias y foráneas.',
        'Refactoriza este código aplicando principios SOLID y patrones de diseño limpios.'
      ]
    },
    {
      id: 'resumen',
      emoji: '📝',
      name: 'Pastel de Resumen',
      category: 'Análisis / Síntesis',
      desc: 'Perfecto para digerir textos densos, minutas de reunión o documentación técnica.',
      defaultContextRole: 'Analista de Negocios y Experto en Síntesis Estratégica',
      contextSuggestions: [
        'Tengo un informe técnico de 20 páginas sobre arquitectura en la nube.',
        'Acabamos de tener una reunión con inversionistas y necesito extraer los acuerdos clave.',
        'Soy estudiante y debo comprender los puntos centrales de un paper científico.'
      ],
      defaultAction: 'Sintetiza la información extrayendo conclusiones clave, métricas y próximos pasos.',
      actionSuggestions: [
        'Resume los 3 argumentos principales y presenta una conclusión ejecutiva.',
        'Extrae una lista de tareas pendientes con responsables y niveles de prioridad.',
        'Transforma este contenido técnico en una explicación clara para un cliente no técnico.'
      ]
    },
    {
      id: 'aprendizaje',
      emoji: '🎓',
      name: 'Ensalada de Aprendizaje',
      category: 'Estudio / Explicación Rápida',
      desc: 'Aprende cualquier concepto complejo explicado con analogías sencillas.',
      defaultContextRole: 'Profesor Universitario Pedagógico y Mentor Tecnológico',
      contextSuggestions: [
        'Soy un principiante absoluto intentando entender qué es Docker y los contenedores.',
        'Necesito comprender cómo funcionan los algoritmos de Machine Learning sin tecnicismos.',
        'Quiero dominar el concepto de claves primarias y foráneas en bases de datos.'
      ],
      defaultAction: 'Explícame este concepto utilizando una metáfora cotidiana, ejemplos prácticos y un resumen.',
      actionSuggestions: [
        'Explícamelo como si tuviera 10 años usando una analogía visual divertida.',
        'Dame una guía paso a paso desde cero con preguntas frecuentes.',
        'Compara este concepto con algo de la vida diaria para nunca olvidarlo.'
      ]
    },
    {
      id: 'autor',
      emoji: '🗺️',
      name: 'Estofado de Autor',
      category: 'Tema Libre / Personalizado',
      desc: 'Diseña tu receta completamente desde cero con total libertad culinaria.',
      defaultContextRole: 'Consultor Especialista de Alto Rendimiento',
      contextSuggestions: [
        'Estoy redactando una propuesta comercial para un cliente corporativo.',
        'Necesito planificar un plan de entrenamiento y productividad semanal.',
        'Quiero simular una entrevista técnica de trabajo para un puesto de Senior Engineer.'
      ],
      defaultAction: 'Proporciona una guía detallada, accionable y estructurada adaptada a mis necesidades.',
      actionSuggestions: [
        'Redacta un plan de acción de 3 fases con métricas de éxito.',
        'Evalúa los pros y contras de esta decisión y dame una recomendación fundamentada.',
        'Simula ser mi entrevistador y hazme 3 preguntas desafiantes una a una.'
      ]
    }
  ];

  // =========================================================================
  // Controlador del Minijuego Chef Prompter
  // =========================================================================
  class ChefPrompterGame {
    constructor() {
      this.currentPhase = 0; // 0: Menú, 1: Contexto, 2: Instrucción, 3: Formato, 4: Servido
      this.selectedDish = null;
      this.recipe = {
        dishName: '',
        contextRole: '',
        contextScenario: '',
        instruction: '',
        format: ''
      };

      // Sonidos de cocina sintetizados
      this.initAudio();

      // Referencias DOM
      this.dom = {
        container: document.getElementById('chef-prompter-stage'),
        navibotSpeech: document.getElementById('chef-speech-bubble'),
        navibotStatus: document.getElementById('chef-avatar-status'),
        phaseSteps: document.querySelectorAll('.kitchen-step-badge'),
        // Fases
        phaseMenu: document.getElementById('phase-menu'),
        phaseContext: document.getElementById('phase-context'),
        phaseInstruction: document.getElementById('phase-instruction'),
        phaseFormat: document.getElementById('phase-format'),
        phasePlated: document.getElementById('phase-plated'),
        // Inputs & Controles
        dishCardsContainer: document.getElementById('chef-dishes-grid'),
        // Contexto
        contextRoleInput: document.getElementById('input-context-role'),
        contextScenarioInput: document.getElementById('input-context-scenario'),
        contextChipsContainer: document.getElementById('chips-context-suggestions'),
        btnNextContext: document.getElementById('btn-next-context'),
        // Instrucción
        instructionInput: document.getElementById('input-instruction-text'),
        instructionChipsContainer: document.getElementById('chips-instruction-suggestions'),
        btnNextInstruction: document.getElementById('btn-next-instruction'),
        // Formato
        formatOptions: document.querySelectorAll('.format-option-card'),
        customFormatInput: document.getElementById('input-custom-format'),
        btnBakePrompt: document.getElementById('btn-bake-prompt'),
        // Plato Servido
        promptOutputBlock: document.getElementById('final-prompt-code'),
        btnCopyPrompt: document.getElementById('btn-copy-prompt'),
        btnCookAgain: document.getElementById('btn-cook-again'),
        btnExitToHub: document.getElementById('btn-exit-to-hub'),
        btnSwitchToTables: document.getElementById('btn-switch-to-tables')
      };

      this.init();
    }

    initAudio() {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = AudioCtx ? new AudioCtx() : null;
    }

    playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    }

    playDing() {
      // Campanilla de horno final (Ding!)
      this.playTone(880, 'sine', 0.5, 0.2);
      setTimeout(() => this.playTone(1320, 'sine', 0.8, 0.18), 80);
    }

    playSizzle() {
      // Toque suave de sartén
      this.playTone(320, 'triangle', 0.1, 0.12);
      setTimeout(() => this.playTone(480, 'sine', 0.12, 0.12), 60);
    }

    init() {
      this.renderDishCards();
      this.setupEventListeners();
      this.setPhase(0);
    }

    // =======================================================================
    // Renderizado del Menú de Platos (Fase 0)
    // =======================================================================
    renderDishCards() {
      if (!this.dom.dishCardsContainer) return;
      this.dom.dishCardsContainer.innerHTML = '';

      DISH_PRESETS.forEach(dish => {
        const card = document.createElement('div');
        card.className = 'chef-dish-card';
        card.dataset.dishId = dish.id;
        card.innerHTML = `
          <div class="dish-card-icon">${dish.emoji}</div>
          <div class="dish-card-body">
            <h3 class="dish-card-title">${dish.name}</h3>
            <span class="dish-card-tag">${dish.category}</span>
            <p class="dish-card-desc">${dish.desc}</p>
          </div>
          <button class="btn-select-dish">Cocinar 👨‍🍳</button>
        `;

        card.addEventListener('click', () => {
          this.selectDish(dish);
        });

        this.dom.dishCardsContainer.appendChild(card);
      });
    }

    selectDish(dish) {
      this.selectedDish = dish;
      this.recipe.dishName = dish.name;
      this.playSizzle();

      // Prellenar inputs de la fase 1
      this.dom.contextRoleInput.value = dish.defaultContextRole;
      this.dom.instructionInput.value = dish.defaultAction;

      // Renderizar sugerencias para contexto
      this.renderContextChips(dish.contextSuggestions);
      this.renderInstructionChips(dish.actionSuggestions);

      // Pasar a Fase 1
      this.setPhase(1);
    }

    renderContextChips(suggestions) {
      if (!this.dom.contextChipsContainer) return;
      this.dom.contextChipsContainer.innerHTML = '';

      suggestions.forEach(s => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'ingredient-chip';
        chip.innerHTML = `<span>🧂</span> ${s}`;
        chip.addEventListener('click', () => {
          this.dom.contextScenarioInput.value = s;
          this.playTone(520, 'sine', 0.08, 0.08);
        });
        this.dom.contextChipsContainer.appendChild(chip);
      });
    }

    renderInstructionChips(suggestions) {
      if (!this.dom.instructionChipsContainer) return;
      this.dom.instructionChipsContainer.innerHTML = '';

      suggestions.forEach(s => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'ingredient-chip';
        chip.innerHTML = `<span>🥩</span> ${s}`;
        chip.addEventListener('click', () => {
          this.dom.instructionInput.value = s;
          this.playTone(580, 'sine', 0.08, 0.08);
        });
        this.dom.instructionChipsContainer.appendChild(chip);
      });
    }

    // =======================================================================
    // Gestión de Fases de la Cocina
    // =======================================================================
    setPhase(phaseIndex) {
      this.currentPhase = phaseIndex;

      // Actualizar visual de pasos
      this.dom.phaseSteps.forEach((step, idx) => {
        if (idx === phaseIndex) {
          step.classList.add('active');
          step.classList.remove('completed');
        } else if (idx < phaseIndex) {
          step.classList.add('completed');
          step.classList.remove('active');
        } else {
          step.classList.remove('active', 'completed');
        }
      });

      // Ocultar todas las fases
      this.dom.phaseMenu.classList.add('hidden');
      this.dom.phaseContext.classList.add('hidden');
      this.dom.phaseInstruction.classList.add('hidden');
      this.dom.phaseFormat.classList.add('hidden');
      this.dom.phasePlated.classList.add('hidden');

      // Actualizar diálogo de NaviBot y mostrar fase activa
      switch (phaseIndex) {
        case 0:
          this.dom.phaseMenu.classList.remove('hidden');
          this.updateNaviSpeech(
            '¡Hola! 👨‍🍳🔥 Soy el chef estrella de <strong>Disruptive IT</strong>. Hoy cocinaremos tu primer Gran Prompt con la receta secreta: <em>Contexto, Instrucción y Formato</em>. ¿Qué plato te gustaría preparar hoy?',
            'Esperando orden del menú...'
          );
          break;

        case 1:
          this.dom.phaseContext.classList.remove('hidden');
          this.updateNaviSpeech(
            `¡Delicioso! Elegiste <strong>${this.selectedDish.name}</strong> ${this.selectedDish.emoji}. Ahora colocaremos el <strong>ingrediente base: El Contexto</strong> (quién es la IA y cuál es tu situación o escenario).<br><br>💡 <em>Tip del Chef:</em> Mientras más específico sea tu contexto, más rico y sazonado será el sabor de tu prompt.`,
            'Sazonando el contexto...'
          );
          break;

        case 2:
          this.dom.phaseInstruction.classList.remove('hidden');
          this.updateNaviSpeech(
            '¡Excelente base sazonada! 🧂 Ahora agregaremos la proteína central del plato: la <strong>Instrucción</strong>. ¿Qué tarea específica debe realizar la IA? Recuerda ser claro y directo.',
            'Cocinando la instrucción...'
          );
          break;

        case 3:
          this.dom.phaseFormat.classList.remove('hidden');
          this.updateNaviSpeech(
            '¡Qué gran aroma toma esto! 🥩 Ahora el toque de alta cocina: el <strong>Formato (Emplatado)</strong>. ¿Cómo quieres que la IA te sirva el resultado?',
            'Seleccionando emplatado...'
          );
          break;

        case 4:
          this.dom.phasePlated.classList.remove('hidden');
          this.updateNaviSpeech(
            '¡Tu receta está lista y el horno ha hecho su magia! 👨‍🍳🔥 Has cocinado un Súper Prompt de cinco estrellas. ¡Copia tu creación y pruébala en tu IA favorita!',
            '¡Plato servido con éxito! 🏆'
          );
          this.renderFinalPrompt();
          break;
      }
    }

    updateNaviSpeech(html, statusText) {
      if (this.dom.navibotSpeech) {
        this.dom.navibotSpeech.innerHTML = html;
      }
      if (this.dom.navibotStatus) {
        this.dom.navibotStatus.textContent = statusText;
      }
    }

    // =======================================================================
    // Eventos y Validaciones
    // =======================================================================
    setupEventListeners() {
      // Fase 1 -> 2: Contexto
      if (this.dom.btnNextContext) {
        this.dom.btnNextContext.addEventListener('click', () => {
          const role = this.dom.contextRoleInput.value.trim();
          const scenario = this.dom.contextScenarioInput.value.trim();

          if (!role && !scenario) {
            this.dom.contextScenarioInput.focus();
            this.dom.contextScenarioInput.classList.add('shake-input');
            setTimeout(() => this.dom.contextScenarioInput.classList.remove('shake-input'), 400);
            return;
          }

          this.recipe.contextRole = role || 'Experto en la materia';
          this.recipe.contextScenario = scenario || 'Proyecto de desarrollo e innovación tecnológica';
          this.playSizzle();
          this.setPhase(2);
        });
      }

      // Fase 2 -> 3: Instrucción
      if (this.dom.btnNextInstruction) {
        this.dom.btnNextInstruction.addEventListener('click', () => {
          const instruction = this.dom.instructionInput.value.trim();

          if (!instruction || instruction.length < 5) {
            this.dom.instructionInput.focus();
            this.dom.instructionInput.classList.add('shake-input');
            setTimeout(() => this.dom.instructionInput.classList.remove('shake-input'), 400);
            return;
          }

          // Si es muy vago, advertencia cariñosa de chef
          if (instruction.split(' ').length < 3) {
            this.updateNaviSpeech(
              '👨‍🍳 <em>¡Ojo de Chef!</em> Esa instrucción está un poco cruda. Agrega un poco más de detalle (ejemplo: añade la cantidad o el objetivo exacto) para que la IA cocine a la perfección.',
              'Ajustando sazón...'
            );
          }

          this.recipe.instruction = instruction;
          this.playSizzle();
          this.setPhase(3);
        });
      }

      // Selección de formato
      this.dom.formatOptions.forEach(opt => {
        opt.addEventListener('click', () => {
          this.dom.formatOptions.forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');
          this.recipe.format = opt.dataset.formatVal;
          this.playTone(620, 'sine', 0.08, 0.09);
        });
      });

      // Fase 3 -> 4: Hornear
      if (this.dom.btnBakePrompt) {
        this.dom.btnBakePrompt.addEventListener('click', () => {
          const custom = this.dom.customFormatInput.value.trim();
          if (custom) {
            this.recipe.format = custom;
          } else if (!this.recipe.format) {
            this.recipe.format = 'Formato Markdown limpio, organizado con subtítulos y viñetas claras.';
          }

          this.playDing();
          if (window.confetti) {
            window.confetti();
          }
          this.setPhase(4);
        });
      }

      // Copiar prompt
      if (this.dom.btnCopyPrompt) {
        this.dom.btnCopyPrompt.addEventListener('click', () => {
          const promptText = this.dom.promptOutputBlock.textContent;
          navigator.clipboard.writeText(promptText).then(() => {
            this.dom.btnCopyPrompt.innerHTML = `<span>✓</span> ¡Copiado con Éxito!`;
            this.dom.btnCopyPrompt.classList.add('btn-copied');
            this.playTone(880, 'sine', 0.2, 0.15);
            setTimeout(() => {
              this.dom.btnCopyPrompt.innerHTML = `<span>📋</span> Copiar Súper Prompt`;
              this.dom.btnCopyPrompt.classList.remove('btn-copied');
            }, 3000);
          }).catch(() => {
            alert('Prompt listo en pantalla para copiar.');
          });
        });
      }

      // Cocinar de nuevo
      if (this.dom.btnCookAgain) {
        this.dom.btnCookAgain.addEventListener('click', () => {
          this.recipe = { dishName: '', contextRole: '', contextScenario: '', instruction: '', format: '' };
          this.setPhase(0);
        });
      }

      // Ir a Catálogo
      if (this.dom.btnExitToHub) {
        this.dom.btnExitToHub.addEventListener('click', () => {
          if (window.game && window.game.navigateToHub) {
            window.game.navigateToHub();
          } else {
            window.location.href = '/';
          }
        });
      }

      // Cambiar a Conecta Tablas
      if (this.dom.btnSwitchToTables) {
        this.dom.btnSwitchToTables.addEventListener('click', () => {
          if (window.game && window.game.navigateToGame) {
            window.game.navigateToGame(0);
          } else {
            window.location.href = '/conecta-tablas';
          }
        });
      }
    }

    // =======================================================================
    // Generación del Prompt Final Estructurado
    // =======================================================================
    renderFinalPrompt() {
      const template = `[Copia y pega este prompt en tu IA favorita]
=========================================
Actúa como un experto en ${this.recipe.contextRole}.

Mi objetivo es ${this.recipe.instruction}. Para lograrlo, ten en cuenta el siguiente escenario:
${this.recipe.contextScenario}

Por favor, realiza la siguiente tarea:
- ${this.recipe.instruction}

Presenta el resultado final utilizando el siguiente formato:
${this.recipe.format}
=========================================`;

      if (this.dom.promptOutputBlock) {
        this.dom.promptOutputBlock.textContent = template;
      }
    }
  }

  // Inicializar Chef Prompter al cargar la página
  window.addEventListener('DOMContentLoaded', () => {
    window.chefPrompter = new ChefPrompterGame();
  });
})();
