/**
 * ==============================================================================
 * PAC-ROLES: EL LABERINTO DE LOS PERMISOS (RBAC & SEGURIDAD WEB)
 * Disruptive Information Technologies (DIT) - Módulo Educativo Arcade
 * ==============================================================================
 * Enseña qué son los Roles y Permisos en tecnología mediante un laberinto
 * retro estilo Pac-Man (Policía vs. Ladrón). Cada acción física (moverse,
 * cruzar túneles, recolectar, arrestar) está estrictamente gobernada por un
 * permiso explícito. Si un permiso falta, se muestra un candado rojo físico 🔒
 * y se bloquea el acceso en tiempo real.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Definición del Laberinto 13x13 (0: Camino, 1: Muro, 2: Túnel, 3: Puerta)
  // ---------------------------------------------------------------------------
  const MAZE_GRID = [
    [1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1], // Fila 0: Puerta de Escape en (6,0)
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // Fila 1: Inicio Ladrón en (1,1)
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1], // Fila 2
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1], // Fila 3
    [1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1], // Fila 4
    [1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1], // Fila 5
    [2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2], // Fila 6: Túneles en (0,6) y (12,6)
    [1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1], // Fila 7
    [1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1], // Fila 8
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1], // Fila 9
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1], // Fila 10
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // Fila 11: Inicio Policía en (11,11)
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]  // Fila 12
  ];

  const GRID_COLS = 13;
  const GRID_ROWS = 13;

  // 5 Monedas en posiciones balanceadas
  const INITIAL_COINS = [
    { col: 6, row: 1, collected: false },
    { col: 3, row: 3, collected: false },
    { col: 9, row: 3, collected: false },
    { col: 3, row: 9, collected: false },
    { col: 9, row: 9, collected: false }
  ];

  // Presets de Retos Pedagógicos
  const PAC_CHALLENGES = {
    1: {
      name: 'Reto 1: "El Escape Cojo"',
      desc: 'Eres el Ladrón. Tu permiso "Ir a la Derecha ➡️" está apagado a propósito. ¡Prueba moverte a la derecha, descubre el candado 🔒, abre el panel, actívalo y escapa!',
      playerRole: 'thief',
      thiefPerms: { moveUp: true, moveDown: true, moveLeft: true, moveRight: false, collectCoins: true, useTunnel: true },
      policePerms: { moveUp: true, moveDown: true, moveLeft: true, moveRight: true, arrestThief: true, superTurbo: false }
    },
    2: {
      name: 'Reto 2: "El Policía Desarmado"',
      desc: 'Eres el Ladrón. Al Policía se le revocó el permiso "🚨 Arrestar al Ladrón". Recoge las monedas pasando frente a él y observa cómo no puede tocarte.',
      playerRole: 'thief',
      thiefPerms: { moveUp: true, moveDown: true, moveLeft: true, moveRight: true, collectCoins: true, useTunnel: true },
      policePerms: { moveUp: true, moveDown: true, moveLeft: true, moveRight: true, arrestThief: false, superTurbo: false }
    },
    3: {
      name: 'Reto 3: "Atajo por el Túnel"',
      desc: 'El Policía tiene Turbo activado. Tu salvación es el Túnel Secreto 🌀: crúzalo de lado a lado para teletransportarte y llegar a la puerta de escape.',
      playerRole: 'thief',
      thiefPerms: { moveUp: true, moveDown: true, moveLeft: true, moveRight: true, collectCoins: true, useTunnel: true },
      policePerms: { moveUp: true, moveDown: true, moveLeft: true, moveRight: true, arrestThief: true, superTurbo: true }
    },
    sandbox: {
      name: 'Modo Libre (Sandbox)',
      desc: 'Configura a tu gusto qué personaje quieres controlar y enciende o apaga cualquier permiso para ambos roles.',
      playerRole: 'thief',
      thiefPerms: { moveUp: true, moveDown: true, moveLeft: true, moveRight: true, collectCoins: true, useTunnel: true },
      policePerms: { moveUp: true, moveDown: true, moveLeft: true, moveRight: true, arrestThief: true, superTurbo: false }
    }
  };

  class PacRolesGame {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.audioCtx = null;
      this.soundEnabled = true;

      // Estado del Juego
      this.isRunning = false;
      this.isPaused = true;
      this.currentChallenge = 1;
      this.playerRole = 'thief'; // 'thief' o 'police'

      // Configuración de Permisos (Por Defecto: Ladrón sin derecha en Reto 1)
      this.permissions = {
        thief: {
          moveUp: true,
          moveDown: true,
          moveLeft: true,
          moveRight: false, // ¡Apagado para la lección de permisos!
          collectCoins: true,
          useTunnel: true
        },
        police: {
          moveUp: true,
          moveDown: true,
          moveLeft: true,
          moveRight: true,
          arrestThief: true,
          superTurbo: false
        }
      };

      // Entidades
      this.thief = {
        col: 1,
        row: 1,
        x: 1,
        y: 1,
        targetCol: 1,
        targetRow: 1,
        dir: 'RIGHT',
        nextDir: null,
        speed: 2.6,
        isMoving: false,
        deniedEffect: null // { text, timer }
      };

      this.police = {
        col: 11,
        row: 11,
        x: 11,
        y: 11,
        targetCol: 11,
        targetRow: 11,
        dir: 'LEFT',
        nextDir: null,
        speed: 2.3,
        isMoving: false,
        turboActive: false,
        turboTimer: 0,
        deniedEffect: null
      };

      this.coins = JSON.parse(JSON.stringify(INITIAL_COINS));
      this.coinsCollected = 0;
      this.escapeDoorOpen = false;
      this.deniedAttemptsCount = 0;
      this.lastFrameTime = performance.now();
      this.aiTickTimer = 0;

      // Elementos DOM
      this.dom = {};
      this.init();
    }

    // -------------------------------------------------------------------------
    // Inicialización del Motor
    // -------------------------------------------------------------------------
    init() {
      this.bindDOMElements();
      this.setupCanvas();
      this.setupControls();
      this.setupAudio();
      this.loadChallenge(1);
      this.updateConfigPanelUI();

      // Iniciar el bucle de renderizado continuo a 60 FPS
      requestAnimationFrame((t) => this.gameLoop(t));
    }

    bindDOMElements() {
      this.dom.stage = document.getElementById('pac-roles-stage');
      this.canvas = document.getElementById('pac-canvas');
      if (this.canvas) {
        this.ctx = this.canvas.getContext('2d');
      }

      // Toolbar superior
      this.dom.btnGuide = document.getElementById('btn-pac-guide');
      this.dom.btnReset = document.getElementById('btn-pac-reset');
      this.dom.btnConfigToggle = document.getElementById('btn-pac-config-toggle');
      this.dom.challengeButtons = document.querySelectorAll('.btn-pac-challenge');
      this.dom.activeChallengeTitle = document.getElementById('pac-active-challenge-title');
      this.dom.activeChallengeDesc = document.getElementById('pac-active-challenge-desc');

      // HUD de juego
      this.dom.coinsCount = document.getElementById('pac-coins-count');
      this.dom.doorStatus = document.getElementById('pac-door-status');
      this.dom.playerRoleBadge = document.getElementById('pac-player-role-badge');
      this.dom.deniedBanner = document.getElementById('pac-denied-banner');
      this.dom.deniedBannerText = document.getElementById('pac-denied-banner-text');

      // Panel de Configuración
      this.dom.configPanel = document.getElementById('pac-config-panel');
      this.dom.btnRoleThief = document.getElementById('btn-pac-role-thief');
      this.dom.btnRolePolice = document.getElementById('btn-pac-role-police');
      this.dom.btnStartGame = document.getElementById('btn-pac-start-game');

      // Toggles de Permisos Ladrón
      this.dom.toggleThiefUp = document.getElementById('toggle-thief-up');
      this.dom.toggleThiefDown = document.getElementById('toggle-thief-down');
      this.dom.toggleThiefLeft = document.getElementById('toggle-thief-left');
      this.dom.toggleThiefRight = document.getElementById('toggle-thief-right');
      this.dom.toggleThiefCoins = document.getElementById('toggle-thief-coins');
      this.dom.toggleThiefTunnel = document.getElementById('toggle-thief-tunnel');

      // Toggles de Permisos Policía
      this.dom.togglePoliceUp = document.getElementById('toggle-police-up');
      this.dom.togglePoliceDown = document.getElementById('toggle-police-down');
      this.dom.togglePoliceLeft = document.getElementById('toggle-police-left');
      this.dom.togglePoliceRight = document.getElementById('toggle-police-right');
      this.dom.togglePoliceArrest = document.getElementById('toggle-police-arrest');
      this.dom.togglePoliceTurbo = document.getElementById('toggle-police-turbo');

      // Carnets Digitales
      this.dom.badgeThiefClaims = document.getElementById('pac-thief-claims');
      this.dom.badgePoliceClaims = document.getElementById('pac-police-claims');

      // D-Pad Táctil
      this.dom.dpadUp = document.getElementById('btn-dpad-up');
      this.dom.dpadDown = document.getElementById('btn-dpad-down');
      this.dom.dpadLeft = document.getElementById('btn-dpad-left');
      this.dom.dpadRight = document.getElementById('btn-dpad-right');
      this.dom.dpadTurbo = document.getElementById('btn-dpad-turbo');

      // Modales
      this.dom.modalGuide = document.getElementById('modal-pac-guide');
      this.dom.btnCloseGuide = document.getElementById('btn-close-pac-guide');
      this.dom.btnGotitGuide = document.getElementById('btn-gotit-pac-guide');

      this.dom.modalVictory = document.getElementById('modal-pac-victory');
      this.dom.victoryTitle = document.getElementById('pac-victory-title');
      this.dom.victorySubtitle = document.getElementById('pac-victory-subtitle');
      this.dom.victoryReason = document.getElementById('pac-victory-reason');
      this.dom.btnVictoryReplay = document.getElementById('btn-pac-victory-replay');
      this.dom.btnVictoryConfig = document.getElementById('btn-pac-victory-config');

      this.dom.modalGameOver = document.getElementById('modal-pac-gameover');
      this.dom.gameoverTitle = document.getElementById('pac-gameover-title');
      this.dom.gameoverSubtitle = document.getElementById('pac-gameover-subtitle');
      this.dom.gameoverReason = document.getElementById('pac-gameover-reason');
      this.dom.btnGameoverRetry = document.getElementById('btn-pac-gameover-retry');
      this.dom.btnGameoverConfig = document.getElementById('btn-pac-gameover-config');
    }

    setupCanvas() {
      if (!this.canvas) return;
      // Resolución fija del Canvas para Pixel Art ultra nítido
      this.canvas.width = 520;
      this.canvas.height = 520;
      if (this.ctx) {
        this.ctx.imageSmoothingEnabled = false;
      }
    }

    // -------------------------------------------------------------------------
    // Configuración de Audio (Web Audio API Arcade)
    // -------------------------------------------------------------------------
    setupAudio() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }

    ensureAudio() {
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    }

    playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.15) {
      if (!this.soundEnabled || !this.audioCtx) return;
      this.ensureAudio();
      try {
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
      } catch (e) {
        // Audio error silenciado
      }
    }

    playCoinSound() {
      this.playTone(660, 'square', 0.08, 0.12);
      setTimeout(() => this.playTone(990, 'square', 0.12, 0.14), 60);
    }

    playDeniedSound() {
      if (!this.soundEnabled || !this.audioCtx) return;
      this.ensureAudio();
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, this.audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, this.audioCtx.currentTime + 0.22);
        gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.22);
      } catch (e) {}
    }

    playTeleportSound() {
      this.playTone(400, 'sine', 0.1, 0.15);
      setTimeout(() => this.playTone(600, 'sine', 0.1, 0.15), 50);
      setTimeout(() => this.playTone(900, 'sine', 0.15, 0.18), 100);
    }

    playSirenSound() {
      this.playTone(550, 'triangle', 0.15, 0.2);
      setTimeout(() => this.playTone(850, 'triangle', 0.2, 0.2), 120);
    }

    playVictorySound() {
      const notes = [440, 554, 659, 880];
      notes.forEach((f, idx) => {
        setTimeout(() => this.playTone(f, 'square', 0.2, 0.18), idx * 110);
      });
    }

    playGameOverSound() {
      const notes = [400, 350, 300, 220];
      notes.forEach((f, idx) => {
        setTimeout(() => this.playTone(f, 'sawtooth', 0.25, 0.2), idx * 120);
      });
    }

    // -------------------------------------------------------------------------
    // Controladores de Eventos y Teclado
    // -------------------------------------------------------------------------
    setupControls() {
      // Controles de Teclado
      window.addEventListener('keydown', (e) => {
        if (!this.isRunning || this.isPaused) return;

        let handled = false;
        switch (e.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            this.handlePlayerInput('UP');
            handled = true;
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            this.handlePlayerInput('DOWN');
            handled = true;
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            this.handlePlayerInput('LEFT');
            handled = true;
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            this.handlePlayerInput('RIGHT');
            handled = true;
            break;
          case ' ':
            this.handleTurboInput();
            handled = true;
            break;
        }

        if (handled) {
          e.preventDefault();
        }
      });

      // D-Pad Táctil en Pantalla
      if (this.dom.dpadUp) this.dom.dpadUp.addEventListener('click', () => this.handlePlayerInput('UP'));
      if (this.dom.dpadDown) this.dom.dpadDown.addEventListener('click', () => this.handlePlayerInput('DOWN'));
      if (this.dom.dpadLeft) this.dom.dpadLeft.addEventListener('click', () => this.handlePlayerInput('LEFT'));
      if (this.dom.dpadRight) this.dom.dpadRight.addEventListener('click', () => this.handlePlayerInput('RIGHT'));
      if (this.dom.dpadTurbo) this.dom.dpadTurbo.addEventListener('click', () => this.handleTurboInput());

      // Botones de Retos
      this.dom.challengeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const chId = btn.dataset.challenge;
          this.dom.challengeButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.loadChallenge(chId);
        });
      });

      // Selector de Rol del Jugador
      if (this.dom.btnRoleThief) {
        this.dom.btnRoleThief.addEventListener('click', () => {
          this.playerRole = 'thief';
          this.dom.btnRoleThief.classList.add('active');
          if (this.dom.btnRolePolice) this.dom.btnRolePolice.classList.remove('active');
          this.updateConfigPanelUI();
        });
      }

      if (this.dom.btnRolePolice) {
        this.dom.btnRolePolice.addEventListener('click', () => {
          this.playerRole = 'police';
          this.dom.btnRolePolice.classList.add('active');
          if (this.dom.btnRoleThief) this.dom.btnRoleThief.classList.remove('active');
          this.updateConfigPanelUI();
        });
      }

      // Toggles de Permisos Ladrón
      this.bindToggle(this.dom.toggleThiefUp, 'thief', 'moveUp');
      this.bindToggle(this.dom.toggleThiefDown, 'thief', 'moveDown');
      this.bindToggle(this.dom.toggleThiefLeft, 'thief', 'moveLeft');
      this.bindToggle(this.dom.toggleThiefRight, 'thief', 'moveRight');
      this.bindToggle(this.dom.toggleThiefCoins, 'thief', 'collectCoins');
      this.bindToggle(this.dom.toggleThiefTunnel, 'thief', 'useTunnel');

      // Toggles de Permisos Policía
      this.bindToggle(this.dom.togglePoliceUp, 'police', 'moveUp');
      this.bindToggle(this.dom.togglePoliceDown, 'police', 'moveDown');
      this.bindToggle(this.dom.togglePoliceLeft, 'police', 'moveLeft');
      this.bindToggle(this.dom.togglePoliceRight, 'police', 'moveRight');
      this.bindToggle(this.dom.togglePoliceArrest, 'police', 'arrestThief');
      this.bindToggle(this.dom.togglePoliceTurbo, 'police', 'superTurbo');

      // Botón Iniciar Partida
      if (this.dom.btnStartGame) {
        this.dom.btnStartGame.addEventListener('click', () => {
          this.startGame();
        });
      }

      // Botón Alternar Configuración / Pausa
      if (this.dom.btnConfigToggle) {
        this.dom.btnConfigToggle.addEventListener('click', () => {
          this.toggleConfigPanel();
        });
      }

      // Reiniciar
      if (this.dom.btnReset) {
        this.dom.btnReset.addEventListener('click', () => {
          this.resetGame();
        });
      }

      // Modales Guía
      if (this.dom.btnGuide) {
        this.dom.btnGuide.addEventListener('click', () => this.openGuideModal());
      }
      if (this.dom.btnCloseGuide) {
        this.dom.btnCloseGuide.addEventListener('click', () => this.closeGuideModal());
      }
      if (this.dom.btnGotitGuide) {
        this.dom.btnGotitGuide.addEventListener('click', () => this.closeGuideModal());
      }

      // Modales Victoria y Derrota
      if (this.dom.btnVictoryReplay) {
        this.dom.btnVictoryReplay.addEventListener('click', () => {
          this.closeVictoryModal();
          this.startGame();
        });
      }
      if (this.dom.btnVictoryConfig) {
        this.dom.btnVictoryConfig.addEventListener('click', () => {
          this.closeVictoryModal();
          this.showConfigPanel();
        });
      }

      if (this.dom.btnGameoverRetry) {
        this.dom.btnGameoverRetry.addEventListener('click', () => {
          this.closeGameOverModal();
          this.startGame();
        });
      }
      if (this.dom.btnGameoverConfig) {
        this.dom.btnGameoverConfig.addEventListener('click', () => {
          this.closeGameOverModal();
          this.showConfigPanel();
        });
      }
    }

    bindToggle(el, role, prop) {
      if (!el) return;
      el.addEventListener('change', () => {
        this.permissions[role][prop] = el.checked;
        this.updateDigitalCarnet();
        this.playTone(320, 'sine', 0.05, 0.08);
      });
    }

    // -------------------------------------------------------------------------
    // Carga de Retos Pedagógicos
    // -------------------------------------------------------------------------
    loadChallenge(id) {
      const ch = PAC_CHALLENGES[id] || PAC_CHALLENGES[1];
      this.currentChallenge = id;
      this.playerRole = ch.playerRole;
      this.permissions.thief = Object.assign({}, ch.thiefPerms);
      this.permissions.police = Object.assign({}, ch.policePerms);

      if (this.dom.activeChallengeTitle) this.dom.activeChallengeTitle.textContent = ch.name;
      if (this.dom.activeChallengeDesc) this.dom.activeChallengeDesc.textContent = ch.desc;

      this.updateConfigPanelUI();
      this.resetGame(false);
    }

    updateConfigPanelUI() {
      // Sincronizar botones de rol
      if (this.dom.btnRoleThief) this.dom.btnRoleThief.classList.toggle('active', this.playerRole === 'thief');
      if (this.dom.btnRolePolice) this.dom.btnRolePolice.classList.toggle('active', this.playerRole === 'police');

      // Sincronizar checkboxes del Ladrón
      if (this.dom.toggleThiefUp) this.dom.toggleThiefUp.checked = this.permissions.thief.moveUp;
      if (this.dom.toggleThiefDown) this.dom.toggleThiefDown.checked = this.permissions.thief.moveDown;
      if (this.dom.toggleThiefLeft) this.dom.toggleThiefLeft.checked = this.permissions.thief.moveLeft;
      if (this.dom.toggleThiefRight) this.dom.toggleThiefRight.checked = this.permissions.thief.moveRight;
      if (this.dom.toggleThiefCoins) this.dom.toggleThiefCoins.checked = this.permissions.thief.collectCoins;
      if (this.dom.toggleThiefTunnel) this.dom.toggleThiefTunnel.checked = this.permissions.thief.useTunnel;

      // Sincronizar checkboxes del Policía
      if (this.dom.togglePoliceUp) this.dom.togglePoliceUp.checked = this.permissions.police.moveUp;
      if (this.dom.togglePoliceDown) this.dom.togglePoliceDown.checked = this.permissions.police.moveDown;
      if (this.dom.togglePoliceLeft) this.dom.togglePoliceLeft.checked = this.permissions.police.moveLeft;
      if (this.dom.togglePoliceRight) this.dom.togglePoliceRight.checked = this.permissions.police.moveRight;
      if (this.dom.togglePoliceArrest) this.dom.togglePoliceArrest.checked = this.permissions.police.arrestThief;
      if (this.dom.togglePoliceTurbo) this.dom.togglePoliceTurbo.checked = this.permissions.police.superTurbo;

      this.updateDigitalCarnet();
      this.updateHUD();
    }

    updateDigitalCarnet() {
      // Renderizar Carnet Ladrón
      if (this.dom.badgeThiefClaims) {
        const tp = this.permissions.thief;
        this.dom.badgeThiefClaims.innerHTML = `
          <span class="claim-pill ${tp.moveUp ? 'claim-granted' : 'claim-revoked'}">⬆️ Arriba</span>
          <span class="claim-pill ${tp.moveDown ? 'claim-granted' : 'claim-revoked'}">⬇️ Abajo</span>
          <span class="claim-pill ${tp.moveLeft ? 'claim-granted' : 'claim-revoked'}">⬅️ Izq</span>
          <span class="claim-pill ${tp.moveRight ? 'claim-granted' : 'claim-revoked'}">➡️ Der</span>
          <span class="claim-pill ${tp.collectCoins ? 'claim-granted' : 'claim-revoked'}">💰 Monedas</span>
          <span class="claim-pill ${tp.useTunnel ? 'claim-granted' : 'claim-revoked'}">🌀 Túnel</span>
        `;
      }

      // Renderizar Carnet Policía
      if (this.dom.badgePoliceClaims) {
        const pp = this.permissions.police;
        this.dom.badgePoliceClaims.innerHTML = `
          <span class="claim-pill ${pp.moveUp ? 'claim-granted' : 'claim-revoked'}">⬆️ Arriba</span>
          <span class="claim-pill ${pp.moveDown ? 'claim-granted' : 'claim-revoked'}">⬇️ Abajo</span>
          <span class="claim-pill ${pp.moveLeft ? 'claim-granted' : 'claim-revoked'}">⬅️ Izq</span>
          <span class="claim-pill ${pp.moveRight ? 'claim-granted' : 'claim-revoked'}">➡️ Der</span>
          <span class="claim-pill ${pp.arrestThief ? 'claim-granted' : 'claim-revoked'}">🚨 Arrestar</span>
          <span class="claim-pill ${pp.superTurbo ? 'claim-granted' : 'claim-revoked'}">⚡ Turbo</span>
        `;
      }
    }

    // -------------------------------------------------------------------------
    // Control de Estado de Partida
    // -------------------------------------------------------------------------
    startGame() {
      this.resetGame(true);
      this.isPaused = false;
      this.isRunning = true;
      this.hideConfigPanel();
      this.playTone(523, 'square', 0.15, 0.2);
    }

    resetGame(autoStart = false) {
      this.thief.col = 1;
      this.thief.row = 1;
      this.thief.x = 1;
      this.thief.y = 1;
      this.thief.targetCol = 1;
      this.thief.targetRow = 1;
      this.thief.dir = 'RIGHT';
      this.thief.nextDir = null;
      this.thief.isMoving = false;
      this.thief.deniedEffect = null;

      this.police.col = 11;
      this.police.row = 11;
      this.police.x = 11;
      this.police.y = 11;
      this.police.targetCol = 11;
      this.police.targetRow = 11;
      this.police.dir = 'LEFT';
      this.police.nextDir = null;
      this.police.isMoving = false;
      this.police.turboActive = false;
      this.police.turboTimer = 0;
      this.police.deniedEffect = null;

      this.coins = JSON.parse(JSON.stringify(INITIAL_COINS));
      this.coinsCollected = 0;
      this.escapeDoorOpen = false;
      this.deniedAttemptsCount = 0;
      this.hideDeniedBanner();

      this.updateHUD();
      if (autoStart) {
        this.isRunning = true;
        this.isPaused = false;
      }
    }

    showConfigPanel() {
      if (this.dom.configPanel) this.dom.configPanel.classList.remove('hidden');
      this.isPaused = true;
    }

    hideConfigPanel() {
      if (this.dom.configPanel) this.dom.configPanel.classList.add('hidden');
    }

    toggleConfigPanel() {
      if (this.dom.configPanel && this.dom.configPanel.classList.contains('hidden')) {
        this.showConfigPanel();
      } else {
        this.hideConfigPanel();
        this.isPaused = false;
      }
    }

    updateHUD() {
      if (this.dom.coinsCount) {
        this.dom.coinsCount.textContent = `${this.coinsCollected} / ${this.coins.length}`;
      }
      if (this.dom.doorStatus) {
        if (this.escapeDoorOpen) {
          this.dom.doorStatus.textContent = '🚪 ABIERTA';
          this.dom.doorStatus.className = 'pac-door-status door-open';
        } else {
          this.dom.doorStatus.textContent = '🔒 Cerrada (Faltan Monedas)';
          this.dom.doorStatus.className = 'pac-door-status door-closed';
        }
      }
      if (this.dom.playerRoleBadge) {
        if (this.playerRole === 'thief') {
          this.dom.playerRoleBadge.textContent = '🟡 Eres el Ladrón';
          this.dom.playerRoleBadge.className = 'pac-player-role-badge badge-thief';
        } else {
          this.dom.playerRoleBadge.textContent = '🔵 Eres el Policía';
          this.dom.playerRoleBadge.className = 'pac-player-role-badge badge-police';
        }
      }
    }

    // -------------------------------------------------------------------------
    // Verificación Central de Permisos (RBAC Engine)
    // -------------------------------------------------------------------------
    hasPermission(role, action) {
      const perms = this.permissions[role];
      if (!perms) return false;
      return !!perms[action];
    }

    triggerDeniedFeedback(character, actionName, label) {
      this.deniedAttemptsCount++;
      character.deniedEffect = {
        label: label,
        timer: 1.2 // segundos de efecto
      };

      this.showDeniedBanner(label);
      this.playDeniedSound();
    }

    showDeniedBanner(text) {
      if (this.dom.deniedBanner && this.dom.deniedBannerText) {
        this.dom.deniedBannerText.textContent = text;
        this.dom.deniedBanner.classList.remove('hidden');
        this.dom.deniedBanner.classList.remove('pulse-flash');
        void this.dom.deniedBanner.offsetWidth; // Forzar reflow
        this.dom.deniedBanner.classList.add('pulse-flash');

        clearTimeout(this._deniedTimeout);
        this._deniedTimeout = setTimeout(() => {
          this.hideDeniedBanner();
        }, 2400);
      }
    }

    hideDeniedBanner() {
      if (this.dom.deniedBanner) {
        this.dom.deniedBanner.classList.add('hidden');
      }
    }

    // -------------------------------------------------------------------------
    // Control de Movimiento y Entrada del Jugador
    // -------------------------------------------------------------------------
    handlePlayerInput(dir) {
      const char = this.playerRole === 'thief' ? this.thief : this.police;
      const role = this.playerRole;

      // Verificar permiso del movimiento solicitado
      let permName = 'moveRight';
      let dirLabel = 'Ir a la Derecha ➡️';
      if (dir === 'UP') { permName = 'moveUp'; dirLabel = 'Ir Arriba ⬆️'; }
      else if (dir === 'DOWN') { permName = 'moveDown'; dirLabel = 'Ir Abajo ⬇️'; }
      else if (dir === 'LEFT') { permName = 'moveLeft'; dirLabel = 'Ir a la Izquierda ⬅️'; }

      if (!this.hasPermission(role, permName)) {
        this.triggerDeniedFeedback(char, permName, `🚫 ACCESO DENEGADO: Tu personaje no tiene el permiso [${dirLabel}]`);
        return;
      }

      // Si tiene permiso, establecer siguiente dirección deseada
      char.nextDir = dir;
    }

    handleTurboInput() {
      if (this.playerRole !== 'police') return;
      if (!this.hasPermission('police', 'superTurbo')) {
        this.triggerDeniedFeedback(this.police, 'superTurbo', '🚫 ACCESO DENEGADO: No tienes permiso para activar Súper Velocidad (Turbo)');
        return;
      }

      if (!this.police.turboActive) {
        this.police.turboActive = true;
        this.police.turboTimer = 3.0; // 3 segundos de turbo
        this.playSirenSound();
      }
    }

    // -------------------------------------------------------------------------
    // Inteligencia Artificial del Rival (Respeta Estrictamente sus Permisos)
    // -------------------------------------------------------------------------
    updateAI(dt) {
      this.aiTickTimer += dt;
      if (this.aiTickTimer < 0.18) return; // Ejecutar cada 180ms
      this.aiTickTimer = 0;

      const aiRole = this.playerRole === 'thief' ? 'police' : 'thief';
      const aiChar = aiRole === 'police' ? this.police : this.thief;

      // Si está en movimiento hacia una celda, esperar a llegar
      if (aiChar.isMoving) return;

      // Objetivo de la IA
      let target = { col: 1, row: 1 };
      if (aiRole === 'police') {
        // El policía persigue al ladrón
        target = { col: this.thief.col, row: this.thief.row };

        // Activar turbo autónomo si está cerca y tiene permiso
        if (this.hasPermission('police', 'superTurbo') && !this.police.turboActive) {
          const dist = Math.abs(this.police.col - this.thief.col) + Math.abs(this.police.row - this.thief.row);
          if (dist <= 4) {
            this.police.turboActive = true;
            this.police.turboTimer = 2.5;
            this.playSirenSound();
          }
        }
      } else {
        // El ladrón de la IA busca la moneda más cercana o la salida
        if (this.escapeDoorOpen) {
          target = { col: 6, row: 0 };
        } else {
          let nearest = null;
          let minD = 999;
          this.coins.forEach(c => {
            if (!c.collected) {
              const d = Math.abs(this.thief.col - c.col) + Math.abs(this.thief.row - c.row);
              if (d < minD) {
                minD = d;
                nearest = c;
              }
            }
          });
          if (nearest) target = nearest;
        }
      }

      // Buscar siguiente paso con BFS considerando ÚNICAMENTE direcciones con permiso
      const bestDir = this.findBestDirectionBFS(aiChar.col, aiChar.row, target.col, target.row, aiRole);
      if (bestDir) {
        aiChar.nextDir = bestDir;
      }
    }

    findBestDirectionBFS(startCol, startRow, targetCol, targetRow, role) {
      const directions = [
        { dir: 'UP', dc: 0, dr: -1, perm: 'moveUp' },
        { dir: 'DOWN', dc: 0, dr: 1, perm: 'moveDown' },
        { dir: 'LEFT', dc: -1, dr: 0, perm: 'moveLeft' },
        { dir: 'RIGHT', dc: 1, dr: 0, perm: 'moveRight' }
      ];

      // Filtrar direcciones que el rol tiene prohibidas
      const allowedDirs = directions.filter(d => this.hasPermission(role, d.perm));
      if (allowedDirs.length === 0) return null;

      let bestDir = null;
      let minDistance = 9999;

      allowedDirs.forEach(d => {
        let nCol = startCol + d.dc;
        let nRow = startRow + d.dr;

        // Tratar túneles
        if (nCol < 0 && startRow === 6 && this.hasPermission(role, 'useTunnel')) nCol = GRID_COLS - 1;
        if (nCol >= GRID_COLS && startRow === 6 && this.hasPermission(role, 'useTunnel')) nCol = 0;

        if (this.isWalkableCell(nCol, nRow, role)) {
          const dist = Math.abs(nCol - targetCol) + Math.abs(nRow - targetRow);
          if (dist < minDistance) {
            minDistance = dist;
            bestDir = d.dir;
          }
        }
      });

      return bestDir;
    }

    isWalkableCell(col, row, role) {
      if (row < 0 || row >= GRID_ROWS) return false;
      if (col < 0 || col >= GRID_COLS) return false;

      const cell = MAZE_GRID[row][col];
      if (cell === 1) return false; // Muro

      // Puerta de Escape (3): Solo transitable por el Ladrón si tiene todas las monedas
      if (cell === 3) {
        return role === 'thief' && this.escapeDoorOpen;
      }

      // Túnel (2): Requiere permiso useTunnel
      if (cell === 2) {
        return this.hasPermission(role, 'useTunnel');
      }

      return true;
    }

    // -------------------------------------------------------------------------
    // Bucle Principal de Juego (Game Loop)
    // -------------------------------------------------------------------------
    gameLoop(timestamp) {
      const dt = Math.min((timestamp - this.lastFrameTime) / 1000, 0.1);
      this.lastFrameTime = timestamp;

      if (this.isRunning && !this.isPaused) {
        this.updateAI(dt);
        this.updateCharacterPhysics(this.thief, 'thief', dt);
        this.updateCharacterPhysics(this.police, 'police', dt);
        this.checkCollisions();
      }

      this.render();
      requestAnimationFrame((t) => this.gameLoop(t));
    }

    updateCharacterPhysics(char, role, dt) {
      // Manejar Turbo del Policía
      let currentSpeed = char.speed;
      if (role === 'police' && char.turboActive) {
        currentSpeed *= 1.8;
        char.turboTimer -= dt;
        if (char.turboTimer <= 0) {
          char.turboActive = false;
        }
      }

      // Si no está moviéndose entre celdas, verificar si puede iniciar nuevo movimiento
      if (!char.isMoving) {
        if (char.nextDir) {
          const delta = this.getDirectionDelta(char.nextDir);
          let targetC = char.col + delta.dc;
          let targetR = char.row + delta.dr;

          // Manejo de Túnel Teletransporte
          let isTunnelJump = false;
          if (char.row === 6) {
            if (char.col === 0 && char.nextDir === 'LEFT') {
              if (this.hasPermission(role, 'useTunnel')) {
                char.col = GRID_COLS - 1;
                char.x = GRID_COLS - 1;
                this.playTeleportSound();
                return;
              } else {
                this.triggerDeniedFeedback(char, 'useTunnel', `🚫 ACCESO DENEGADO: El rol [${role === 'thief' ? 'Ladrón' : 'Policía'}] no tiene permiso para el Túnel 🌀`);
              }
            } else if (char.col === GRID_COLS - 1 && char.nextDir === 'RIGHT') {
              if (this.hasPermission(role, 'useTunnel')) {
                char.col = 0;
                char.x = 0;
                this.playTeleportSound();
                return;
              } else {
                this.triggerDeniedFeedback(char, 'useTunnel', `🚫 ACCESO DENEGADO: El rol [${role === 'thief' ? 'Ladrón' : 'Policía'}] no tiene permiso para el Túnel 🌀`);
              }
            }
          }

          if (this.isWalkableCell(targetC, targetR, role)) {
            char.dir = char.nextDir;
            char.targetCol = targetC;
            char.targetRow = targetR;
            char.isMoving = true;
          } else {
            // Si la celda es puerta cerrada
            if (MAZE_GRID[targetR] && MAZE_GRID[targetR][targetC] === 3 && !this.escapeDoorOpen) {
              if (role === 'thief') {
                this.showDeniedBanner('🔒 Puerta de Escape Bloqueada: ¡Recoge las 5 monedas primero!');
              }
            }
          }
        }
      }

      // Interpolar posición continua suave
      if (char.isMoving) {
        const dx = char.targetCol - char.x;
        const dy = char.targetRow - char.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const step = currentSpeed * dt;

        if (dist <= step) {
          char.x = char.targetCol;
          char.y = char.targetRow;
          char.col = char.targetCol;
          char.row = char.targetRow;
          char.isMoving = false;
          this.onCellReached(char, role);
        } else {
          char.x += (dx / dist) * step;
          char.y += (dy / dist) * step;
        }
      }

      // Decrementar temporizador de feedback denegado
      if (char.deniedEffect) {
        char.deniedEffect.timer -= dt;
        if (char.deniedEffect.timer <= 0) {
          char.deniedEffect = null;
        }
      }
    }

    getDirectionDelta(dir) {
      switch (dir) {
        case 'UP': return { dc: 0, dr: -1 };
        case 'DOWN': return { dc: 0, dr: 1 };
        case 'LEFT': return { dc: -1, dr: 0 };
        case 'RIGHT': return { dc: 1, dr: 0 };
        default: return { dc: 0, dr: 0 };
      }
    }

    onCellReached(char, role) {
      // 1. Recolección de Monedas por el Ladrón
      if (role === 'thief') {
        const coin = this.coins.find(c => !c.collected && c.col === char.col && c.row === char.row);
        if (coin) {
          if (this.hasPermission('thief', 'collectCoins')) {
            coin.collected = true;
            this.coinsCollected++;
            this.playCoinSound();
            this.updateHUD();

            if (this.coinsCollected === this.coins.length) {
              this.escapeDoorOpen = true;
              this.playTone(880, 'sine', 0.3, 0.2);
              this.showDeniedBanner('🚪 ¡PUERTA DE ESCAPE ABIERTA! Corre a la salida en la parte superior');
              this.updateHUD();
            }
          } else {
            this.triggerDeniedFeedback(this.thief, 'collectCoins', '🚫 ACCESO DENEGADO: ¡El Ladrón no tiene permiso para recoger monedas!');
          }
        }

        // 2. Llegada a la Puerta de Escape
        if (char.col === 6 && char.row === 0 && this.escapeDoorOpen) {
          this.triggerThiefEscapeVictory();
        }
      }
    }

    checkCollisions() {
      // Calcular distancia euclidiana entre Policía y Ladrón
      const dx = this.police.x - this.thief.x;
      const dy = this.police.y - this.thief.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 0.75) {
        // Hay contacto físico
        if (this.hasPermission('police', 'arrestThief')) {
          this.triggerArrestVictory();
        } else {
          // El policía no tiene permiso de arresto: se pasan de largo
          if (!this._arrestDeniedThrottle) {
            this._arrestDeniedThrottle = true;
            this.triggerDeniedFeedback(this.police, 'arrestThief', '👮‍♂️ ¡El Policía no tiene permiso de arresto! Pasaron de largo sin detener al Ladrón.');
            setTimeout(() => { this._arrestDeniedThrottle = false; }, 3000);
          }
        }
      }
    }

    // -------------------------------------------------------------------------
    // Finales Educativos de Partida
    // -------------------------------------------------------------------------
    triggerArrestVictory() {
      this.isRunning = false;
      this.isPaused = true;
      this.playSirenSound();

      if (this.playerRole === 'police') {
        // Ganó el jugador Policía
        this.openVictoryModal(
          '¡Ladrón Arrestado con Éxito!',
          'Demostraste el poder de los permisos en tu Rol',
          `Como Policía, tenías activo el permiso <strong>[🚨 Arrestar al Ladrón]</strong>. Al interceptar al infractor en el laberinto, el sistema validó tu permiso y ejecutó la orden de captura de inmediato.`
        );
      } else {
        // Perdió el jugador Ladrón
        let reason = 'El Policía te alcanzó y tenía permiso legal de arresto.';
        if (!this.permissions.thief.moveRight) {
          reason = `Intentaste huir, pero tu personaje <strong>NO tenía el permiso [Ir a la Derecha ➡️]</strong>. Al chocar contra el candado rojo 🔒 perdiste segundos valiosos y te atraparon. ¡Vuelve al panel, activa el permiso y vuelve a intentarlo!`;
        }
        this.openGameOverModal(
          '¡Te Atrapó la Policía!',
          'Revisa la configuración de tus permisos',
          reason
        );
      }
    }

    triggerThiefEscapeVictory() {
      this.isRunning = false;
      this.isPaused = true;
      this.playVictorySound();

      if (this.playerRole === 'thief') {
        this.openVictoryModal(
          '¡Escape Legendario Completado!',
          'Recolectaste el botín y saliste por la puerta',
          `Tus permisos de <strong>[💰 Recoger Monedas]</strong> y movilidad te permitieron reunir los 5 tesoros y desbloquear la puerta de escape. ¡Un gran ejemplo de permisos bien asignados!`
        );
      } else {
        this.openGameOverModal(
          '¡El Ladrón Escapó!',
          'El infractor completó su misión antes de que lo atraparas',
          `El Ladrón logró recolectar todas las monedas y salir por la compuerta. Recuerda que puedes activar el permiso de <strong>[⚡ Súper Velocidad (Turbo)]</strong> para moverte más rápido con la barra espaciadora.`
        );
      }
    }

    // -------------------------------------------------------------------------
    // Modales Educativos
    // -------------------------------------------------------------------------
    openVictoryModal(title, subtitle, reason) {
      if (this.dom.victoryTitle) this.dom.victoryTitle.textContent = title;
      if (this.dom.victorySubtitle) this.dom.victorySubtitle.textContent = subtitle;
      if (this.dom.victoryReason) this.dom.victoryReason.innerHTML = reason;
      if (this.dom.modalVictory) this.dom.modalVictory.classList.add('active');
    }

    closeVictoryModal() {
      if (this.dom.modalVictory) this.dom.modalVictory.classList.remove('active');
    }

    openGameOverModal(title, subtitle, reason) {
      if (this.dom.gameoverTitle) this.dom.gameoverTitle.textContent = title;
      if (this.dom.gameoverSubtitle) this.dom.gameoverSubtitle.textContent = subtitle;
      if (this.dom.gameoverReason) this.dom.gameoverReason.innerHTML = reason;
      if (this.dom.modalGameOver) this.dom.modalGameOver.classList.add('active');
    }

    closeGameOverModal() {
      if (this.dom.modalGameOver) this.dom.modalGameOver.classList.remove('active');
    }

    openGuideModal() {
      if (this.dom.modalGuide) this.dom.modalGuide.classList.add('active');
      this.isPaused = true;
    }

    closeGuideModal() {
      if (this.dom.modalGuide) this.dom.modalGuide.classList.remove('active');
      this.isPaused = false;
    }

    // -------------------------------------------------------------------------
    // Renderizado Gráfico 2D Pixel Art
    // -------------------------------------------------------------------------
    render() {
      if (!this.ctx || !this.canvas) return;
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      const cellSize = w / GRID_COLS; // 40px

      // 1. Fondo Oscuro Retro Arcade
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, w, h);

      // 2. Dibujar Laberinto (Muros, Túneles y Puerta)
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          const cell = MAZE_GRID[r][c];
          const x = c * cellSize;
          const y = r * cellSize;

          if (cell === 1) {
            // Muro Neón Azul Pac-Man
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(x, y, cellSize, cellSize);

            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#2563eb';
            ctx.strokeRect(x + 2, y + 2, cellSize - 4, cellSize - 4);

            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(96, 165, 250, 0.4)';
            ctx.strokeRect(x + 5, y + 5, cellSize - 10, cellSize - 10);
          } else if (cell === 2) {
            // Túnel Lateral (Borde izquierdo o derecho)
            const tunnelAllowed = this.permissions.thief.useTunnel;
            if (tunnelAllowed) {
              // Vórtice verde neón activo
              ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
              ctx.fillRect(x, y, cellSize, cellSize);

              ctx.strokeStyle = '#10b981';
              ctx.lineWidth = 2;
              ctx.strokeRect(x + 2, y + 2, cellSize - 4, cellSize - 4);

              // Dibujar espiral o icono
              ctx.font = `${cellSize * 0.55}px Outfit, sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('🌀', x + cellSize / 2, y + cellSize / 2);
            } else {
              // Reja con candado rojo
              ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
              ctx.fillRect(x, y, cellSize, cellSize);

              ctx.strokeStyle = '#ef4444';
              ctx.lineWidth = 2;
              ctx.strokeRect(x + 2, y + 2, cellSize - 4, cellSize - 4);

              // Icono de candado rojo
              ctx.font = `${cellSize * 0.55}px Outfit, sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('🔒', x + cellSize / 2, y + cellSize / 2);
            }
          } else if (cell === 3) {
            // Puerta de Escape
            if (this.escapeDoorOpen) {
              ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
              ctx.fillRect(x, y, cellSize, cellSize);

              ctx.strokeStyle = '#34d399';
              ctx.lineWidth = 3;
              ctx.strokeRect(x + 2, y + 2, cellSize - 4, cellSize - 4);

              ctx.font = `${cellSize * 0.6}px Outfit, sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('🚪', x + cellSize / 2, y + cellSize / 2);
            } else {
              ctx.fillStyle = 'rgba(71, 85, 105, 0.4)';
              ctx.fillRect(x, y, cellSize, cellSize);

              ctx.strokeStyle = '#64748b';
              ctx.lineWidth = 2;
              ctx.strokeRect(x + 2, y + 2, cellSize - 4, cellSize - 4);

              ctx.font = `${cellSize * 0.55}px Outfit, sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('🔒', x + cellSize / 2, y + cellSize / 2);
            }
          } else {
            // Camino libre: punto tenue de navegación estilo Pac-Man
            ctx.fillStyle = 'rgba(148, 163, 184, 0.15)';
            ctx.beginPath();
            ctx.arc(x + cellSize / 2, y + cellSize / 2, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 3. Dibujar Monedas Doradas Brillantes 🪙
      const now = Date.now();
      const coinPulse = Math.sin(now * 0.006) * 1.5;
      this.coins.forEach(c => {
        if (!c.collected) {
          const cx = c.col * cellSize + cellSize / 2;
          const cy = c.row * cellSize + cellSize / 2;
          const radius = (cellSize * 0.28) + coinPulse;

          // Resplandor dorado
          ctx.save();
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Símbolo central
          ctx.fillStyle = '#78350f';
          ctx.font = `bold ${cellSize * 0.3}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('$', cx, cy);
          ctx.restore();
        }
      });

      // 4. Dibujar Sprite del Ladrón 🟡 (Pixel Art)
      this.drawThiefSprite(ctx, this.thief.x * cellSize, this.thief.y * cellSize, cellSize);

      // 5. Dibujar Sprite del Policía 🔵 (Pixel Art)
      this.drawPoliceSprite(ctx, this.police.x * cellSize, this.police.y * cellSize, cellSize);

      // 6. Dibujar Efectos de Candado Flotante por Falta de Permiso 🔒
      if (this.thief.deniedEffect) {
        this.drawDeniedLock(ctx, this.thief.x * cellSize, this.thief.y * cellSize, cellSize);
      }
      if (this.police.deniedEffect) {
        this.drawDeniedLock(ctx, this.police.x * cellSize, this.police.y * cellSize, cellSize);
      }
    }

    // Dibujo Procedimental Pixel Art del Ladrón (Amarillo con Antifaz)
    drawThiefSprite(ctx, x, y, size) {
      const p = size / 16; // Cuadrícula de 16x16 píxeles
      ctx.save();
      ctx.translate(x, y);

      // Sombra proyectada
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(size / 2, size - 2 * p, 6 * p, 3 * p, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cuerpo Amarillo Redondo
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, 6.5 * p, 0, Math.PI * 2);
      ctx.fill();

      // Gorro / Parte superior
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(size / 2 - 5 * p, size / 2 - 7 * p, 10 * p, 3 * p);

      // Antifaz Negro
      ctx.fillStyle = '#090d16';
      ctx.fillRect(size / 2 - 6 * p, size / 2 - 2 * p, 12 * p, 4 * p);

      // Ojos Blancos con pupilas que miran según dirección
      ctx.fillStyle = '#ffffff';
      let eyeOffX = 0;
      let eyeOffY = 0;
      if (this.thief.dir === 'LEFT') eyeOffX = -1.5 * p;
      if (this.thief.dir === 'RIGHT') eyeOffX = 1.5 * p;
      if (this.thief.dir === 'UP') eyeOffY = -1 * p;
      if (this.thief.dir === 'DOWN') eyeOffY = 1 * p;

      ctx.fillRect(size / 2 - 4 * p + eyeOffX, size / 2 - 1 * p + eyeOffY, 2.5 * p, 2.5 * p);
      ctx.fillRect(size / 2 + 1.5 * p + eyeOffX, size / 2 - 1 * p + eyeOffY, 2.5 * p, 2.5 * p);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(size / 2 - 3 * p + eyeOffX, size / 2 - 0.5 * p + eyeOffY, 1.2 * p, 1.5 * p);
      ctx.fillRect(size / 2 + 2.5 * p + eyeOffX, size / 2 - 0.5 * p + eyeOffY, 1.2 * p, 1.5 * p);

      // Bolsa de Botín en la espalda si tiene monedas
      if (this.coinsCollected > 0) {
        ctx.fillStyle = '#854d0e';
        ctx.beginPath();
        ctx.arc(size / 2 - 6 * p, size / 2 + 3 * p, 3 * p, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.font = `${4 * p}px monospace`;
        ctx.fillText('$', size / 2 - 7 * p, size / 2 + 4.5 * p);
      }

      ctx.restore();
    }

    // Dibujo Procedimental Pixel Art del Policía (Azul con Sirena Titilante)
    drawPoliceSprite(ctx, x, y, size) {
      const p = size / 16;
      ctx.save();
      ctx.translate(x, y);

      // Sombra
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(size / 2, size - 2 * p, 6 * p, 3 * p, 0, 0, Math.PI * 2);
      ctx.fill();

      // Aura de Turbo si está activo
      if (this.police.turboActive) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2 * p;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, 8.5 * p, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Cuerpo Uniforme Azul
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, 6.5 * p, 0, Math.PI * 2);
      ctx.fill();

      // Gorra de Policía con Visera
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(size / 2 - 6 * p, size / 2 - 6 * p, 12 * p, 4 * p);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(size / 2 - 7 * p, size / 2 - 3 * p, 14 * p, 2 * p);

      // Placa Dorada en la Gorra
      ctx.fillStyle = '#facc15';
      ctx.fillRect(size / 2 - 1.5 * p, size / 2 - 5.5 * p, 3 * p, 2.5 * p);

      // Ojos del Policía
      let eyeOffX = 0;
      let eyeOffY = 0;
      if (this.police.dir === 'LEFT') eyeOffX = -1.5 * p;
      if (this.police.dir === 'RIGHT') eyeOffX = 1.5 * p;
      if (this.police.dir === 'UP') eyeOffY = -1 * p;
      if (this.police.dir === 'DOWN') eyeOffY = 1 * p;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(size / 2 - 4 * p + eyeOffX, size / 2 + eyeOffY, 2.5 * p, 2.5 * p);
      ctx.fillRect(size / 2 + 1.5 * p + eyeOffX, size / 2 + eyeOffY, 2.5 * p, 2.5 * p);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(size / 2 - 3 * p + eyeOffX, size / 2 + 0.5 * p + eyeOffY, 1.2 * p, 1.5 * p);
      ctx.fillRect(size / 2 + 2.5 * p + eyeOffX, size / 2 + 0.5 * p + eyeOffY, 1.2 * p, 1.5 * p);

      // Sirena Titilante Arriba (Alterna Rojo y Azul)
      const flashRed = Math.floor(Date.now() / 150) % 2 === 0;
      ctx.fillStyle = flashRed ? '#ef4444' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2 - 7.5 * p, 2.5 * p, 0, Math.PI * 2);
      ctx.fill();

      // Destello de la sirena
      ctx.strokeStyle = flashRed ? 'rgba(239, 68, 68, 0.6)' : 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 1.5 * p;
      ctx.stroke();

      ctx.restore();
    }

    // Candado Rojo Animado sobre la cabeza cuando se niega un permiso 🔒
    drawDeniedLock(ctx, x, y, size) {
      const p = size / 16;
      const wobble = Math.sin(Date.now() * 0.02) * 2 * p;
      ctx.save();
      ctx.translate(x + size / 2 + wobble, y - 4 * p);

      // Círculo de advertencia rojo
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 0, 7 * p, 0, Math.PI * 2);
      ctx.fill();

      // Icono candado blanco
      ctx.font = `${8 * p}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔒', 0, 0);

      ctx.restore();
    }
  }

  // Exponer e inicializar globalmente
  window.PacRolesGame = PacRolesGame;

  document.addEventListener('DOMContentLoaded', () => {
    window.pacRolesInstance = new PacRolesGame();
  });
})();
