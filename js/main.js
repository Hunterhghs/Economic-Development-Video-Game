/**
 * main.js — Game bootstrap, loop, and state management
 */
(function () {
    'use strict';

    const SAVE_KEY = 'lagos_econ_sim_save';
    let gameStarted = false;

    // ===== INTRO =====
    function setupIntro() {
        // Particles
        const particleContainer = document.getElementById('intro-particles');
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 6 + 's';
            p.style.animationDuration = (4 + Math.random() * 4) + 's';
            p.style.width = (2 + Math.random() * 3) + 'px';
            p.style.height = p.style.width;
            p.style.opacity = 0.2 + Math.random() * 0.5;
            particleContainer.appendChild(p);
        }

        // Check for saved game
        if (localStorage.getItem(SAVE_KEY)) {
            document.getElementById('btn-load-game').style.display = 'inline-flex';
            document.getElementById('btn-load-game').addEventListener('click', () => {
                loadGame();
                startGame(false);
            });
        }

        document.getElementById('btn-start-game').addEventListener('click', () => {
            GameEngine.init();
            Events.reset();
            startGame(true);
        });
    }

    // ===== START GAME =====
    function startGame(showTutorial) {
        gameStarted = true;
        const intro = document.getElementById('intro-screen');
        intro.style.transition = 'opacity 0.6s ease';
        intro.style.opacity = '0';
        setTimeout(() => {
            intro.classList.add('hidden');
            document.getElementById('game-container').classList.remove('hidden');
            UI.init();
            UI.fullUpdate(GameEngine.getState());
            if (showTutorial) showTutorial_();
        }, 600);
    }

    // ===== TUTORIAL =====
    const TUTORIAL_STEPS = [
        { title: '🏙️ Welcome to Lagos!', text: 'You are the Economic Development Director of Lagos, Nigeria. Your mission: transform this vibrant megacity into Africa\'s most prosperous economic hub over 30 years (2025–2055).' },
        { title: '🗺️ The Map', text: 'On the left, you\'ll see Lagos divided into 6 districts. Click any district to view its stats and specialization. Switch between Development, Economy, and Population views.' },
        { title: '📊 The Dashboard', text: 'The right panel shows your key performance indicators (KPIs). Track GDP, employment, HDI, and more. Use the tabs to explore sectors and districts in detail.' },
        { title: '📋 Making Decisions', text: 'Each year, you\'ll allocate your budget to policies and investments. Choose wisely — every decision shapes Lagos\'s future. Some policies unlock in later years.' },
        { title: '⚡ Random Events', text: 'Expect the unexpected! Oil price shocks, tech booms, floods, and elections will test your leadership. Every event gives you choices with real consequences.' },
        { title: '🎯 Your Goal', text: 'Maximize your score by growing GDP, improving employment, raising the Human Development Index, and keeping citizens satisfied. Good luck, Director!' }
    ];

    let tutorialStep = 0;

    function showTutorial_() {
        tutorialStep = 0;
        const overlay = document.getElementById('tutorial-overlay');
        overlay.classList.remove('hidden');
        renderTutorialStep();

        document.getElementById('btn-tutorial-next').addEventListener('click', () => {
            tutorialStep++;
            if (tutorialStep >= TUTORIAL_STEPS.length) {
                overlay.classList.add('hidden');
                UI.toast('Welcome!', 'Click "Advance Year" to begin your first turn.', 'info');
            } else {
                renderTutorialStep();
            }
        });

        document.getElementById('btn-tutorial-skip').addEventListener('click', () => {
            overlay.classList.add('hidden');
            UI.toast('Welcome!', 'Click "Advance Year" to begin your first turn.', 'info');
        });
    }

    function renderTutorialStep() {
        const step = TUTORIAL_STEPS[tutorialStep];
        document.getElementById('tutorial-title').textContent = step.title;
        document.getElementById('tutorial-text').textContent = step.text;

        const indicator = document.getElementById('tutorial-step-indicator');
        indicator.innerHTML = TUTORIAL_STEPS.map((_, i) =>
            `<div class="step-dot ${i === tutorialStep ? 'active' : ''}"></div>`
        ).join('');
    }

    // ===== TURN FLOW =====
    function advanceTurn() {
        const state = GameEngine.getState();
        if (state.turn > state.maxTurns) {
            UI.showGameOver(state);
            return;
        }

        // Step 1: Show policy modal
        UI.showPolicyModal(state.budget, state.turn, state.activePolicies, (selectedPolicies) => {
            // Step 2: Check for random event
            if (Events.shouldTriggerEvent()) {
                const event = Events.getRandomEvent(state.turn);
                UI.showEvent(event, (eventEffects) => {
                    // Step 3: Apply and advance
                    finalizeTurn(selectedPolicies, eventEffects);
                });
            } else {
                finalizeTurn(selectedPolicies, null);
            }
        });
    }

    function finalizeTurn(policies, eventEffects) {
        // Apply district boosts from policies
        if (policies.length > 0) {
            Districts.boostAllDistricts(policies.length * 0.8);
            // Boost specific districts based on policy category
            policies.forEach(p => {
                if (p.category === 'trade') Districts.boostDistrict('apapa', 2);
                if (p.category === 'technology') Districts.boostDistrict('victoria-island', 2);
                if (p.category === 'technology') Districts.boostDistrict('mainland', 1.5);
                if (p.category === 'infrastructure') Districts.boostDistrict('ikeja', 2);
                if (p.category === 'housing') Districts.boostDistrict('lekki', 2);
                if (p.category === 'tourism') Districts.boostDistrict('lagos-island', 2);
            });
        }

        const newState = GameEngine.advanceTurn(policies, eventEffects);

        // Notifications
        if (policies.length > 0) {
            UI.toast('Policies Enacted', `${policies.length} policy decisions implemented.`, 'success');
        }

        if (newState.publicSatisfaction < 30) {
            UI.toast('Warning', 'Public satisfaction is critically low!', 'danger');
        }
        if (newState.employmentRate < 50) {
            UI.toast('Employment Crisis', 'Unemployment is reaching dangerous levels.', 'warning');
        }

        // Milestone toasts
        if (newState.gdp > 200 && newState.history.gdp[newState.history.gdp.length - 2] <= 200) {
            UI.toast('🎉 Milestone!', 'Lagos GDP has exceeded $200 Billion!', 'success');
        }
        if (newState.hdi > 0.75 && newState.history.hdi[newState.history.hdi.length - 2] <= 0.75) {
            UI.toast('🎉 Milestone!', 'Lagos HDI has reached High Development!', 'success');
        }

        UI.fullUpdate(newState);
        saveGame();

        // Game over check
        if (newState.turn > newState.maxTurns) {
            setTimeout(() => UI.showGameOver(newState), 1000);
        }
    }

    // ===== SAVE / LOAD =====
    function saveGame() {
        const state = GameEngine.getState();
        const districts = Districts.getAll().map(d => ({ id: d.id, devLevel: d.devLevel }));
        localStorage.setItem(SAVE_KEY, JSON.stringify({ state, districts }));
    }

    function loadGame() {
        try {
            const data = JSON.parse(localStorage.getItem(SAVE_KEY));
            if (data && data.state) {
                GameEngine.setState(data.state);
                if (data.districts) {
                    data.districts.forEach(sd => {
                        const d = Districts.getById(sd.id);
                        if (d) d.devLevel = sd.devLevel;
                    });
                }
            }
        } catch (e) {
            console.error('Failed to load save:', e);
            GameEngine.init();
        }
    }

    // ===== BIND CONTROLS =====
    function bindControls() {
        document.getElementById('btn-next-turn').addEventListener('click', advanceTurn);
        document.getElementById('btn-close-district').addEventListener('click', () => UI.hideDistrictDetail());

        document.getElementById('btn-play-again').addEventListener('click', () => {
            localStorage.removeItem(SAVE_KEY);
            document.getElementById('gameover-screen').classList.add('hidden');
            document.getElementById('game-container').classList.add('hidden');
            document.getElementById('intro-screen').classList.remove('hidden');
            document.getElementById('intro-screen').style.opacity = '1';
            gameStarted = false;
        });
    }

    // ===== BOOT =====
    document.addEventListener('DOMContentLoaded', () => {
        setupIntro();
        bindControls();
    });
})();
