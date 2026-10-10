/**
 * DIT - Ciclo de Vida del Software (SDLC)
 * Minijuego interactivo de la Rueda del Ciclo de Vida del Software
 * Diseñado para estudiantes con retroalimentación pedagógica, pistas y visualización circular.
 */

(() => {
  'use strict';

  // =========================================================================
  // Definición Canónica de las 6 Fases del SDLC
  // =========================================================================
  const SDLC_PHASES = [
    {
      id: 'planificacion',
      order: 1,
      title: 'Planificación',
      subtitle: 'Definir el objetivo, alcance y viabilidad',
      icon: '📋',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      glowColor: 'rgba(245, 158, 11, 0.45)',
      tags: ['🎯 Objetivos', '💰 Presupuesto', '⏱️ Cronograma'],
      summary: 'Se define el problema a resolver, los recursos disponibles, el presupuesto, los plazos y si el proyecto es técnica y económicamente viable antes de invertir tiempo y dinero.',
      correctFeedback: '¡Exacto! Todo proyecto exitoso inicia con la Planificación. Antes de escribir una sola línea de código o diseñar pantallas, el equipo debe acordar qué problema resolverá, con qué presupuesto y en cuánto tiempo.',
      nextHint: 'Ahora que tenemos el plan aprobado, debemos reunirnos con el cliente y los usuarios finales para entender a fondo qué funciones exactas necesitan. ¿Qué fase se encarga de eso?',
      whyNotHereIfExpected: {
        analisis: 'Antes de levantar los requisitos en detalle, la dirección debe aprobar la viabilidad del proyecto, el presupuesto y los plazos generales.',
        diseno: '¡Muy apresurado! ¿Cómo diseñarías pantallas o bases de datos si aún no se ha definido el alcance general ni el presupuesto del proyecto?',
        implementacion: '¡El error clásico del programador principiante! Codificar sin planificar produce software caótico, costos disparados y proyectos cancelados.',
        testeo: '¡Imposible! No se puede probar ni auditar software que ni siquiera ha sido planificado.',
        despliegue: '¡Alerta máxima! El despliegue a producción es el resultado final del ciclo, no el punto de partida.'
      }
    },
    {
      id: 'analisis',
      order: 2,
      title: 'Análisis de Requisitos',
      subtitle: 'Entender las necesidades del cliente y usuarios',
      icon: '🔍',
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      glowColor: 'rgba(6, 182, 212, 0.45)',
      tags: ['📝 Historias de Usuario', '📑 Especificaciones', '👥 Entrevistas'],
      summary: 'Se recopilan, documentan y validan todos los requerimientos funcionales y no funcionales que el sistema debe cumplir para satisfacer las necesidades de los usuarios.',
      correctFeedback: '¡Brillante! El Análisis de Requisitos es el puente entre la idea y la construcción. Aquí se crean las historias de usuario y se define con exactitud qué hará el software.',
      nextHint: '¡Genial! Ya sabemos qué funciones necesita el usuario. Ahora los arquitectos e ingenieros deben crear los "planos" técnicos: diagramas de datos, APIs y prototipos de interfaz. ¿Cuál es esa fase?',
      whyNotHereIfExpected: {
        planificacion: 'La Planificación ya fue completada con éxito. Revisa el siguiente paso en la secuencia.',
        diseno: '¡Te estás saltando la investigación! No puedes diseñar la solución correcta sin antes haber analizado a fondo los requerimientos de los usuarios.',
        implementacion: 'Si comienzas a programar sin analizar los requerimientos, construirás funciones que el cliente no necesita o que no resuelven su problema real.',
        testeo: 'Los casos de prueba se redactan en base a los requisitos y al código; no puedes saltarte directo a pruebas.',
        despliegue: 'El despliegue ocurre cuando el software está terminado y verificado, no al inicio del análisis.'
      }
    },
    {
      id: 'diseno',
      order: 3,
      title: 'Diseño del Sistema',
      subtitle: 'Crear la arquitectura técnica y experiencia UI/UX',
      icon: '📐',
      color: '#a855f7',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #7d3c9e 100%)',
      glowColor: 'rgba(168, 85, 247, 0.45)',
      tags: ['🏗️ Arquitectura', '🗄️ Modelo de Datos', '🎨 Wireframes UI/UX'],
      summary: 'Se diseñan los planos técnicos de la aplicación: el modelo de entidad-relación de la base de datos, la arquitectura de microservicios o monolito, y las maquetas visuales de usuario.',
      correctFeedback: '¡Magnífico! El Diseño es como los planos de un rascacielos. Define la arquitectura de software, el esquema de la base de datos y la interfaz gráfica para que los programadores construyan sobre bases sólidas.',
      nextHint: '¡Los planos arquitectónicos y las interfaces están listos! Ahora llega el turno de los desarrolladores: encender los entornos de desarrollo y transformar el diseño en código real. ¿Cuál fase sigue?',
      whyNotHereIfExpected: {
        planificacion: 'La Planificación ya está colocada en la rueda.',
        analisis: 'El Análisis de Requisitos ya fue completado.',
        implementacion: 'Construir sin planos arquitectónicos hace que el software colapse ante el tráfico o sea inmodificable. Primero diseñamos la arquitectura y luego programamos.',
        testeo: 'No puedes probar la calidad del software si aún no se ha diseñado ni implementado.',
        despliegue: 'El despliegue es el paso final para publicar el producto.'
      }
    },
    {
      id: 'implementacion',
      order: 4,
      title: 'Implementación (Desarrollo)',
      subtitle: 'Codificación y construcción del software real',
      icon: '💻',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      glowColor: 'rgba(59, 130, 246, 0.45)',
      tags: ['⚡ Código Limpio', '🌐 Frontend & Backend', '🔀 Git & APIs'],
      summary: 'Los programadores e ingenieros de software escriben el código fuente real siguiendo los requisitos y las especificaciones de diseño arquitectónico y de interfaz.',
      correctFeedback: '¡Perfecto! Llegó la hora del código. En la Implementación, los desarrolladores dan vida a la solución escribiendo el backend, el frontend, las consultas de base de datos y las integraciones.',
      nextHint: 'El código está escrito y compila, pero... ¿cómo sabemos si no tiene errores críticos, vulnerabilidades o fallas de lógica? ¿Qué fase debe revisar la calidad?',
      whyNotHereIfExpected: {
        planificacion: 'La Planificación ya está completada.',
        analisis: 'Los Requisitos ya fueron analizados.',
        diseno: 'El Diseño técnico ya está terminado.',
        testeo: 'Los evaluadores de QA necesitan que el código esté escrito y funcionando para poder buscar errores. ¡Primero se programa!',
        despliegue: '¡Sería un desastre! No puedes poner en producción software que ni siquiera ha sido programado ni probado.'
      }
    },
    {
      id: 'testeo',
      order: 5,
      title: 'Pruebas y QA (Testeo)',
      subtitle: 'Verificación, detección de bugs y aseguramiento de calidad',
      icon: '🧪',
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      glowColor: 'rgba(236, 72, 153, 0.45)',
      tags: ['🐞 Caza de Bugs', '🛡️ Seguridad', '⚡ Pruebas Unitarias'],
      summary: 'El equipo de Control de Calidad (QA) somete el software a pruebas unitarias, de integración, rendimiento y seguridad para garantizar que funcione sin fallos antes de llegar al usuario.',
      correctFeedback: '¡Excelente decisión! Las Pruebas y QA protegen la reputación del proyecto. Detectan fallos antes de que lleguen a los clientes reales, asegurando que el software sea robusto, rápido y seguro.',
      nextHint: '¡Todo el código pasó las pruebas con 100% de éxito y sin fallos! Solo queda un paso: llevar el software a los servidores de producción y monitorear su funcionamiento continuo. ¿Cuál es la fase final?',
      whyNotHereIfExpected: {
        planificacion: 'La Planificación ya está completada.',
        analisis: 'El Análisis ya está completado.',
        diseno: 'El Diseño ya está completado.',
        implementacion: 'La Implementación ya está completada.',
        despliegue: '¡Riesgo crítico! Lanzar software a producción sin pasar por Pruebas expone a la empresa a caídas del sistema, robo de datos y frustración de los usuarios.'
      }
    },
    {
      id: 'despliegue',
      order: 6,
      title: 'Despliegue y Mantenimiento',
      subtitle: 'Puesta en producción, soporte y evolución continua',
      icon: '🚀',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      glowColor: 'rgba(16, 185, 129, 0.45)',
      tags: ['☁️ Servidores Cloud', '🐳 CI/CD & Docker', '🔄 Actualizaciones'],
      summary: 'El software se despliega en los servidores reales de producción a través de pipelines de CI/CD, y entra en ciclo de monitoreo, soporte técnico y actualizaciones continuas.',
      correctFeedback: '¡Completaste la Rueda del SDLC! El Despliegue y Mantenimiento lleva el producto a las manos de los usuarios reales. Y recuerda: en la ingeniería moderna, el mantenimiento reinicia el ciclo con nuevas mejoras.',
      nextHint: '¡Felicitaciones! Has completado las 6 fases del ciclo de vida del software con éxito.',
      whyNotHereIfExpected: {
        planificacion: 'El Despliegue es la última fase, cuando el software ya existe y funciona.',
        analisis: 'No puedes desplegar sin haber completado las fases intermedias de diseño, desarrollo y pruebas.',
        diseno: 'El diseño es solo un plano; el despliegue requiere software real y probado.',
        implementacion: 'No se puede desplegar sin antes haber implementado y testeado el sistema.',
        testeo: '¡Cuidado! Primero se debe verificar la calidad antes de cualquier lanzamiento a producción.'
      }
    }
  ];

  // =========================================================================
  // Motor del Juego: SDLCWheelGame
  // =========================================================================
  class SDLCWheelGame {
    constructor() {
      this.currentPhaseIndex = 0; // 0 a 5
      this.placedPhases = []; // array de IDs colocados
      this.attemptsCount = 0;
      this.mistakesCount = 0;
      this.isCompleted = false;

      // Elementos del DOM
      this.dom = {
        stage: document.getElementById('sdlc-game-stage'),
        wheelSvg: document.getElementById('sdlc-wheel-svg'),
        wheelContainer: document.getElementById('sdlc-wheel-container'),
        hubCenterTitle: document.getElementById('sdlc-hub-title'),
        hubCenterSubtitle: document.getElementById('sdlc-hub-subtitle'),
        hubCenterProgress: document.getElementById('sdlc-hub-progress'),
        hubProgressRing: document.getElementById('sdlc-progress-ring'),
        cardsRack: document.getElementById('sdlc-cards-rack'),
        mentorSpeech: document.getElementById('sdlc-mentor-speech'),
        mentorAvatar: document.getElementById('sdlc-mentor-avatar'),
        mentorStatusBadge: document.getElementById('sdlc-mentor-badge'),
        btnHint: document.getElementById('btn-sdlc-hint'),
        btnReset: document.getElementById('btn-sdlc-reset'),
        btnGuide: document.getElementById('btn-sdlc-guide'),
        btnBackCatalog: document.getElementById('btn-sdlc-back-catalog'),
        modalGuide: document.getElementById('modal-sdlc-guide'),
        btnCloseGuide: document.getElementById('btn-close-sdlc-guide'),
        btnGotitGuide: document.getElementById('btn-gotit-sdlc-guide'),
        modalVictory: document.getElementById('modal-sdlc-victory'),
        btnVictoryReplay: document.getElementById('btn-victory-sdlc-replay'),
        btnVictoryCatalog: document.getElementById('btn-victory-sdlc-catalog'),
        victorySummaryList: document.getElementById('sdlc-victory-summary-list'),
        confettiCanvas: document.getElementById('confetti-canvas')
      };

      this.init();
    }

    init() {
      this.buildWheelSvg();
      this.renderPhaseCards();
      this.setupEventListeners();
      this.updateMentorInitialGreeting();
      this.updateHubCenterState();
    }

    // =======================================================================
    // Generación del SVG de la Rueda Circular de 6 Fases
    // =======================================================================
    buildWheelSvg() {
      if (!this.dom.wheelSvg) return;
      this.dom.wheelSvg.innerHTML = '';

      const cx = 200;
      const cy = 200;
      const rOuter = 180;
      const rInner = 110;
      const numSegments = 6;
      const angleStep = 360 / numSegments; // 60 grados por sector

      // Creamos contenedor defs para filtros y gradientes
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

      // Filtro de resplandor neón
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.setAttribute('id', 'sdlc-neon-glow');
      filter.setAttribute('x', '-20%');
      filter.setAttribute('y', '-20%');
      filter.setAttribute('width', '140%');
      filter.setAttribute('height', '140%');
      filter.innerHTML = `
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      `;
      defs.appendChild(filter);

      // Gradientes para cada fase
      SDLC_PHASES.forEach((p, idx) => {
        const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        grad.setAttribute('id', `grad-phase-${p.id}`);
        grad.setAttribute('x1', '0%');
        grad.setAttribute('y1', '0%');
        grad.setAttribute('x2', '100%');
        grad.setAttribute('y2', '100%');

        if (p.id === 'planificacion') {
          grad.innerHTML = `<stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#d97706"/>`;
        } else if (p.id === 'analisis') {
          grad.innerHTML = `<stop offset="0%" stop-color="#22d3ee"/><stop offset="100%" stop-color="#0891b2"/>`;
        } else if (p.id === 'diseno') {
          grad.innerHTML = `<stop offset="0%" stop-color="#c084fc"/><stop offset="100%" stop-color="#7d3c9e"/>`;
        } else if (p.id === 'implementacion') {
          grad.innerHTML = `<stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#2563eb"/>`;
        } else if (p.id === 'testeo') {
          grad.innerHTML = `<stop offset="0%" stop-color="#f472b6"/><stop offset="100%" stop-color="#db2777"/>`;
        } else if (p.id === 'despliegue') {
          grad.innerHTML = `<stop offset="0%" stop-color="#34d399"/><stop offset="100%" stop-color="#059669"/>`;
        }
        defs.appendChild(grad);
      });

      this.dom.wheelSvg.appendChild(defs);

      // Grupo para los 6 sectores
      const sectorsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      sectorsGroup.setAttribute('id', 'sdlc-sectors-group');

      for (let i = 0; i < numSegments; i++) {
        const startAngle = i * angleStep - 90; // Empezamos en las 12 en punto (-90 deg)
        const endAngle = (i + 1) * angleStep - 90;
        const phaseData = SDLC_PHASES[i];

        // Crear sector vacío / placeholder
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const pathData = this.describeArc(cx, cy, rInner, rOuter, startAngle, endAngle);
        path.setAttribute('d', pathData);
        path.setAttribute('class', `sdlc-sector-slice slot-empty ${i === 0 ? 'slot-current-target' : ''}`);
        path.setAttribute('id', `sdlc-sector-${i}`);
        path.setAttribute('data-slot-index', i);
        path.setAttribute('data-phase-id', phaseData.id);

        sectorsGroup.appendChild(path);

        // Grupo de etiqueta (Número, Icono y Texto) en el centroide del arco
        const midAngle = (startAngle + endAngle) / 2;
        const midRadius = (rInner + rOuter) / 2;
        const rad = (midAngle * Math.PI) / 180;
        const labelX = cx + midRadius * Math.cos(rad);
        const labelY = cy + midRadius * Math.sin(rad);

        const labelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        labelGroup.setAttribute('class', 'sdlc-sector-label hidden');
        labelGroup.setAttribute('id', `sdlc-label-${i}`);
        labelGroup.setAttribute('transform', `translate(${labelX}, ${labelY})`);

        // Círculo de fondo para el icono
        const iconBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        iconBg.setAttribute('r', '18');
        iconBg.setAttribute('fill', 'rgba(255, 255, 255, 0.95)');
        iconBg.setAttribute('filter', 'drop-shadow(0 2px 5px rgba(0,0,0,0.2))');

        // Texto con el icono
        const iconText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        iconText.setAttribute('text-anchor', 'middle');
        iconText.setAttribute('dominant-baseline', 'central');
        iconText.setAttribute('font-size', '16');
        iconText.textContent = phaseData.icon;

        // Píldora de número ordinal (1 a 6)
        const numBadge = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        numBadge.setAttribute('cx', '12');
        numBadge.setAttribute('cy', '-12');
        numBadge.setAttribute('r', '8');
        numBadge.setAttribute('fill', phaseData.color);

        const numText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        numText.setAttribute('x', '12');
        numText.setAttribute('y', '-12');
        numText.setAttribute('text-anchor', 'middle');
        numText.setAttribute('dominant-baseline', 'central');
        numText.setAttribute('font-size', '9');
        numText.setAttribute('font-weight', '900');
        numText.setAttribute('fill', '#ffffff');
        numText.textContent = phaseData.order;

        labelGroup.appendChild(iconBg);
        labelGroup.appendChild(iconText);
        labelGroup.appendChild(numBadge);
        labelGroup.appendChild(numText);

        sectorsGroup.appendChild(labelGroup);
      }

      this.dom.wheelSvg.appendChild(sectorsGroup);

      // Círculo central decorativo detrás del pod HTML
      const centerBackdrop = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      centerBackdrop.setAttribute('cx', cx);
      centerBackdrop.setAttribute('cy', cy);
      centerBackdrop.setAttribute('r', rInner - 4);
      centerBackdrop.setAttribute('fill', 'rgba(255, 255, 255, 0.98)');
      centerBackdrop.setAttribute('stroke', 'rgba(125, 60, 158, 0.25)');
      centerBackdrop.setAttribute('stroke-width', '2');
      this.dom.wheelSvg.appendChild(centerBackdrop);
    }

    // Calcula el path SVG para un arco tipo donut (entre dos ángulos y dos radios)
    describeArc(x, y, innerRadius, outerRadius, startAngle, endAngle) {
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const deltaAngle = endAngle - startAngle;
      const largeArc = deltaAngle > 180 ? 1 : 0;

      const x1 = x + outerRadius * Math.cos(startRad);
      const y1 = y + outerRadius * Math.sin(startRad);
      const x2 = x + outerRadius * Math.cos(endRad);
      const y2 = y + outerRadius * Math.sin(endRad);

      const x3 = x + innerRadius * Math.cos(endRad);
      const y3 = y + innerRadius * Math.sin(endRad);
      const x4 = x + innerRadius * Math.cos(startRad);
      const y4 = y + innerRadius * Math.sin(startRad);

      return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
    }

    // =======================================================================
    // Renderizado de las Tarjetas de Fases Abajo (Orden Mezclado)
    // =======================================================================
    renderPhaseCards() {
      if (!this.dom.cardsRack) return;
      this.dom.cardsRack.innerHTML = '';

      // Barajamos las tarjetas para que el estudiante deba pensar e identificar el orden correcto
      const shuffledPhases = [...SDLC_PHASES].sort(() => Math.random() - 0.5);

      shuffledPhases.forEach(phase => {
        const card = document.createElement('div');
        card.className = 'sdlc-phase-card';
        card.id = `card-sdlc-${phase.id}`;
        card.setAttribute('data-phase-id', phase.id);
        card.setAttribute('draggable', 'true');
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Fase de software: ${phase.title}`);

        const tagsHtml = phase.tags.map(t => `<span class="phase-tag-mini">${t}</span>`).join('');

        card.innerHTML = `
          <div class="phase-card-top">
            <span class="phase-card-icon" style="background: ${phase.glowColor}">${phase.icon}</span>
            <div class="phase-card-titles">
              <h3 class="phase-card-name">${phase.title}</h3>
              <p class="phase-card-subtitle">${phase.subtitle}</p>
            </div>
            <span class="phase-card-check" id="check-${phase.id}">✓</span>
          </div>
          <div class="phase-card-tags">
            ${tagsHtml}
          </div>
          <p class="phase-card-desc">${phase.summary}</p>
          <div class="phase-card-action">
            <span class="action-prompt-text">▶ Colocar en la rueda</span>
          </div>
        `;

        // Evento de clic
        card.addEventListener('click', () => this.handleCardSelect(phase.id));

        // Drag & Drop
        card.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', phase.id);
          card.classList.add('dragging');
        });

        card.addEventListener('dragend', () => {
          card.classList.remove('dragging');
        });

        this.dom.cardsRack.appendChild(card);
      });

      // Configurar receptor de Drag & Drop sobre la rueda
      if (this.dom.wheelContainer) {
        this.dom.wheelContainer.addEventListener('dragover', (e) => {
          e.preventDefault();
          this.dom.wheelContainer.classList.add('drag-hover');
        });

        this.dom.wheelContainer.addEventListener('dragleave', () => {
          this.dom.wheelContainer.classList.remove('drag-hover');
        });

        this.dom.wheelContainer.addEventListener('drop', (e) => {
          e.preventDefault();
          this.dom.wheelContainer.classList.remove('drag-hover');
          const phaseId = e.dataTransfer.getData('text/plain');
          if (phaseId) {
            this.handleCardSelect(phaseId);
          }
        });
      }
    }

    // =======================================================================
    // Lógica Central: Selección de Tarjeta y Validación Pedagógica
    // =======================================================================
    handleCardSelect(selectedPhaseId) {
      if (this.isCompleted) return;

      // Si ya está colocada, no hacemos nada
      if (this.placedPhases.includes(selectedPhaseId)) {
        this.playSoftBoop();
        this.showMentorFeedback(
          'info',
          'ℹ️ Esta fase ya está colocada',
          'Esta fase ya forma parte de la rueda del ciclo de vida. Revisa las demás tarjetas disponibles para continuar.'
        );
        return;
      }

      this.attemptsCount++;
      const currentExpectedPhase = SDLC_PHASES[this.currentPhaseIndex];
      const selectedCardElement = document.getElementById(`card-sdlc-${selectedPhaseId}`);

      // CASO 1: SELECCIÓN CORRECTA
      if (selectedPhaseId === currentExpectedPhase.id) {
        this.handleCorrectSelection(currentExpectedPhase, selectedCardElement);
      }
      // CASO 2: SELECCIÓN INCORRECTA (Dar retroalimentación pedagógica y pistas)
      else {
        this.handleIncorrectSelection(selectedPhaseId, currentExpectedPhase, selectedCardElement);
      }
    }

    handleCorrectSelection(phase, cardEl) {
      this.playSuccessChime();
      this.placedPhases.push(phase.id);

      // 1. Activar sector en la rueda SVG
      const slotIndex = this.currentPhaseIndex;
      const sectorPath = document.getElementById(`sdlc-sector-${slotIndex}`);
      const labelGroup = document.getElementById(`sdlc-label-${slotIndex}`);

      if (sectorPath) {
        sectorPath.setAttribute('class', 'sdlc-sector-slice slot-placed');
        sectorPath.setAttribute('fill', `url(#grad-phase-${phase.id})`);
        sectorPath.style.stroke = phase.color;
      }

      if (labelGroup) {
        labelGroup.classList.remove('hidden');
      }

      // 2. Marcar tarjeta como completada
      if (cardEl) {
        cardEl.classList.add('placed');
        cardEl.classList.remove('shake-error');
        const checkEl = document.getElementById(`check-${phase.id}`);
        if (checkEl) checkEl.classList.add('visible');
      }

      // 3. Avanzar índice
      this.currentPhaseIndex++;

      // 4. Actualizar sector objetivo en la rueda
      document.querySelectorAll('.sdlc-sector-slice').forEach(s => s.classList.remove('slot-current-target'));
      if (this.currentPhaseIndex < SDLC_PHASES.length) {
        const nextSector = document.getElementById(`sdlc-sector-${this.currentPhaseIndex}`);
        if (nextSector) nextSector.classList.add('slot-current-target');
      }

      // 5. Actualizar Pod central
      this.updateHubCenterState();

      // 6. Verificar si se completó el ciclo completo (Victoria)
      if (this.currentPhaseIndex >= SDLC_PHASES.length) {
        this.handleGameVictory();
      } else {
        // Mostrar retroalimentación positiva y pista orientadora hacia la siguiente
        const nextPhase = SDLC_PHASES[this.currentPhaseIndex];
        this.showMentorFeedback(
          'success',
          `🎉 ¡Excelente! ${phase.order}. ${phase.title} en su lugar`,
          `${phase.correctFeedback}
          <div class="mentor-next-tip-box">
            <strong>💡 Próximo desafío:</strong> ${phase.nextHint}
          </div>`
        );
      }
    }

    handleIncorrectSelection(wrongPhaseId, expectedPhase, cardEl) {
      this.mistakesCount++;
      this.playErrorBoop();

      // Animación de temblor en la tarjeta incorrecta
      if (cardEl) {
        cardEl.classList.remove('shake-error');
        // Force reflow
        void cardEl.offsetWidth;
        cardEl.classList.add('shake-error');
      }

      // Obtener explicación pedagógica específica
      const wrongPhaseData = SDLC_PHASES.find(p => p.id === wrongPhaseId);
      let explanation = '';

      if (expectedPhase.whyNotHereIfExpected && expectedPhase.whyNotHereIfExpected[wrongPhaseId]) {
        explanation = expectedPhase.whyNotHereIfExpected[wrongPhaseId];
      } else {
        explanation = `Aún no es momento para <strong>${wrongPhaseData.title}</strong>. El desarrollo de software sigue un orden estructurado para evitar construir cosas incorrectas.`;
      }

      const hintText = this.getPhaseHint(expectedPhase);

      this.showMentorFeedback(
        'error',
        `❌ ¿${wrongPhaseData.title} ahora? No todavía`,
        `<p>${explanation}</p>
        <div class="mentor-hint-box">
          <span class="hint-lamp">💡</span> <strong>Pista para la Fase ${expectedPhase.order}:</strong> ${hintText}
        </div>`
      );

      // Centrar suavemente en el panel del tutor arriba para que el estudiante lea el error y la pista
      const mentorCard = document.getElementById('sdlc-mentor-card') || document.querySelector('.sdlc-mentor-card') || this.dom.mentorSpeech;
      if (mentorCard) {
        mentorCard.classList.remove('card-error-pulse');
        void mentorCard.offsetWidth;
        mentorCard.classList.add('card-error-pulse');
        mentorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    getPhaseHint(phase) {
      switch (phase.id) {
        case 'planificacion':
          return 'Todo software nace con una visión: buscamos la fase donde se define el objetivo del negocio, presupuesto y plazos. ¿Cuál es?';
        case 'analisis':
          return 'Ya tenemos el plan aprobado. Ahora debemos investigar y entrevistar a los usuarios para redactar las especificaciones funcionales exactas.';
        case 'diseno':
          return 'Antes de escribir código necesitamos los "planos" arquitectónicos: diagramas de base de datos y prototipos visuales UI/UX.';
        case 'implementacion':
          return '¡Llegó la hora de los ingenieros! Buscamos la fase donde se encienden los editores de código y se programan los algoritmos.';
        case 'testeo':
          return 'El código ya está programado, pero antes de lanzarlo al público debemos cazar bugs y verificar que todo funcione sin caídas.';
        case 'despliegue':
          return '¡El software fue probado y aprobado! Es momento de subirlo a servidores de producción, crear contenedores y dar soporte continuo.';
        default:
          return 'Revisa cuál es el orden lógico desde la idea inicial hasta el mantenimiento final.';
      }
    }

    // =======================================================================
    // Feedback del Mentor (NaviBot)
    // =======================================================================
    showMentorFeedback(type, title, htmlContent) {
      if (!this.dom.mentorSpeech) return;

      let badgeIcon = '💡';
      let badgeLabel = 'TUTOR SDLC';

      if (type === 'success') {
        badgeIcon = '✨';
        badgeLabel = '¡PASO CORRECTO!';
      } else if (type === 'error') {
        badgeIcon = '⚠️';
        badgeLabel = '¡ALERTA PEDAGÓGICA!';
      } else if (type === 'hint') {
        badgeIcon = '🔍';
        badgeLabel = 'PISTA INTELIGENTE';
      }

      if (this.dom.mentorStatusBadge) {
        this.dom.mentorStatusBadge.className = `sdlc-mentor-badge badge-${type}`;
        this.dom.mentorStatusBadge.innerHTML = `<span>${badgeIcon}</span> ${badgeLabel}`;
      }

      this.dom.mentorSpeech.innerHTML = `
        <h4 class="mentor-title text-${type}">${title}</h4>
        <div class="mentor-text-body">${htmlContent}</div>
      `;

      // Animar entrada del mensaje
      this.dom.mentorSpeech.classList.remove('speech-pop');
      void this.dom.mentorSpeech.offsetWidth;
      this.dom.mentorSpeech.classList.add('speech-pop');
    }

    updateMentorInitialGreeting() {
      this.showMentorFeedback(
        'info',
        '👨‍💻 ¡Bienvenido a la Rueda del Ciclo de Vida del Software (SDLC)!',
        `<p>El software no se programa al azar: sigue un ciclo de ingeniería probado por la industria para garantizar calidad y éxito.</p>
        <div class="mentor-initial-tip">
          <strong>🎯 Tu Misión:</strong> Selecciona de las tarjetas de abajo la primera fase del ciclo para colocarla en la posición <strong>1 de la rueda</strong>. ¡Lee las descripciones y deduce el orden correcto!
        </div>`
      );
    }

    // =======================================================================
    // Estado del Pod Central de la Rueda
    // =======================================================================
    updateHubCenterState() {
      const total = SDLC_PHASES.length;
      const count = this.placedPhases.length;

      if (this.dom.hubCenterProgress) {
        this.dom.hubCenterProgress.textContent = `${count}/${total}`;
      }

      if (this.dom.hubCenterTitle) {
        if (count === 0) {
          this.dom.hubCenterTitle.textContent = 'SDLC';
        } else if (count === total) {
          this.dom.hubCenterTitle.textContent = '¡COMPLETO!';
        } else {
          this.dom.hubCenterTitle.textContent = `${count} de ${total}`;
        }
      }

      if (this.dom.hubCenterSubtitle) {
        if (count >= total) {
          this.dom.hubCenterSubtitle.textContent = 'Ciclo Continuo';
        } else {
          const next = SDLC_PHASES[this.currentPhaseIndex];
          this.dom.hubCenterSubtitle.textContent = `Buscando: ${next ? next.title : ''}`;
        }
      }

      // Animar trazo del anillo SVG central
      if (this.dom.hubProgressRing) {
        const circumference = 2 * Math.PI * 45; // radio 45
        const offset = circumference - (count / total) * circumference;
        this.dom.hubProgressRing.style.strokeDashoffset = offset;
      }
    }

    // =======================================================================
    // Victoria del Juego y Graduación
    // =======================================================================
    handleGameVictory() {
      this.isCompleted = true;
      this.playVictoryFanfare();

      // Animar rueda en modo ciclo infinito
      if (this.dom.wheelContainer) {
        this.dom.wheelContainer.classList.add('wheel-cycle-active');
      }

      // Lanzar partículas de confeti
      this.triggerConfetti();

      this.showMentorFeedback(
        'success',
        '🏆 ¡CICLO COMPLETO! Eres un Arquitecto de Software',
        `<p>Has ordenado con éxito las 6 fases fundamentales del Ciclo de Vida del Software: <strong>Planificación ➔ Análisis ➔ Diseño ➔ Implementación ➔ Pruebas ➔ Despliegue</strong>.</p>
        <p>En metodologías modernas como <em>DevOps</em> y <em>Agile</em>, este ciclo nunca se detiene: el mantenimiento y la retroalimentación de los usuarios generan nuevas planificaciones para seguir evolucionando el software.</p>`
      );

      // Llenar resumen en modal de victoria
      if (this.dom.victorySummaryList) {
        this.dom.victorySummaryList.innerHTML = SDLC_PHASES.map(p => `
          <div class="summary-step-item" style="border-left-color: ${p.color}">
            <div class="step-badge" style="background: ${p.color}">${p.order}</div>
            <div class="step-info">
              <strong>${p.icon} ${p.title}</strong>
              <p>${p.summary}</p>
            </div>
          </div>
        `).join('');
      }

      // Mostrar modal de victoria tras breve pausa
      setTimeout(() => {
        if (this.dom.modalVictory) {
          this.dom.modalVictory.classList.add('active');
        }
      }, 1200);
    }

    triggerConfetti() {
      if (window.confettiSystem && typeof window.confettiSystem.burst === 'function') {
        window.confettiSystem.burst();
      } else if (this.dom.confettiCanvas) {
        // Fallback rápido si el sistema de confeti está disponible globalmente
        const ctx = this.dom.confettiCanvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, this.dom.confettiCanvas.width, this.dom.confettiCanvas.height);
        }
      }
    }

    // =======================================================================
    // Reiniciar Juego
    // =======================================================================
    resetGame() {
      this.currentPhaseIndex = 0;
      this.placedPhases = [];
      this.attemptsCount = 0;
      this.mistakesCount = 0;
      this.isCompleted = false;

      if (this.dom.wheelContainer) {
        this.dom.wheelContainer.classList.remove('wheel-cycle-active');
      }

      if (this.dom.modalVictory) {
        this.dom.modalVictory.classList.remove('active');
      }

      this.buildWheelSvg();
      this.renderPhaseCards();
      this.updateMentorInitialGreeting();
      this.updateHubCenterState();
      this.playClickSound();
    }

    // =======================================================================
    // Sistema de Pista a Petición
    // =======================================================================
    requestHint() {
      if (this.isCompleted) return;
      const expectedPhase = SDLC_PHASES[this.currentPhaseIndex];
      const hint = this.getPhaseHint(expectedPhase);

      this.playSoftBoop();
      this.showMentorFeedback(
        'hint',
        `💡 Pista para la Fase ${expectedPhase.order}:`,
        `<p>${hint}</p>
        <p class="hint-subtext">Busca en las tarjetas de abajo la que coincida con esta etapa del desarrollo.</p>`
      );

      const mentorCard = document.getElementById('sdlc-mentor-card') || document.querySelector('.sdlc-mentor-card') || this.dom.mentorSpeech;
      if (mentorCard) {
        mentorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // =======================================================================
    // Eventos y Controles
    // =======================================================================
    setupEventListeners() {
      // Botón Pista
      if (this.dom.btnHint) {
        this.dom.btnHint.addEventListener('click', () => this.requestHint());
      }

      // Botón Reiniciar
      if (this.dom.btnReset) {
        this.dom.btnReset.addEventListener('click', () => this.resetGame());
      }

      // Botón Guía Teórica
      if (this.dom.btnGuide) {
        this.dom.btnGuide.addEventListener('click', () => {
          this.playClickSound();
          if (this.dom.modalGuide) this.dom.modalGuide.classList.add('active');
        });
      }

      if (this.dom.btnCloseGuide) {
        this.dom.btnCloseGuide.addEventListener('click', () => {
          this.playClickSound();
          if (this.dom.modalGuide) this.dom.modalGuide.classList.remove('active');
        });
      }

      if (this.dom.btnGotitGuide) {
        this.dom.btnGotitGuide.addEventListener('click', () => {
          this.playClickSound();
          if (this.dom.modalGuide) this.dom.modalGuide.classList.remove('active');
        });
      }

      // Botones de Victoria
      if (this.dom.btnVictoryReplay) {
        this.dom.btnVictoryReplay.addEventListener('click', () => this.resetGame());
      }

      if (this.dom.btnVictoryCatalog) {
        this.dom.btnVictoryCatalog.addEventListener('click', () => {
          if (this.dom.modalVictory) this.dom.modalVictory.classList.remove('active');
          if (window.ditApp && typeof window.ditApp.navigateToHub === 'function') {
            window.ditApp.navigateToHub();
          } else {
            window.location.href = '/';
          }
        });
      }

      // Volver al Catálogo desde el escenario SDLC
      if (this.dom.btnBackCatalog) {
        this.dom.btnBackCatalog.addEventListener('click', (e) => {
          e.preventDefault();
          if (window.ditApp && typeof window.ditApp.navigateToHub === 'function') {
            window.ditApp.navigateToHub();
          } else {
            window.location.href = '/';
          }
        });
      }
    }

    // =======================================================================
    // Sintetizador de Audio Web Audio API
    // =======================================================================
    getAudioContext() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    }

    playClickSound() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    }

    playSuccessChime() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.25);
      });
    }

    playErrorBoop() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    }

    playSoftBoop() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(330, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    }

    playVictoryFanfare() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const chords = [
        { f: 523.25, t: 0.00, d: 0.15 },
        { f: 659.25, t: 0.15, d: 0.15 },
        { f: 783.99, t: 0.30, d: 0.20 },
        { f: 1046.50, t: 0.50, d: 0.50 }
      ];
      chords.forEach(c => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(c.f, ctx.currentTime + c.t);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + c.t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + c.t + c.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + c.t);
        osc.stop(ctx.currentTime + c.t + c.d);
      });
    }
  }

  // Instanciar y exponer globalmente cuando el DOM esté listo
  window.addEventListener('DOMContentLoaded', () => {
    window.sdlcGame = new SDLCWheelGame();
  });

})();
