/**
 * Garra HTTP: Claw Machine Arcade - Disruptive Information Technologies (DIT)
 * Simulador interactivo pedagógico de Métodos HTTP (GET, POST, PUT, DELETE) y APIs REST.
 * 
 * Analogías pedagógicas:
 * 🟢 GET    -> Apuntar Linterna 🔦: Inspecciona atributos y precio sin modificar la máquina (200 OK / 404 Not Found).
 * 🔵 POST   -> Rellenar Máquina 📦: Abre compuerta e inserta un nuevo peluche en casilla libre (201 Created).
 * 🟡 PUT    -> Premio Especial ✨: Reemplaza/mejora el peluche a versión Dorada Legendaria (200 OK / 404 Not Found).
 * 🔴 DELETE -> Bajar la Garra 🦾: La garra mecánica baja desde el techo, atrapa el peluche y lo saca por el conducto (200 OK).
 */

(function () {
  'use strict';

  // Catálogo base de peluches para rellenar o inicializar
  const PLUSH_PRESETS = [
    { name: 'Osito Dev', emoji: '🧸', price: 15, rarity: 'Común', desc: 'Amante del café y el código limpio' },
    { name: 'Zorro DevOps', emoji: '🦊', price: 25, rarity: 'Raro', desc: 'Automatiza despliegues en segundos' },
    { name: 'Gatito Hacker', emoji: '🐱', price: 20, rarity: 'Común', desc: 'Encuentra accesos directos por curiosidad' },
    { name: 'Panda Arquitecto', emoji: '🐼', price: 35, rarity: 'Épico', desc: 'Diseña microservicios de alto impacto' },
    { name: 'Dino Backend', emoji: '🦖', price: 18, rarity: 'Común', desc: 'Resistente y rápido procesando queries' },
    { name: 'Unicornio Frontend', emoji: '🦄', price: 45, rarity: 'Legendario', desc: 'Crea interfaces que dejan con la boca abierta' },
    { name: 'Conejo Scrum', emoji: '🐰', price: 22, rarity: 'Raro', desc: 'Sprint tras sprint cumple sus objetivos' },
    { name: 'Pingüino Linux', emoji: '🐧', price: 30, rarity: 'Épico', desc: 'Estable como una roca en producción' }
  ];

  // Misiones guiadas del Modo Desafíos
  const CLAW_MISSIONS = [
    {
      id: 1,
      title: 'Misión 1: Inspeccionar con GET 🔦',
      method: 'GET',
      targetSlot: 'A1',
      instruction: 'Apunta la linterna a la casilla <strong>A1</strong> usando el método <strong>GET</strong> para consultar sus atributos sin alterar la máquina.',
      successMsg: '¡Excelente! Has ejecutado una petición GET. Como puedes ver, es una operación de solo lectura (segura e idempotente): obtuviste los datos con código 200 OK y la máquina permanece intacta.',
      hint: 'Selecciona el método GET, casilla A1 y pulsa "Enviar Petición HTTP".'
    },
    {
      id: 2,
      title: 'Misión 2: Rellenar con POST 📦',
      method: 'POST',
      targetSlot: null, // cualquier espacio libre
      instruction: 'Un espacio está disponible. Usa <strong>POST</strong> para enviar un nuevo peluche en formato JSON a la máquina.',
      successMsg: '¡Genial! Con POST has creado un nuevo recurso en la máquina. El servidor respondió con 201 Created y le asignó una casilla única con su cabecera Location.',
      hint: 'Selecciona POST, elige el peluche que deseas ingresar y presiona "Enviar Petición HTTP".'
    },
    {
      id: 3,
      title: 'Misión 3: Mejorar Premio con PUT ✨',
      method: 'PUT',
      targetSlot: 'A2',
      instruction: 'Un cliente canjeó puntos de fidelidad. Usa <strong>PUT</strong> en la casilla <strong>A2</strong> para reemplazarlo por su versión Dorada Legendaria 🌟.',
      successMsg: '¡Brillante! El método PUT reemplaza por completo el estado del recurso existente por la nueva versión mejorada. La casilla A2 ahora es una edición especial.',
      hint: 'Selecciona PUT, casilla A2 y envía la petición para transformar el peluche.'
    },
    {
      id: 4,
      title: 'Misión 4: Bajar la Garra con DELETE 🦾',
      method: 'DELETE',
      targetSlot: 'A3',
      instruction: '¡Un jugador ganó el peluche de la casilla <strong>A3</strong>! Ejecuta <strong>DELETE</strong> para que la garra mecánica baje, lo agarre y lo entregue por el conducto.',
      successMsg: '¡Victoria! DELETE bajó la garra mecánica y eliminó el recurso del servidor. La casilla A3 ha quedado vacía y disponible para futuros peluches.',
      hint: 'Selecciona DELETE, casilla A3 y pulsa "Enviar Petición HTTP" para accionar la garra mecánica.'
    },
    {
      id: 5,
      title: 'Misión 5: Caso de Error 404 Not Found 🔍',
      method: 'GET',
      targetSlot: 'VACIA',
      instruction: 'Haz un <strong>GET</strong> o <strong>DELETE</strong> en una casilla vacía (por ejemplo <strong>A3</strong>) para comprobar cómo responde una API cuando el recurso no existe.',
      successMsg: '¡Comprendido a la perfección! Como no había ningún peluche en esa casilla, el servidor respondió con 404 Not Found. Esto demuestra que la API valida correctamente los recursos.',
      hint: 'Asegúrate de apuntar a una casilla que esté vacía y presiona enviar.'
    }
  ];

  class ClawMachineApp {
    constructor() {
      // Estado de las 6 casillas (A1, A2, A3, B1, B2, B3)
      this.slots = {
        A1: { id: 'A1', name: 'Osito Dev', emoji: '🧸', price: 15, rarity: 'Común', isLegendary: false, desc: 'Amante del café y el código limpio' },
        A2: { id: 'A2', name: 'Zorro DevOps', emoji: '🦊', price: 25, rarity: 'Raro', isLegendary: false, desc: 'Automatiza despliegues en segundos' },
        A3: { id: 'A3', name: 'Gatito Hacker', emoji: '🐱', price: 20, rarity: 'Común', isLegendary: false, desc: 'Curioso explorando APIs' },
        B1: { id: 'B1', name: 'Panda Arquitecto', emoji: '🐼', price: 35, rarity: 'Épico', isLegendary: false, desc: 'Diseña microservicios resilientes' },
        B2: { id: 'B2', name: 'Dino Backend', emoji: '🦖', price: 18, rarity: 'Común', isLegendary: false, desc: 'Rápido procesando peticiones HTTP' },
        B3: null // casilla vacía inicialmente para probar POST
      };

      this.collectedPrizes = [];
      this.currentMethod = 'GET';
      this.selectedSlot = 'A1';
      this.isAnimating = false;
      this.gameMode = 'sandbox'; // 'sandbox' | 'missions'
      this.currentMissionIndex = 0;
      this.audioCtx = null;

      // Elementos del DOM
      this.dom = {
        stage: document.getElementById('claw-game-stage'),
        cabinet: document.getElementById('claw-cabinet'),
        clawMechanism: document.getElementById('claw-mechanism'),
        clawTrolley: document.getElementById('claw-trolley'),
        clawRope: document.getElementById('claw-rope'),
        clawPincers: document.getElementById('claw-pincers'),
        spotlightBeam: document.getElementById('spotlight-beam'),
        slotsGrid: document.getElementById('claw-slots-grid'),
        prizesTray: document.getElementById('claw-prizes-tray'),
        prizesCount: document.getElementById('claw-prizes-count'),
        restockHatch: document.getElementById('claw-restock-hatch'),
        
        // Controles de Cliente HTTP
        btnMethods: document.querySelectorAll('.btn-http-method'),
        selectSlot: document.getElementById('http-slot-select'),
        inputUrl: document.getElementById('http-url-input'),
        btnSend: document.getElementById('btn-send-http'),
        reqBodySection: document.getElementById('http-request-body-section'),
        reqJsonEditor: document.getElementById('http-json-editor'),
        postToyPickers: document.querySelectorAll('.toy-picker-btn'),
        
        // Inspector de Respuestas
        statusCodePill: document.getElementById('http-status-pill'),
        statusTextDesc: document.getElementById('http-status-desc'),
        resTimeBadge: document.getElementById('http-res-time'),
        resBodyViewer: document.getElementById('http-res-json'),
        navibotExplanation: document.getElementById('http-navibot-speech'),
        
        // Misiones y Modo
        btnToggleModeSandbox: document.getElementById('btn-mode-sandbox'),
        btnToggleModeMissions: document.getElementById('btn-mode-missions'),
        missionCard: document.getElementById('claw-mission-card'),
        missionTitle: document.getElementById('claw-mission-title'),
        missionInstruction: document.getElementById('claw-mission-instruction'),
        btnMissionHint: document.getElementById('btn-claw-mission-hint'),
        missionProgressBar: document.getElementById('claw-mission-progress'),

        // Modales y HUD
        btnGuide: document.getElementById('btn-claw-guide'),
        modalGuide: document.getElementById('modal-claw-guide'),
        btnCloseGuide: document.getElementById('btn-close-claw-guide'),
        btnGotitGuide: document.getElementById('btn-gotit-claw-guide'),
        btnResetMachine: document.getElementById('btn-claw-reset'),
        modalVictory: document.getElementById('modal-claw-victory'),
        btnVictoryReplay: document.getElementById('btn-claw-victory-replay'),
        btnVictoryCatalog: document.getElementById('btn-claw-victory-catalog')
      };

      this.init();
    }

    init() {
      this.renderSlots();
      this.updateUrlInput();
      this.updatePayloadVisibility();
      this.setupEventListeners();
      this.updateMissionUI();
    }

    // =======================================================================
    // Renderizado de las Casillas de la Máquina Arcade
    // =======================================================================
    renderSlots() {
      if (!this.dom.slotsGrid) return;
      this.dom.slotsGrid.innerHTML = '';

      const slotKeys = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3'];

      slotKeys.forEach(key => {
        const item = this.slots[key];
        const slotEl = document.createElement('div');
        slotEl.className = `claw-slot-cell ${this.selectedSlot === key ? 'slot-selected' : ''} ${item ? 'slot-occupied' : 'slot-empty'}`;
        slotEl.id = `slot-${key}`;
        slotEl.dataset.slot = key;

        if (item) {
          slotEl.innerHTML = `
            <div class="slot-badge">${key}</div>
            <div class="plush-item ${item.isLegendary ? 'plush-legendary' : ''}" id="plush-${key}">
              <span class="plush-emoji">${item.emoji}</span>
              <span class="plush-name">${item.name}</span>
              <div class="plush-tags">
                <span class="tag-price">$${item.price}</span>
                <span class="tag-rarity rarity-${item.rarity.toLowerCase()}">${item.rarity}</span>
              </div>
              ${item.isLegendary ? '<span class="legendary-sparkle-pill">✨ ORO</span>' : ''}
            </div>
          `;
        } else {
          slotEl.innerHTML = `
            <div class="slot-badge badge-empty">${key}</div>
            <div class="slot-empty-content">
              <span class="empty-icon">⭕</span>
              <span class="empty-label">Casilla Vacía</span>
              <span class="empty-tip">Usa POST 📦</span>
            </div>
          `;
        }

        // Clic en la casilla la selecciona automáticamente en la consola HTTP
        slotEl.addEventListener('click', () => {
          this.selectSlot(key);
          this.playClickSound();
        });

        this.dom.slotsGrid.appendChild(slotEl);
      });

      this.updateSlotDropdown();
    }

    selectSlot(slotId) {
      this.selectedSlot = slotId;
      if (this.dom.selectSlot) {
        this.dom.selectSlot.value = slotId;
      }
      this.updateUrlInput();
      this.highlightSelectedSlotUI();
      this.updateDefaultJsonPayload();
    }

    highlightSelectedSlotUI() {
      document.querySelectorAll('.claw-slot-cell').forEach(cell => {
        cell.classList.toggle('slot-selected', cell.dataset.slot === this.selectedSlot);
      });
    }

    updateSlotDropdown() {
      if (!this.dom.selectSlot) return;
      this.dom.selectSlot.value = this.selectedSlot;
    }

    updateUrlInput() {
      if (!this.dom.inputUrl) return;
      if (this.currentMethod === 'POST') {
        this.dom.inputUrl.value = 'https://play.neurodit.com/api/peluches';
      } else {
        this.dom.inputUrl.value = `https://play.neurodit.com/api/peluches/${this.selectedSlot}`;
      }
    }

    updatePayloadVisibility() {
      const showPayload = this.currentMethod === 'POST' || this.currentMethod === 'PUT';
      if (this.dom.reqBodySection) {
        this.dom.reqBodySection.classList.toggle('hidden', !showPayload);
      }
      this.updateDefaultJsonPayload();
    }

    updateDefaultJsonPayload() {
      if (!this.dom.reqJsonEditor) return;
      const currentItem = this.slots[this.selectedSlot];

      if (this.currentMethod === 'POST') {
        const randomPreset = PLUSH_PRESETS[Math.floor(Math.random() * PLUSH_PRESETS.length)];
        this.dom.reqJsonEditor.value = JSON.stringify({
          nombre: randomPreset.name,
          emoji: randomPreset.emoji,
          precio: randomPreset.price,
          rareza: randomPreset.rarity,
          descripcion: randomPreset.desc
        }, null, 2);
      } else if (this.currentMethod === 'PUT') {
        if (currentItem) {
          this.dom.reqJsonEditor.value = JSON.stringify({
            nombre: `${currentItem.name} Edición Dorada`,
            emoji: `${currentItem.emoji}✨`,
            precio: currentItem.price * 2,
            rareza: 'Legendario',
            edicionEspecial: true,
            descripcion: 'Transformación mística con premio de oro'
          }, null, 2);
        } else {
          this.dom.reqJsonEditor.value = JSON.stringify({
            nombre: 'Peluche Especial Misterioso',
            emoji: '🌟',
            precio: 99,
            rareza: 'Legendario',
            edicionEspecial: true
          }, null, 2);
        }
      }
    }

    // =======================================================================
    // Despacho Central de Peticiones HTTP
    // =======================================================================
    async executeHttpRequest() {
      if (this.isAnimating) return;
      this.isAnimating = true;
      this.playClickSound();

      if (this.dom.btnSend) {
        this.dom.btnSend.disabled = true;
        this.dom.btnSend.classList.add('loading');
      }

      const method = this.currentMethod;
      const slotId = this.selectedSlot;
      const targetItem = this.slots[slotId];

      switch (method) {
        case 'GET':
          await this.handleGet(slotId, targetItem);
          break;
        case 'POST':
          await this.handlePost();
          break;
        case 'PUT':
          await this.handlePut(slotId, targetItem);
          break;
        case 'DELETE':
          await this.handleDelete(slotId, targetItem);
          break;
      }

      if (this.dom.btnSend) {
        this.dom.btnSend.disabled = false;
        this.dom.btnSend.classList.remove('loading');
      }
      this.isAnimating = false;

      // Validar objetivo en Modo Misiones
      if (this.gameMode === 'missions') {
        this.checkMissionSuccess(method, slotId, targetItem);
      }
    }

    // -----------------------------------------------------------------------
    // 🟢 1. GET (Apuntar Linterna 🔦)
    // -----------------------------------------------------------------------
    async handleGet(slotId, targetItem) {
      this.playScannerSound();

      // Animación de Linterna iluminando la casilla
      await this.animateSpotlight(slotId);

      if (targetItem) {
        this.playSuccessChime();
        this.renderHttpResponse(
          200,
          'OK',
          'success',
          {
            status: 200,
            statusText: 'OK',
            method: 'GET',
            endpoint: `/api/peluches/${slotId}`,
            data: targetItem
          },
          `🟢 <strong>GET /api/peluches/${slotId}</strong> inspeccionó con la linterna la casilla <strong>${slotId}</strong> sin alterarla.<br>
           En desarrollo web, <code>GET</code> es <em>idempotente y seguro</em>: solicita datos del servidor sin causar efectos secundarios ni mutar la máquina.`
        );
      } else {
        this.playErrorBoop();
        this.renderHttpResponse(
          404,
          'Not Found',
          'error',
          {
            status: 404,
            statusText: 'Not Found',
            error: `No existe ningún peluche en la casilla ${slotId}.`,
            sugerencia: 'Utiliza POST para rellenar este espacio vacío.'
          },
          `⚠️ <strong>404 Not Found:</strong> La linterna alumbró la casilla <strong>${slotId}</strong> pero estaba completamente vacía.<br>
           El servidor no encontró el recurso solicitado en esa ruta.`
        );
      }
    }

    animateSpotlight(slotId) {
      return new Promise(resolve => {
        const slotEl = document.getElementById(`slot-${slotId}`);
        const spotlight = this.dom.spotlightBeam;

        if (!slotEl || !spotlight) {
          setTimeout(resolve, 600);
          return;
        }

        const rect = slotEl.getBoundingClientRect();
        const cabinetRect = this.dom.cabinet.getBoundingClientRect();

        const relX = rect.left - cabinetRect.left + rect.width / 2;
        const relY = rect.top - cabinetRect.top + rect.height / 2;

        spotlight.style.left = `${relX}px`;
        spotlight.style.top = `${relY}px`;
        spotlight.classList.add('active');
        slotEl.classList.add('slot-illuminated');

        setTimeout(() => {
          spotlight.classList.remove('active');
          slotEl.classList.remove('slot-illuminated');
          resolve();
        }, 1100);
      });
    }

    // -----------------------------------------------------------------------
    // 🔵 2. POST (Rellenar Máquina 📦)
    // -----------------------------------------------------------------------
    async handlePost() {
      // Buscar la primera casilla vacía
      const emptySlotKey = Object.keys(this.slots).find(k => this.slots[k] === null);

      if (!emptySlotKey) {
        this.playErrorBoop();
        this.renderHttpResponse(
          409,
          'Conflict',
          'error',
          {
            status: 409,
            statusText: 'Conflict',
            error: 'La máquina de peluches está completa. No hay casillas libres para insertar.',
            sugerencia: 'Usa DELETE para retirar un peluche y liberar espacio.'
          },
          `⚠️ <strong>409 Conflict:</strong> La máquina de garra ya no tiene casillas disponibles.<br>
           <code>POST</code> crea nuevos recursos, pero fallará con conflicto si el almacén o espacio está saturado.`
        );
        return;
      }

      let payload = null;
      try {
        payload = JSON.parse(this.dom.reqJsonEditor.value);
      } catch (err) {
        payload = {
          name: 'Peluche Nuevo',
          emoji: '🧸',
          price: 25,
          rarity: 'Raro',
          desc: 'Insertado mediante API'
        };
      }

      this.playHatchRestockSound();
      await this.animateRestockHatch(emptySlotKey, payload);

      // Guardar recurso creado en la máquina
      const newPeluche = {
        id: emptySlotKey,
        name: payload.nombre || payload.name || 'Peluche Nuevo',
        emoji: payload.emoji || '🧸',
        price: parseInt(payload.precio || payload.price || 20, 10),
        rarity: payload.rareza || payload.rarity || 'Raro',
        isLegendary: false,
        desc: payload.descripcion || payload.desc || 'Creado con POST'
      };

      this.slots[emptySlotKey] = newPeluche;
      this.selectedSlot = emptySlotKey;
      this.renderSlots();

      this.playSuccessChime();
      this.renderHttpResponse(
        201,
        'Created',
        'success',
        {
          status: 201,
          statusText: 'Created',
          headers: {
            'Content-Type': 'application/json',
            'Location': `/api/peluches/${emptySlotKey}`
          },
          data: newPeluche
        },
        `🔵 <strong>POST /api/peluches</strong> abrió la compuerta e insertó a <strong>${newPeluche.name} (${newPeluche.emoji})</strong> en la casilla asignada <strong>${emptySlotKey}</strong>.<br>
         El código <code>201 Created</code> confirma la creación exitosa del nuevo recurso en el servidor.`
      );
    }

    animateRestockHatch(slotId, payload) {
      return new Promise(resolve => {
        const hatch = this.dom.restockHatch;
        if (hatch) {
          hatch.classList.add('hatch-open');
        }

        setTimeout(() => {
          if (hatch) hatch.classList.remove('hatch-open');
          resolve();
        }, 900);
      });
    }

    // -----------------------------------------------------------------------
    // 🟡 3. PUT (Premio Especial ✨ / Actualizar)
    // -----------------------------------------------------------------------
    async handlePut(slotId, targetItem) {
      if (!targetItem) {
        this.playErrorBoop();
        this.renderHttpResponse(
          404,
          'Not Found',
          'error',
          {
            status: 404,
            statusText: 'Not Found',
            error: `No se puede actualizar el recurso en ${slotId} porque la casilla está vacía.`,
            sugerencia: 'Primero crea el recurso con POST antes de actualizarlo con PUT.'
          },
          `⚠️ <strong>404 Not Found:</strong> No puedes aplicar <code>PUT</code> en la casilla <strong>${slotId}</strong> porque no existe ningún peluche que modificar.<br>
           <code>PUT</code> requiere una entidad existente para reemplazar su contenido por completo.`
        );
        return;
      }

      let payload = null;
      try {
        payload = JSON.parse(this.dom.reqJsonEditor.value);
      } catch (err) {
        payload = {
          name: `${targetItem.name} Dorado`,
          emoji: `${targetItem.emoji}✨`,
          price: targetItem.price * 2,
          rarity: 'Legendario',
          edicionEspecial: true
        };
      }

      this.playSparkleMagicSound();
      await this.animateGoldTransform(slotId);

      // Reemplazo completo del recurso (Semántica canónica de PUT)
      const updatedPeluche = {
        id: slotId,
        name: payload.nombre || payload.name || `${targetItem.name} 🌟`,
        emoji: payload.emoji || `${targetItem.emoji}✨`,
        price: parseInt(payload.precio || payload.price || targetItem.price * 2, 10),
        rarity: 'Legendario',
        isLegendary: true,
        desc: payload.descripcion || payload.desc || 'Transformado en premio dorado legendario'
      };

      this.slots[slotId] = updatedPeluche;
      this.renderSlots();

      this.playSuccessChime();
      this.renderHttpResponse(
        200,
        'OK',
        'success',
        {
          status: 200,
          statusText: 'OK',
          method: 'PUT',
          endpoint: `/api/peluches/${slotId}`,
          data: updatedPeluche
        },
        `🟡 <strong>PUT /api/peluches/${slotId}</strong> transformó el peluche original en su <strong>Versión Dorada Legendaria 🌟</strong>.<br>
         <code>PUT</code> reemplaza todo el objeto por la nueva representación que enviaste en el Payload.`
      );
    }

    animateGoldTransform(slotId) {
      return new Promise(resolve => {
        const slotEl = document.getElementById(`slot-${slotId}`);
        if (slotEl) {
          slotEl.classList.add('slot-gold-burst');
          setTimeout(() => {
            slotEl.classList.remove('slot-gold-burst');
            resolve();
          }, 950);
        } else {
          setTimeout(resolve, 600);
        }
      });
    }

    // -----------------------------------------------------------------------
    // 🔴 4. DELETE (Bajar la Garra Mecánica 🦾)
    // -----------------------------------------------------------------------
    async handleDelete(slotId, targetItem) {
      if (!targetItem) {
        this.playErrorBoop();
        this.renderHttpResponse(
          404,
          'Not Found',
          'error',
          {
            status: 404,
            statusText: 'Not Found',
            error: `La garra mecánica bajó a la casilla ${slotId}, pero no encontró nada que sujetar.`,
            sugerencia: 'Selecciona una casilla que contenga un peluche.'
          },
          `⚠️ <strong>404 Not Found:</strong> La garra bajó a <strong>${slotId}</strong>, pero el recurso ya no existía.<br>
           En APIs REST, eliminar un recurso inexistente retorna 404 Not Found.`
        );
        return;
      }

      // Animación Cinemática Completa de la Garra Mecánica 🦾
      await this.animateClawExtraction(slotId, targetItem);

      // Guardar en la bandeja de premios recogidos
      this.collectedPrizes.push(targetItem);
      this.updatePrizesTrayUI();

      // Dejar la casilla completamente vacía
      this.slots[slotId] = null;
      this.renderSlots();

      this.playSuccessChime();
      this.renderHttpResponse(
        200,
        'OK',
        'success',
        {
          status: 200,
          statusText: 'OK',
          method: 'DELETE',
          endpoint: `/api/peluches/${slotId}`,
          mensaje: `Peluche ${targetItem.name} (${targetItem.emoji}) retirado con éxito de la casilla ${slotId}.`,
          recursoEliminado: targetItem
        },
        `🔴 <strong>DELETE /api/peluches/${slotId}</strong> accionó la garra mecánica 🦾: bajó, sujetó a <strong>${targetItem.name}</strong>, lo extrajo por el conducto y dejó la casilla <strong>${slotId}</strong> vacía.<br>
         El recurso ha sido destruido y liberado en el servidor.`
      );
    }

    animateClawExtraction(slotId, targetItem) {
      return new Promise(resolve => {
        const trolley = this.dom.clawTrolley;
        const rope = this.dom.clawRope;
        const pincers = this.dom.clawPincers;
        const targetSlotEl = document.getElementById(`slot-${slotId}`);

        if (!trolley || !rope || !pincers || !targetSlotEl) {
          setTimeout(resolve, 1000);
          return;
        }

        const cabinetRect = this.dom.cabinet.getBoundingClientRect();
        const slotRect = targetSlotEl.getBoundingClientRect();

        // 1. Calcular posición X del riel horizontal
        const targetX = slotRect.left - cabinetRect.left + slotRect.width / 2 - 25; // 25 = centro trolley
        const targetDropY = slotRect.top - cabinetRect.top + slotRect.height / 2 - 30;

        this.playMotorSound();

        // Paso 1: Mover trolley horizontalmente hacia la columna objetivo
        trolley.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        trolley.style.transform = `translateX(${targetX}px)`;

        setTimeout(() => {
          // Paso 2: Bajar cable de la garra
          pincers.classList.add('pincers-open');
          rope.style.transition = 'height 0.9s cubic-bezier(0.4, 0, 0.2, 1)';
          rope.style.height = `${targetDropY}px`;
          this.playClawDownSound();

          setTimeout(() => {
            // Paso 3: Cerrar pinzas y sujetar peluche
            pincers.classList.remove('pincers-open');
            pincers.classList.add('pincers-grab');
            this.playMechanicalClackSound();

            const plushEl = document.getElementById(`plush-${slotId}`);
            if (plushEl) plushEl.classList.add('plush-grabbed');

            setTimeout(() => {
              // Paso 4: Subir cable con el peluche atrapado
              rope.style.transition = 'height 0.8s ease-in-out';
              rope.style.height = '40px';
              this.playMotorSound();

              setTimeout(() => {
                // Paso 5: Mover trolley hacia el conducto de premios (izquierda)
                trolley.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                trolley.style.transform = 'translateX(40px)';

                setTimeout(() => {
                  // Paso 6: Abrir pinzas y soltar peluche en el conducto
                  pincers.classList.remove('pincers-grab');
                  pincers.classList.add('pincers-open');
                  this.playChuteDropSound();

                  setTimeout(() => {
                    // Restaurar garra a posición neutral
                    pincers.classList.remove('pincers-open');
                    trolley.style.transform = 'translateX(180px)';
                    resolve();
                  }, 500);
                }, 850);
              }, 850);
            }, 500);
          }, 950);
        }, 850);
      });
    }

    updatePrizesTrayUI() {
      if (!this.dom.prizesTray) return;
      this.dom.prizesTray.innerHTML = '';

      if (this.dom.prizesCount) {
        this.dom.prizesCount.textContent = this.collectedPrizes.length;
      }

      this.collectedPrizes.forEach(prize => {
        const itemEl = document.createElement('div');
        itemEl.className = 'won-prize-item';
        itemEl.title = `${prize.name} ($${prize.price})`;
        itemEl.innerHTML = `<span class="won-emoji">${prize.emoji}</span>`;
        this.dom.prizesTray.appendChild(itemEl);
      });
    }

    // =======================================================================
    // Inspector de Respuestas HTTP (Postman Console)
    // =======================================================================
    renderHttpResponse(statusCode, statusText, type, payloadObj, explanationHtml) {
      if (this.dom.statusCodePill) {
        this.dom.statusCodePill.className = `http-status-badge status-${statusCode}`;
        this.dom.statusCodePill.textContent = `${statusCode} ${statusText}`;
      }

      if (this.dom.statusTextDesc) {
        this.dom.statusTextDesc.textContent = statusText;
      }

      if (this.dom.resTimeBadge) {
        const randomTime = Math.floor(Math.random() * 15) + 8;
        this.dom.resTimeBadge.textContent = `${randomTime} ms`;
      }

      if (this.dom.resBodyViewer) {
        this.dom.resBodyViewer.textContent = JSON.stringify(payloadObj, null, 2);
      }

      if (this.dom.navibotExplanation) {
        this.dom.navibotExplanation.innerHTML = explanationHtml;
        this.dom.navibotExplanation.classList.remove('speech-pop');
        void this.dom.navibotExplanation.offsetWidth;
        this.dom.navibotExplanation.classList.add('speech-pop');
      }
    }

    // =======================================================================
    // Lógica del Modo Misiones / Desafíos Pedagógicos
    // =======================================================================
    updateMissionUI() {
      if (this.gameMode !== 'missions') {
        if (this.dom.missionCard) this.dom.missionCard.classList.add('hidden');
        return;
      }

      if (this.dom.missionCard) this.dom.missionCard.classList.remove('hidden');

      const mission = CLAW_MISSIONS[this.currentMissionIndex];
      if (!mission) {
        this.handleAllMissionsVictory();
        return;
      }

      if (this.dom.missionTitle) {
        this.dom.missionTitle.textContent = mission.title;
      }

      if (this.dom.missionInstruction) {
        this.dom.missionInstruction.innerHTML = mission.instruction;
      }

      if (this.dom.missionProgressBar) {
        const pct = (this.currentMissionIndex / CLAW_MISSIONS.length) * 100;
        this.dom.missionProgressBar.style.width = `${pct}%`;
      }
    }

    checkMissionSuccess(method, slotId, targetItem) {
      const mission = CLAW_MISSIONS[this.currentMissionIndex];
      if (!mission) return;

      let isSuccess = false;

      if (mission.id === 1 && method === 'GET' && slotId === 'A1') {
        isSuccess = true;
      } else if (mission.id === 2 && method === 'POST') {
        isSuccess = true;
      } else if (mission.id === 3 && method === 'PUT' && slotId === 'A2') {
        isSuccess = true;
      } else if (mission.id === 4 && method === 'DELETE' && slotId === 'A3') {
        isSuccess = true;
      } else if (mission.id === 5 && (method === 'GET' || method === 'DELETE') && !targetItem) {
        isSuccess = true;
      }

      if (isSuccess) {
        this.playVictoryFanfare();
        if (this.dom.navibotExplanation) {
          this.dom.navibotExplanation.innerHTML += `
            <div class="mission-success-notice">
              <strong>🎯 ¡MISIÓN CUMPLIDA!</strong> ${mission.successMsg}
            </div>
          `;
        }

        setTimeout(() => {
          this.currentMissionIndex++;
          if (this.currentMissionIndex < CLAW_MISSIONS.length) {
            this.updateMissionUI();
          } else {
            this.handleAllMissionsVictory();
          }
        }, 1800);
      }
    }

    handleAllMissionsVictory() {
      this.playVictoryFanfare();
      if (this.dom.modalVictory) {
        this.dom.modalVictory.classList.add('active');
      }
      this.triggerConfetti();
    }

    triggerConfetti() {
      if (window.ditApp && window.ditApp.confetti) {
        window.ditApp.confetti.burst(300, 200);
      }
    }

    // =======================================================================
    // Reiniciar la Máquina
    // =======================================================================
    resetMachine() {
      this.slots = {
        A1: { id: 'A1', name: 'Osito Dev', emoji: '🧸', price: 15, rarity: 'Común', isLegendary: false, desc: 'Amante del café y el código limpio' },
        A2: { id: 'A2', name: 'Zorro DevOps', emoji: '🦊', price: 25, rarity: 'Raro', isLegendary: false, desc: 'Automatiza despliegues en segundos' },
        A3: { id: 'A3', name: 'Gatito Hacker', emoji: '🐱', price: 20, rarity: 'Común', isLegendary: false, desc: 'Curioso explorando APIs' },
        B1: { id: 'B1', name: 'Panda Arquitecto', emoji: '🐼', price: 35, rarity: 'Épico', isLegendary: false, desc: 'Diseña microservicios resilientes' },
        B2: { id: 'B2', name: 'Dino Backend', emoji: '🦖', price: 18, rarity: 'Común', isLegendary: false, desc: 'Rápido procesando peticiones HTTP' },
        B3: null
      };

      this.collectedPrizes = [];
      this.selectedSlot = 'A1';
      this.currentMethod = 'GET';
      this.currentMissionIndex = 0;
      this.updatePrizesTrayUI();
      this.renderSlots();
      this.updateUrlInput();
      this.updatePayloadVisibility();
      this.updateMissionUI();

      this.renderHttpResponse(
        200,
        'OK',
        'info',
        { status: 200, mensaje: 'Máquina recreativa reiniciada con estado inicial' },
        '🔄 <strong>Máquina Reiniciada:</strong> Los peluches han vuelto a sus casillas base y la garra está lista para nuevas peticiones.'
      );
    }

    // =======================================================================
    // Controladores de Eventos
    // =======================================================================
    setupEventListeners() {
      // Selector de Método HTTP
      this.dom.btnMethods.forEach(btn => {
        btn.addEventListener('click', () => {
          this.playClickSound();
          this.dom.btnMethods.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentMethod = btn.dataset.method;
          this.updateUrlInput();
          this.updatePayloadVisibility();
        });
      });

      // Selector de Casilla (Dropdown)
      if (this.dom.selectSlot) {
        this.dom.selectSlot.addEventListener('change', (e) => {
          this.selectSlot(e.target.value);
        });
      }

      // Botón Enviar Petición HTTP
      if (this.dom.btnSend) {
        this.dom.btnSend.addEventListener('click', () => this.executeHttpRequest());
      }

      // Botones de Selección Rápida de Peluche para POST
      this.dom.postToyPickers.forEach(picker => {
        picker.addEventListener('click', () => {
          this.playClickSound();
          const name = picker.dataset.name;
          const emoji = picker.dataset.emoji;
          const price = picker.dataset.price;
          const rarity = picker.dataset.rarity;

          if (this.dom.reqJsonEditor) {
            this.dom.reqJsonEditor.value = JSON.stringify({
              nombre: name,
              emoji: emoji,
              precio: parseInt(price, 10),
              rareza: rarity,
              descripcion: 'Seleccionado con un clic rápido'
            }, null, 2);
          }
        });
      });

      // Cambio de Modo (Sandbox vs Misiones)
      if (this.dom.btnToggleModeSandbox) {
        this.dom.btnToggleModeSandbox.addEventListener('click', () => {
          this.playClickSound();
          this.gameMode = 'sandbox';
          this.dom.btnToggleModeSandbox.classList.add('active');
          if (this.dom.btnToggleModeMissions) this.dom.btnToggleModeMissions.classList.remove('active');
          this.updateMissionUI();
        });
      }

      if (this.dom.btnToggleModeMissions) {
        this.dom.btnToggleModeMissions.addEventListener('click', () => {
          this.playClickSound();
          this.gameMode = 'missions';
          this.dom.btnToggleModeMissions.classList.add('active');
          if (this.dom.btnToggleModeSandbox) this.dom.btnToggleModeSandbox.classList.remove('active');
          this.updateMissionUI();
        });
      }

      // Botón de Pista en Misiones
      if (this.dom.btnMissionHint) {
        this.dom.btnMissionHint.addEventListener('click', () => {
          this.playClickSound();
          const mission = CLAW_MISSIONS[this.currentMissionIndex];
          if (mission && this.dom.navibotExplanation) {
            this.dom.navibotExplanation.innerHTML = `
              <div class="mission-hint-box">
                <span class="hint-lamp">💡</span> <strong>Pista de NaviBot:</strong> ${mission.hint}
              </div>
            `;
          }
        });
      }

      // Reiniciar Máquina
      if (this.dom.btnResetMachine) {
        this.dom.btnResetMachine.addEventListener('click', () => {
          this.playClickSound();
          this.resetMachine();
        });
      }

      // Modales de Guía
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

      // Modal de Victoria
      if (this.dom.btnVictoryReplay) {
        this.dom.btnVictoryReplay.addEventListener('click', () => {
          if (this.dom.modalVictory) this.dom.modalVictory.classList.remove('active');
          this.resetMachine();
        });
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
    }

    // =======================================================================
    // Sintetizador de Efectos de Sonido Web Audio API
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
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }

    playSuccessChime() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.35);
      });
    }

    playScannerSound() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(950, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    }

    playMotorSound() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(160, ctx.currentTime + 0.3);
      osc.frequency.linearRampToValueAtTime(130, ctx.currentTime + 0.7);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.75);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.75);
    }

    playClawDownSound() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.85);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.85);
    }

    playMechanicalClackSound() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    }

    playChuteDropSound() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }

    playHatchRestockSound() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(520, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }

    playSparkleMagicSound() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const freqs = [659, 880, 1174, 1567, 2093];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.3);
      });
    }

    playErrorBoop() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }

    playVictoryFanfare() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const fanfare = [
        { f: 523.25, t: 0.12 },
        { f: 659.25, t: 0.12 },
        { f: 783.99, t: 0.12 },
        { f: 1046.50, t: 0.35 }
      ];
      let delay = 0;
      fanfare.forEach(note => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + note.t);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + note.t);
        delay += note.t + 0.02;
      });
    }
  }

  // Inicializar globalmente cuando cargue el DOM
  document.addEventListener('DOMContentLoaded', () => {
    window.ditClawApp = new ClawMachineApp();
  });

})();
