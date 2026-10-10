/**
 * DIT - Conecta Tablas | Fundamentos de Base de Datos Relacional
 * Lógica del minijuego 2D: arrastrar y soltar, conexión por toque, validación pedagógica,
 * síntesis de audio Web Audio API, efectos visuales SVG y partículas de confeti.
 */

(() => {
  'use strict';

  // =========================================================================
  // Datos y Niveles Educativos
  // =========================================================================
  const LEVELS = [
    {
      levelId: 1,
      name: 'Nivel 1: Clientes y Pedidos',
      missionText: '<strong>Misión:</strong> Une el <span class="badge-mini-gold">🔑 ID Cliente</span> con su <span class="badge-mini-purple">🔗 ID Cliente</span> en la tabla Pedidos.',
      tableLeft: {
        id: 'clientes',
        title: 'Tabla Clientes',
        subtitle: 'Datos de las personas que compran.',
        roleBadge: 'Tabla Principal',
        headerClass: 'header-clientes',
        fields: [
          { name: 'id_cliente', typeTag: '(Número)', isPk: true, role: 'pk', badge: 'ID Principal' },
          { name: 'nombre', typeTag: '(Texto)', isPk: false, role: 'data' },
          { name: 'email', typeTag: '(Texto)', isPk: false, role: 'data' }
        ],
        recordsHeader: ['id_cliente', 'nombre', 'email'],
        records: [
          { pk: 1, col1: '1', col2: 'Ana García', col3: 'ana@ejemplo.com' },
          { pk: 2, col1: '2', col2: 'Carlos Ruiz', col3: 'carlos@ejemplo.com' },
          { pk: 3, col1: '3', col2: 'Elena Vega', col3: 'elena@ejemplo.com' }
        ]
      },
      tableRight: {
        id: 'pedidos',
        title: 'Tabla Pedidos',
        subtitle: 'Compras hechas por los clientes.',
        roleBadge: 'Tabla Enlazada',
        headerClass: 'header-pedidos',
        fields: [
          { name: 'id_pedido', typeTag: '(Número)', isOwnPk: true, role: 'own_pk', badge: 'ID' },
          { name: 'id_cliente', typeTag: '(Número)', isFk: true, role: 'fk', badge: 'ID Enlace' },
          { name: 'fecha', typeTag: '(Fecha)', isFk: false, role: 'data' },
          { name: 'total', typeTag: '(Precio)', isFk: false, role: 'data' }
        ],
        recordsHeader: ['id_pedido', 'id_cliente', 'fecha', 'total'],
        records: [
          { fk: 1, col1: '101', col2: '1', col3: '2026-03-01', col4: '$140.00' },
          { fk: 2, col1: '102', col2: '2', col3: '2026-03-02', col4: '$85.50' },
          { fk: 1, col1: '103', col2: '1', col3: '2026-03-04', col4: '$210.00' }
        ]
      },
      correctPair: { left: 'id_cliente', right: 'id_cliente' },
      explanation: {
        headline: '¡Excelente conexión lograda!',
        desc: 'Conectaste el ID del Cliente con su Pedido: así el sistema sabe de quién es cada compra sin repetir nombres.',
        subtip: '💡 Un cliente puede tener varios pedidos enlazados por su mismo ID.'
      }
    },
    {
      levelId: 2,
      name: 'Nivel 2: Productos y Detalles',
      missionText: '<strong>Misión:</strong> Une el <span class="badge-mini-gold">🔑 ID Producto</span> con su <span class="badge-mini-purple">🔗 ID Producto</span> en Detalle Pedidos.',
      tableLeft: {
        id: 'productos',
        title: 'Tabla Productos',
        subtitle: 'Catálogo de artículos en almacén.',
        roleBadge: 'Tabla Principal',
        headerClass: 'header-clientes',
        fields: [
          { name: 'id_producto', typeTag: '(Número)', isPk: true, role: 'pk', badge: 'ID Principal' },
          { name: 'nombre_prod', typeTag: '(Texto)', isPk: false, role: 'data' },
          { name: 'precio_unit', typeTag: '(Precio)', isPk: false, role: 'data' }
        ],
        recordsHeader: ['id_producto', 'nombre_prod', 'precio_unit'],
        records: [
          { pk: 10, col1: '10', col2: 'Laptop Gamer DIT', col3: '$1,200.00' },
          { pk: 20, col1: '20', col2: 'Mouse Inalámbrico', col3: '$25.00' },
          { pk: 30, col1: '30', col2: 'Monitor UltraWide', col3: '$350.00' }
        ]
      },
      tableRight: {
        id: 'detalle_pedidos',
        title: 'Tabla Detalle Pedidos',
        subtitle: 'Líneas de productos comprados en cada orden.',
        roleBadge: 'Tabla Enlazada',
        headerClass: 'header-pedidos',
        fields: [
          { name: 'id_detalle', typeTag: '(Número)', isOwnPk: true, role: 'own_pk', badge: 'ID' },
          { name: 'id_producto', typeTag: '(Número)', isFk: true, role: 'fk', badge: 'ID Enlace' },
          { name: 'cantidad', typeTag: '(Número)', isFk: false, role: 'data' },
          { name: 'subtotal', typeTag: '(Precio)', isFk: false, role: 'data' }
        ],
        recordsHeader: ['id_detalle', 'id_producto', 'cantidad', 'subtotal'],
        records: [
          { fk: 10, col1: '501', col2: '10', col3: '1', col4: '$1,200.00' },
          { fk: 20, col1: '502', col2: '20', col3: '2', col4: '$50.00' },
          { fk: 10, col1: '503', col2: '10', col3: '1', col4: '$1,200.00' }
        ]
      },
      correctPair: { left: 'id_producto', right: 'id_producto' },
      explanation: {
        headline: '¡Magnífica relación establecida!',
        desc: 'Relacionaste los detalles de venta con el producto original: los precios y descripciones provienen de una única fuente central.',
        subtip: '💡 Si cambia el precio del catálogo, se actualiza automáticamente para futuras compras sin inconsistencias.'
      }
    }
  ];

  // =========================================================================
  // Sistema de Audio Sintetizado (Web Audio API)
  // =========================================================================
  class SoundController {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playGrab() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    }

    playClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    }

    playError() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Tono disonante suave
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(196, now); // G3
      osc2.frequency.setValueAtTime(185, now); // F#3 (disonancia)

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.28);
      osc2.stop(now + 0.28);
    }

    playSuccess() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Arpegio brillante mayor: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
      const notes = [523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + (idx * 0.08);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.35);
      });
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }
  }

  // =========================================================================
  // Confeti de Victoria en Canvas
  // =========================================================================
  class ConfettiSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.animId = null;
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    burst() {
      this.particles = [];
      const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899'];
      const count = 90;

      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: window.innerWidth * 0.5 + (Math.random() * 200 - 100),
          y: window.innerHeight * 0.35,
          vx: (Math.random() - 0.5) * 16,
          vy: Math.random() * -14 - 4,
          size: Math.random() * 8 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 12,
          opacity: 1,
          gravity: 0.38
        });
      }

      if (!this.animId) {
        this.render();
      }
    }

    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.vRot;
        p.opacity -= 0.009;

        if (p.opacity <= 0 || p.y > this.canvas.height) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(() => this.render());
      } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.animId = null;
      }
    }
  }

  // =========================================================================
  // Controlador Principal del Juego
  // =========================================================================
  class GameController {
    constructor() {
      this.currentLevelIdx = 0;
      this.isSolved = false;
      this.isDragging = false;
      this.selectedRow = null; // Para modo click-to-connect

      this.dragOrigin = null; // { table, field, role, element, nodeElem, x, y }
      this.dragCurrent = { x: 0, y: 0 };

      // Componentes auxiliares
      this.sound = new SoundController();
      this.confetti = new ConfettiSystem(document.getElementById('confetti-canvas'));

      // Elementos DOM
      this.dom = {
        stage: document.getElementById('game-stage'),
        svg: document.getElementById('connection-svg'),
        activeDragCable: document.getElementById('active-drag-cable'),
        connectedCable: document.getElementById('connected-cable'),
        connectedCableGlow: document.getElementById('connected-cable-glow'),
        cableParticles: document.getElementById('cable-particles'),
        centerHub: document.getElementById('center-hub'),
        errorToast: document.getElementById('error-toast'),
        toastTitle: document.getElementById('toast-title'),
        toastMessage: document.getElementById('toast-message'),
        btnCloseToast: document.getElementById('btn-close-toast'),
        bottomSuccessBar: document.getElementById('bottom-success-bar'),
        successHeadline: document.getElementById('success-headline'),
        successDescription: document.getElementById('success-description'),
        successSubtip: document.getElementById('success-subtip'),
        btnReplay: document.getElementById('btn-replay'),
        btnNextLevel: document.getElementById('btn-next-level'),
        modalWelcome: document.getElementById('modal-welcome'),
        btnStart: document.getElementById('btn-start'),
        modalInstructions: document.getElementById('modal-instructions'),
        btnOpenInstructions: document.getElementById('btn-open-instructions'),
        btnCloseInstructions: document.getElementById('btn-close-instructions'),
        btnInstructionsGotit: document.getElementById('btn-instructions-gotit'),
        btnSound: document.getElementById('btn-sound'),
        soundIcon: document.getElementById('sound-icon'),
        btnHelpHeader: document.getElementById('btn-help-header'),
        btnRestartHeader: document.getElementById('btn-restart-header'),
        levelIndicator: document.getElementById('level-indicator'),
        missionBanner: document.getElementById('mission-banner'),
        cardLeft: document.getElementById('card-clientes'),
        cardRight: document.getElementById('card-pedidos')
      };

      this.toastTimeout = null;
      this.particleAnimInterval = null;

      this.init();
    }

    init() {
      this.setupEventListeners();
      this.renderLevel(this.currentLevelIdx);
      window.addEventListener('resize', () => {
        if (this.isSolved) {
          this.drawPermanentConnection();
        }
      });
    }

    // =======================================================================
    // Gestión de Eventos (Arrastre, Clicks, Teclado)
    // =======================================================================
    setupEventListeners() {
      // Modales y HUD
      this.dom.btnStart.addEventListener('click', () => {
        this.sound.playClick();
        this.dom.modalWelcome.classList.remove('active');
      });

      this.dom.btnOpenInstructions.addEventListener('click', () => {
        this.sound.playClick();
        this.dom.modalInstructions.classList.add('active');
      });

      this.dom.btnHelpHeader.addEventListener('click', () => {
        this.sound.playClick();
        this.dom.modalInstructions.classList.add('active');
      });

      this.dom.btnCloseInstructions.addEventListener('click', () => {
        this.sound.playClick();
        this.dom.modalInstructions.classList.remove('active');
      });

      this.dom.btnInstructionsGotit.addEventListener('click', () => {
        this.sound.playClick();
        this.dom.modalInstructions.classList.remove('active');
        this.dom.modalWelcome.classList.remove('active');
      });

      this.dom.btnSound.addEventListener('click', () => {
        const enabled = this.sound.toggle();
        this.dom.soundIcon.textContent = enabled ? '🔊' : '🔇';
      });

      this.dom.btnRestartHeader.addEventListener('click', () => {
        this.sound.playClick();
        this.resetConnection();
      });

      this.dom.btnReplay.addEventListener('click', () => {
        this.sound.playClick();
        this.resetConnection();
      });

      this.dom.btnNextLevel.addEventListener('click', () => {
        this.sound.playClick();
        this.nextLevel();
      });

      this.dom.btnCloseToast.addEventListener('click', () => {
        this.hideToast();
      });

      // Eventos globales de arrastre de puntero
      window.addEventListener('mousemove', (e) => this.onPointerMove(e.clientX, e.clientY));
      window.addEventListener('mouseup', (e) => this.onPointerUp(e.clientX, e.clientY));

      window.addEventListener('touchmove', (e) => {
        if (!this.isDragging) return;
        const touch = e.touches[0];
        if (touch) {
          this.onPointerMove(touch.clientX, touch.clientY);
          e.preventDefault();
        }
      }, { passive: false });

      window.addEventListener('touchend', (e) => {
        if (!this.isDragging) return;
        const touch = e.changedTouches[0];
        if (touch) {
          this.onPointerUp(touch.clientX, touch.clientY);
        }
      });
    }

    // =======================================================================
    // Renderizado y Preparación del Nivel
    // =======================================================================
    renderLevel(levelIdx) {
      this.isSolved = false;
      this.currentLevelIdx = levelIdx;
      const data = LEVELS[levelIdx];

      this.dom.levelIndicator.textContent = data.name;
      this.dom.missionBanner.innerHTML = `<span class="mission-sparkle">✨</span><span class="mission-text">${data.missionText}</span>`;

      // Render Tabla Izquierda
      document.getElementById('title-table-left').textContent = data.tableLeft.title;
      document.getElementById('subtitle-table-left').textContent = data.tableLeft.subtitle;
      this.renderTableFields('fields-list-left', data.tableLeft, 'left');
      this.renderTableData('tbody-clientes', data.tableLeft.records, 'left');

      // Render Tabla Derecha
      document.getElementById('title-table-right').textContent = data.tableRight.title;
      document.getElementById('subtitle-table-right').textContent = data.tableRight.subtitle;
      this.renderTableFields('fields-list-right', data.tableRight, 'right');
      this.renderTableData('tbody-pedidos', data.tableRight.records, 'right');

      this.resetConnectionVisuals();
    }

    renderTableFields(containerId, tableData, side) {
      const container = document.getElementById(containerId);
      container.innerHTML = '';

      tableData.fields.forEach(f => {
        const row = document.createElement('div');
        row.className = `field-row ${f.isPk ? 'row-pk' : f.isFk ? 'row-fk' : f.isOwnPk ? 'row-orders-pk' : 'row-regular'}`;
        row.dataset.table = tableData.id;
        row.dataset.field = f.name;
        row.dataset.fieldType = f.role;
        row.tabIndex = 0;
        row.setAttribute('role', 'button');
        row.setAttribute('aria-label', `Campo ${f.name}`);

        const nodeColor = f.isPk ? 'node-gold' : f.isFk ? 'node-purple' : f.isOwnPk ? 'node-gold' : 'node-neutral';
        const nodePosition = side === 'left' ? 'node-right' : 'node-left';

        const nodeHTML = `
          <div class="node-wrapper ${nodePosition}">
            <div class="connection-node ${nodeColor}" id="node-${tableData.id}-${f.name}" data-node-id="${tableData.id}-${f.name}">
              <div class="node-ring"></div>
              <div class="node-dot"></div>
            </div>
          </div>
        `;

        if (side === 'left') {
          let badgeHTML = '<span class="pill-regular-tag">Dato</span>';
          if (f.isPk) {
            badgeHTML = `
              <span class="pill-info-pk">
                <span class="info-icon">ℹ️</span>
                <span class="key-icon">🔑</span>
                <strong>${f.badge || 'ID Principal'}</strong>
              </span>
            `;
          }
          row.innerHTML = `
            <div class="field-left-meta">
              ${badgeHTML}
              <span class="field-name-label">
                <strong class="field-code">${f.name}</strong> <span class="field-type-tag">${f.typeTag}</span>
              </span>
            </div>
            ${nodeHTML}
          `;
        } else {
          let badgeHTML = '';
          if (f.isOwnPk) {
            badgeHTML = `<span class="pill-order-pk">🔑 ID</span>`;
          } else if (f.isFk) {
            badgeHTML = `
              <span class="pill-info-fk">
                <span class="link-chain-icon">🔗</span>
                <strong>${f.badge || 'ID Enlace'}</strong>
              </span>
            `;
          }
          row.innerHTML = `
            ${nodeHTML}
            <div class="field-right-meta">
              <span class="field-name-label">
                <span class="field-type-tag">${f.typeTag}</span> <strong class="field-code">${f.name}</strong>
              </span>
              ${badgeHTML}
            </div>
          `;
        }

        // Eventos en cada fila y su nodo
        this.bindRowEvents(row, tableData.id, f.name, f.role, side);
        container.appendChild(row);
      });
    }

    renderTableData(tbodyId, records, side) {
      const tbody = document.getElementById(tbodyId);
      tbody.innerHTML = '';

      records.forEach(r => {
        const tr = document.createElement('tr');
        tr.className = 'record-row';

        if (side === 'left') {
          tr.dataset.customerId = r.pk;
          tr.title = 'Haz clic para ver registros relacionados';
          tr.innerHTML = `
            <td class="cell-pk"><span class="pk-badge-number">${r.col1}</span></td>
            <td>${r.col2}</td>
            <td class="cell-email">${r.col3}</td>
          `;
        } else {
          tr.dataset.customerRef = r.fk;
          tr.innerHTML = `
            <td>${r.col1}</td>
            <td class="cell-fk"><span class="fk-badge-number">${r.col2}</span></td>
            <td>${r.col3}</td>
            <td class="cell-price">${r.col4}</td>
          `;
        }

        // Interactividad relacional al hacer click o hover
        tr.addEventListener('mouseenter', () => this.highlightRelatedRows(tr));
        tr.addEventListener('mouseleave', () => this.clearRowHighlights());
        tr.addEventListener('click', () => this.highlightRelatedRows(tr, true));

        tbody.appendChild(tr);
      });
    }

    // =======================================================================
    // Conexión Interactiva: Drag & Drop + Click-to-Connect
    // =======================================================================
    bindRowEvents(rowElem, tableId, fieldName, fieldRole, side) {
      const nodeElem = rowElem.querySelector('.connection-node');

      const startInteraction = (clientX, clientY) => {
        if (this.isSolved) return;
        this.sound.playGrab();

        const nodeRect = nodeElem.getBoundingClientRect();
        const stageRect = this.dom.svg.getBoundingClientRect();

        const startX = nodeRect.left + nodeRect.width / 2 - stageRect.left;
        const startY = nodeRect.top + nodeRect.height / 2 - stageRect.top;

        this.isDragging = true;
        this.dragOrigin = {
          table: tableId,
          field: fieldName,
          role: fieldRole,
          side: side,
          element: rowElem,
          nodeElem: nodeElem,
          x: startX,
          y: startY
        };

        this.dragCurrent = {
          x: clientX - stageRect.left,
          y: clientY - stageRect.top
        };

        document.body.classList.add('is-dragging');
        this.updateDragLine();
      };

      // Mousedown / Touchstart en nodo
      nodeElem.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        startInteraction(e.clientX, e.clientY);
      });

      nodeElem.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        const touch = e.touches[0];
        if (touch) startInteraction(touch.clientX, touch.clientY);
      }, { passive: true });

      // Click / Tap en fila completa (Modo 2 de conexión)
      rowElem.addEventListener('click', (e) => {
        if (this.isSolved || this.isDragging) return;
        this.sound.playClick();
        this.handleRowSelection(rowElem, tableId, fieldName, fieldRole, side);
      });

      // Accesibilidad mediante teclado (Enter / Space)
      rowElem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleRowSelection(rowElem, tableId, fieldName, fieldRole, side);
        }
      });
    }

    onPointerMove(clientX, clientY) {
      if (!this.isDragging || !this.dragOrigin) return;

      const stageRect = this.dom.svg.getBoundingClientRect();
      this.dragCurrent = {
        x: clientX - stageRect.left,
        y: clientY - stageRect.top
      };

      this.updateDragLine();
    }

    onPointerUp(clientX, clientY) {
      if (!this.isDragging || !this.dragOrigin) return;

      this.isDragging = false;
      document.body.classList.remove('is-dragging');
      this.dom.activeDragCable.setAttribute('d', '');

      // Detectar elemento bajo el punto soltado
      const targetElement = document.elementFromPoint(clientX, clientY);
      const targetRow = targetElement ? targetElement.closest('.field-row') : null;

      if (targetRow && targetRow !== this.dragOrigin.element) {
        const targetTable = targetRow.dataset.table;
        const targetField = targetRow.dataset.field;
        const targetRole = targetRow.dataset.fieldType;
        const targetSide = targetTable === LEVELS[this.currentLevelIdx].tableLeft.id ? 'left' : 'right';

        this.validateConnection(
          this.dragOrigin,
          { table: targetTable, field: targetField, role: targetRole, side: targetSide, element: targetRow }
        );
      }

      this.dragOrigin = null;
    }

    handleRowSelection(rowElem, tableId, fieldName, fieldRole, side) {
      if (!this.selectedRow) {
        // Primera selección
        this.selectedRow = { table: tableId, field: fieldName, role: fieldRole, side: side, element: rowElem };
        rowElem.classList.add('selected');
      } else {
        // Segunda selección
        if (this.selectedRow.element === rowElem) {
          // Deseleccionar si hace click en la misma fila
          rowElem.classList.remove('selected');
          this.selectedRow = null;
          return;
        }

        const firstSelection = this.selectedRow;
        firstSelection.element.classList.remove('selected');
        this.selectedRow = null;

        this.validateConnection(firstSelection, {
          table: tableId,
          field: fieldName,
          role: fieldRole,
          side: side,
          element: rowElem
        });
      }
    }

    // =======================================================================
    // Cable Dinámico en Curva Bézier
    // =======================================================================
    updateDragLine() {
      if (!this.dragOrigin) return;

      const x1 = this.dragOrigin.x;
      const y1 = this.dragOrigin.y;
      const x2 = this.dragCurrent.x;
      const y2 = this.dragCurrent.y;

      const pathData = this.generateBezierPath(x1, y1, x2, y2);
      this.dom.activeDragCable.setAttribute('d', pathData);
    }

    generateBezierPath(x1, y1, x2, y2) {
      const dx = Math.abs(x2 - x1);
      const controlDist = Math.max(dx * 0.45, 60);

      // Si arrastra de izquierda a derecha
      const cx1 = x1 + (x2 >= x1 ? controlDist : -controlDist);
      const cx2 = x2 - (x2 >= x1 ? controlDist : -controlDist);

      return `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
    }

    // =======================================================================
    // Validación Pedagógica y Mensajes de Feedback
    // =======================================================================
    validateConnection(origin, target) {
      const level = LEVELS[this.currentLevelIdx];

      // Ambos deben pertenecer a tablas opuestas
      if (origin.side === target.side) {
        this.showErrorFeedback(
          'MISMA TABLA',
          'Debes conectar un campo de la tabla izquierda con un campo de la tabla derecha para crear una relación entre ambas.',
          [origin.element, target.element]
        );
        return;
      }

      // Normalizar: identificar cuál es el lado izquierdo y cuál es el derecho
      const leftEnd = origin.side === 'left' ? origin : target;
      const rightEnd = origin.side === 'right' ? origin : target;

      // Caso 1: ¿Es la relación correcta?
      const isCorrect = (
        leftEnd.field === level.correctPair.left &&
        rightEnd.field === level.correctPair.right &&
        leftEnd.role === 'pk' &&
        rightEnd.role === 'fk'
      );

      if (isCorrect) {
        this.onConnectionSuccess(leftEnd, rightEnd);
      } else {
        this.generateIntelligentError(leftEnd, rightEnd);
      }
    }

    generateIntelligentError(leftEnd, rightEnd) {
      let title = 'CONEXIÓN INCORRECTA';
      let message = '';

      const leftField = leftEnd.field;
      const rightField = rightEnd.field;

      if (leftEnd.role === 'data') {
        message = `Estás conectando un campo de datos ("${leftField}") con un ID. Debes conectar el identificador único 🔑 "${LEVELS[this.currentLevelIdx].correctPair.left}" con su enlace 🔗 correspondiente.`;
      } else if (rightEnd.role === 'own_pk') {
        message = `¡Casi! "${rightField}" es la clave primaria de ${LEVELS[this.currentLevelIdx].tableRight.title}, no la del cliente. Busca el campo 🔗 "${LEVELS[this.currentLevelIdx].correctPair.right}" que hace referencia a la otra tabla.`;
      } else if (rightEnd.role === 'data') {
        message = `Estás conectando el ID principal con un atributo ("${rightField}"). Las relaciones entre tablas se forman con una clave foránea que guarda el mismo identificador numérico.`;
      } else {
        message = `Esa combinación no relaciona las tablas. Une la clave primaria 🔑 "${LEVELS[this.currentLevelIdx].correctPair.left}" de la tabla principal con la clave foránea 🔗 en la tabla enlazada.`;
      }

      this.showErrorFeedback(title, message, [leftEnd.element, rightEnd.element]);
    }

    showErrorFeedback(title, message, elementsToShake) {
      this.sound.playError();

      // Animación shake en filas
      elementsToShake.forEach(el => {
        if (el) {
          el.classList.add('shake-error');
          setTimeout(() => el.classList.remove('shake-error'), 450);
        }
      });

      // Mostrar toast
      this.dom.toastTitle.textContent = title;
      this.dom.toastMessage.textContent = message;
      this.dom.errorToast.classList.add('active', 'shake');

      setTimeout(() => {
        this.dom.errorToast.classList.remove('shake');
      }, 450);

      if (this.toastTimeout) clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        this.hideToast();
      }, 5000);
    }

    hideToast() {
      this.dom.errorToast.classList.remove('active');
    }

    // =======================================================================
    // Estado de Éxito y Celebración
    // =======================================================================
    onConnectionSuccess(leftEnd, rightEnd) {
      this.isSolved = true;
      this.hideToast();
      this.sound.playSuccess();
      this.confetti.burst();

      // Resaltar filas con pulso verde
      leftEnd.element.classList.add('connected-pulse');
      rightEnd.element.classList.add('connected-pulse');

      // Actualizar Hub Central a '✓ CONECTADO'
      this.dom.centerHub.classList.add('connected');
      document.getElementById('hub-label').textContent = '✓ CONECTADO';

      // Mostrar badges de datos enlazados
      document.getElementById('status-badge-left').classList.remove('hidden');
      document.getElementById('status-badge-right').classList.remove('hidden');

      // Dibujar cable permanente
      this.drawPermanentConnection();

      // Configurar y mostrar barra inferior de éxito
      const level = LEVELS[this.currentLevelIdx];
      this.dom.successHeadline.textContent = level.explanation.headline;
      this.dom.successDescription.textContent = level.explanation.desc;
      this.dom.successSubtip.innerHTML = level.explanation.subtip;
      this.dom.bottomSuccessBar.classList.add('active');

      // Activar animación de partículas energéticas viajando por el cable
      this.startCableParticles();
    }

    drawPermanentConnection() {
      const level = LEVELS[this.currentLevelIdx];
      const nodeLeft = document.getElementById(`node-${level.tableLeft.id}-${level.correctPair.left}`);
      const nodeRight = document.getElementById(`node-${level.tableRight.id}-${level.correctPair.right}`);

      if (!nodeLeft || !nodeRight) return;

      const stageRect = this.dom.svg.getBoundingClientRect();
      const rectL = nodeLeft.getBoundingClientRect();
      const rectR = nodeRight.getBoundingClientRect();

      const x1 = rectL.left + rectL.width / 2 - stageRect.left;
      const y1 = rectL.top + rectL.height / 2 - stageRect.top;
      const x2 = rectR.left + rectR.width / 2 - stageRect.left;
      const y2 = rectR.top + rectR.height / 2 - stageRect.top;

      const pathData = this.generateBezierPath(x1, y1, x2, y2);

      this.dom.connectedCable.setAttribute('d', pathData);
      this.dom.connectedCableGlow.setAttribute('d', pathData);
    }

    startCableParticles() {
      this.dom.cableParticles.innerHTML = '';
      const path = this.dom.connectedCable;
      const pathLength = path.getTotalLength();
      if (!pathLength) return;

      const particleCount = 4;
      const circles = [];

      for (let i = 0; i < particleCount; i++) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', '4');
        this.dom.cableParticles.appendChild(circle);
        circles.push(circle);
      }

      let progress = 0;
      if (this.particleAnimInterval) clearInterval(this.particleAnimInterval);

      this.particleAnimInterval = setInterval(() => {
        progress = (progress + 0.008) % 1;
        circles.forEach((c, idx) => {
          const offset = (progress + (idx / particleCount)) % 1;
          const pt = path.getPointAtLength(offset * pathLength);
          c.setAttribute('cx', pt.x);
          c.setAttribute('cy', pt.y);
        });
      }, 16);
    }

    // =======================================================================
    // Interactividad Relacional en las Tablas de Ejemplo
    // =======================================================================
    highlightRelatedRows(trElem) {
      if (!this.isSolved) return;

      const custId = trElem.dataset.customerId;
      const custRef = trElem.dataset.customerRef;
      const targetId = custId || custRef;
      if (!targetId) return;

      const allRows = document.querySelectorAll('.record-row');
      allRows.forEach(row => {
        if (row.dataset.customerId === targetId || row.dataset.customerRef === targetId) {
          row.classList.add('active-highlight');
        } else {
          row.classList.remove('active-highlight');
        }
      });
    }

    clearRowHighlights() {
      const allRows = document.querySelectorAll('.record-row');
      allRows.forEach(row => row.classList.remove('active-highlight'));
    }

    // =======================================================================
    // Reinicio y Transición de Nivel
    // =======================================================================
    resetConnection() {
      this.resetConnectionVisuals();
      this.isSolved = false;
    }

    resetConnectionVisuals() {
      this.hideToast();
      this.dom.bottomSuccessBar.classList.remove('active');
      this.dom.centerHub.classList.remove('connected');
      document.getElementById('hub-label').textContent = 'UNIR TABLAS';

      this.dom.activeDragCable.setAttribute('d', '');
      this.dom.connectedCable.setAttribute('d', '');
      this.dom.connectedCableGlow.setAttribute('d', '');
      this.dom.cableParticles.innerHTML = '';

      if (this.particleAnimInterval) {
        clearInterval(this.particleAnimInterval);
        this.particleAnimInterval = null;
      }

      document.getElementById('status-badge-left').classList.add('hidden');
      document.getElementById('status-badge-right').classList.add('hidden');

      const allFieldRows = document.querySelectorAll('.field-row');
      allFieldRows.forEach(row => {
        row.classList.remove('connected-pulse', 'selected', 'shake-error');
      });

      this.clearRowHighlights();
    }

    nextLevel() {
      const nextIdx = (this.currentLevelIdx + 1) % LEVELS.length;
      this.renderLevel(nextIdx);
    }
  }

  // Inicializar al cargar la página
  window.addEventListener('DOMContentLoaded', () => {
    window.game = new GameController();
  });
})();
