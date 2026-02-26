/**
 * ui.js — UI controllers for panels, HUD, modals, notifications
 */
const UI = (() => {
    let currentMapView = 'development';
    let tooltipEl = null;

    function init() {
        setupTabs();
        setupMapControls();
        createTooltip();
    }

    // ===== TABS =====
    function setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
            });
        });
    }

    // ===== MAP CONTROLS =====
    function setupMapControls() {
        document.querySelectorAll('.map-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.map-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentMapView = btn.dataset.view;
                Districts.renderMap(document.getElementById('lagos-map'), currentMapView);
            });
        });
    }

    // ===== HUD =====
    function updateHUD(state) {
        document.getElementById('hud-year').textContent = state.year;
        document.getElementById('hud-budget').textContent = '₦' + state.budget.toFixed(1) + 'B';
        document.getElementById('hud-score').textContent = state.score.toLocaleString();
        document.getElementById('turn-number').textContent = state.turn;
        document.getElementById('timeline-slider').value = state.year;
    }

    // ===== KPI GRID =====
    function renderKPIs(state) {
        const grid = document.getElementById('kpi-grid');
        const kpis = [
            { label: 'GDP', value: '$' + state.gdp.toFixed(1) + 'B', history: state.history.gdp, color: '#00c77b' },
            { label: 'GDP Per Capita', value: '$' + state.gdpPerCapita.toLocaleString(), history: null, color: '#f5c542' },
            { label: 'Population', value: state.population.toFixed(1) + 'M', history: state.history.population, color: '#00b4d8' },
            { label: 'Employment', value: state.employmentRate.toFixed(1) + '%', history: state.history.employmentRate, color: '#8b5cf6' },
            { label: 'FDI Inflow', value: '$' + state.fdiInflow.toFixed(1) + 'B', history: state.history.fdi, color: '#f59e0b' },
            { label: 'HDI', value: state.hdi.toFixed(3), history: state.history.hdi, color: '#3b82f6' },
            { label: 'Infrastructure', value: state.infraScore.toFixed(0) + '/100', history: state.history.infraScore, color: '#ef4444' },
            { label: 'Satisfaction', value: state.publicSatisfaction.toFixed(0) + '%', history: state.history.satisfaction, color: '#00c77b' }
        ];

        grid.innerHTML = kpis.map((k, i) => {
            const prev = k.history && k.history.length > 1 ? k.history[k.history.length - 2] : null;
            const curr = k.history ? k.history[k.history.length - 1] : null;
            let changeHTML = '';
            if (prev !== null && curr !== null) {
                const diff = curr - prev;
                const pct = prev !== 0 ? ((diff / prev) * 100).toFixed(1) : '0.0';
                const cls = diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'neutral';
                const arrow = diff > 0 ? '↑' : diff < 0 ? '↓' : '→';
                changeHTML = `<div class="kpi-change ${cls}">${arrow} ${Math.abs(pct)}%</div>`;
            }
            let sparkHTML = '';
            if (k.history && k.history.length > 1) {
                sparkHTML = `<div class="kpi-sparkline"><canvas id="spark-${i}" width="160" height="30"></canvas></div>`;
            }
            return `<div class="kpi-card">
                <div class="kpi-label">${k.label}</div>
                <div class="kpi-value">${k.value}</div>
                ${changeHTML}
                ${sparkHTML}
            </div>`;
        }).join('');

        // Draw sparklines
        kpis.forEach((k, i) => {
            if (k.history && k.history.length > 1) {
                drawSparkline(`spark-${i}`, k.history, k.color);
            }
        });
    }

    function drawSparkline(canvasId, data, color) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const min = Math.min(...data) * 0.95;
        const max = Math.max(...data) * 1.05;
        const range = max - min || 1;

        // Gradient fill
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, color + '40');
        grad.addColorStop(1, color + '05');

        ctx.beginPath();
        ctx.moveTo(0, h);
        data.forEach((v, i) => {
            const x = (i / (data.length - 1)) * w;
            const y = h - ((v - min) / range) * h;
            ctx.lineTo(x, y);
        });
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Line
        ctx.beginPath();
        data.forEach((v, i) => {
            const x = (i / (data.length - 1)) * w;
            const y = h - ((v - min) / range) * h;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // End dot
        const lastX = w;
        const lastY = h - ((data[data.length - 1] - min) / range) * h;
        ctx.beginPath();
        ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }

    // ===== CHARTS =====
    function renderGDPChart(state) {
        const canvas = document.getElementById('gdp-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const data = state.history.gdp;
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        if (data.length < 2) return;
        const min = Math.min(...data) * 0.9;
        const max = Math.max(...data) * 1.1;
        const range = max - min || 1;

        // Grid
        ctx.strokeStyle = 'rgba(148,163,184,0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            const y = (i / 4) * h;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // Area
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(0,199,123,0.3)');
        grad.addColorStop(1, 'rgba(0,199,123,0.02)');
        ctx.beginPath();
        ctx.moveTo(0, h);
        data.forEach((v, i) => {
            const x = (i / (data.length - 1)) * w;
            const y = h - ((v - min) / range) * h;
            ctx.lineTo(x, y);
        });
        ctx.lineTo(w, h);
        ctx.fillStyle = grad;
        ctx.fill();

        // Line
        ctx.beginPath();
        data.forEach((v, i) => {
            const x = (i / (data.length - 1)) * w;
            const y = h - ((v - min) / range) * h;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#00c77b';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Labels
        ctx.fillStyle = 'rgba(148,163,184,0.6)';
        ctx.font = '10px Inter';
        ctx.fillText('$' + min.toFixed(0) + 'B', 4, h - 4);
        ctx.fillText('$' + max.toFixed(0) + 'B', 4, 12);
    }

    function renderSectorChart(state) {
        const canvas = document.getElementById('sector-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const sectors = state.sectors;
        const keys = Object.keys(sectors);
        const colors = ['#00c77b', '#f5c542', '#00b4d8', '#8b5cf6', '#f59e0b', '#3b82f6', '#ef4444', '#10b981', '#ec4899', '#6366f1'];
        const barW = (w - 20) / keys.length;

        keys.forEach((k, i) => {
            const val = sectors[k];
            const barH = (val / 100) * (h - 30);
            const x = 10 + i * barW;
            const y = h - 20 - barH;

            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.roundRect(x + 2, y, barW - 4, barH, [3, 3, 0, 0]);
            ctx.fill();

            ctx.fillStyle = 'rgba(148,163,184,0.5)';
            ctx.font = '8px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(k.slice(0, 4), x + barW / 2, h - 6);
            ctx.fillText(val.toFixed(0), x + barW / 2, y - 4);
        });
    }

    // ===== SECTOR LIST =====
    function renderSectorList(state) {
        const list = document.getElementById('sector-list');
        const colors = { infrastructure: '#00c77b', education: '#f5c542', healthcare: '#00b4d8', technology: '#8b5cf6', manufacturing: '#f59e0b', trade: '#3b82f6', tourism: '#ef4444', housing: '#10b981', energy: '#ec4899', security: '#6366f1' };
        const icons = { infrastructure: '🏗️', education: '🎓', healthcare: '🏥', technology: '💻', manufacturing: '🏭', trade: '🚢', tourism: '🌴', housing: '🏘️', energy: '⚡', security: '🛡️' };

        list.innerHTML = Object.entries(state.sectors).map(([key, val]) => {
            const c = colors[key] || '#00c77b';
            return `<div class="sector-item">
                <div class="sector-icon" style="background:${c}20;color:${c}">${icons[key] || '📊'}</div>
                <div class="sector-info">
                    <div class="sector-name">${capitalize(key)}</div>
                    <div class="sector-bar-container">
                        <div class="sector-bar" style="width:${val}%;background:${c}"></div>
                    </div>
                </div>
                <div class="sector-value">${val.toFixed(0)}</div>
            </div>`;
        }).join('');
    }

    // ===== DISTRICT LIST =====
    function renderDistrictList() {
        const list = document.getElementById('district-list');
        const districts = Districts.getAll();
        const state = GameEngine.getState();

        list.innerHTML = districts.map(d => {
            const econ = GameEngine.getDistrictEconomy(d.id);
            return `<div class="district-item" data-id="${d.id}">
                <div class="district-color" style="background:${d.color}"></div>
                <div class="district-info">
                    <div class="district-name">${d.name}</div>
                    <div class="district-desc">${d.description}</div>
                </div>
                <div class="district-stats">
                    <div class="district-stat">
                        <div class="district-stat-value">${econ ? '$' + econ.gdp + 'B' : '—'}</div>
                        <div class="district-stat-label">GDP</div>
                    </div>
                    <div class="district-stat">
                        <div class="district-stat-value">Lv${Math.round(d.devLevel)}</div>
                        <div class="district-stat-label">Dev</div>
                    </div>
                </div>
            </div>`;
        }).join('');

        list.querySelectorAll('.district-item').forEach(el => {
            el.addEventListener('click', () => showDistrictDetail(el.dataset.id));
        });
    }

    // ===== DISTRICT DETAIL MODAL =====
    function showDistrictDetail(districtId) {
        const d = Districts.getById(districtId);
        if (!d) return;
        Districts.select(districtId);
        Districts.renderMap(document.getElementById('lagos-map'), currentMapView);

        const econ = GameEngine.getDistrictEconomy(districtId);
        const state = GameEngine.getState();

        document.getElementById('district-detail-name').textContent = d.name;
        const content = document.getElementById('district-detail-content');

        const sectorColors = ['#00c77b', '#f5c542', '#00b4d8', '#8b5cf6', '#f59e0b', '#3b82f6', '#ef4444', '#10b981', '#ec4899', '#6366f1'];
        const sectorKeys = Object.keys(state.sectors);

        content.innerHTML = `
            <p style="color:var(--text-muted);margin-bottom:var(--gap-lg)">${d.description} — Specialization: <strong style="color:${d.color}">${d.specialization}</strong></p>
            <div class="district-detail-grid">
                <div class="detail-stat"><div class="detail-stat-value">$${econ ? econ.gdp : '—'}B</div><div class="detail-stat-label">District GDP</div></div>
                <div class="detail-stat"><div class="detail-stat-value">${econ ? econ.population : '—'}M</div><div class="detail-stat-label">Population</div></div>
                <div class="detail-stat"><div class="detail-stat-value">${econ ? econ.employment.toFixed(0) : '—'}%</div><div class="detail-stat-label">Employment</div></div>
                <div class="detail-stat"><div class="detail-stat-value">${Math.round(d.devLevel)}</div><div class="detail-stat-label">Dev Level</div></div>
                <div class="detail-stat"><div class="detail-stat-value">${econ ? econ.infrastructure.toFixed(0) : '—'}</div><div class="detail-stat-label">Infra Score</div></div>
                <div class="detail-stat"><div class="detail-stat-value">${(d.gdpShare * 100).toFixed(0)}%</div><div class="detail-stat-label">GDP Share</div></div>
            </div>
            <div class="district-sector-bars">
                <h4>Sector Strength</h4>
                ${sectorKeys.map((s, i) => `
                    <div class="d-sector-row">
                        <span class="d-sector-name">${capitalize(s)}</span>
                        <div class="d-sector-bar-bg"><div class="d-sector-bar-fill" style="width:${state.sectors[s]}%;background:${sectorColors[i]}"></div></div>
                        <span class="d-sector-val">${state.sectors[s].toFixed(0)}</span>
                    </div>`).join('')}
            </div>`;

        document.getElementById('district-modal').classList.remove('hidden');
    }

    function hideDistrictDetail() {
        document.getElementById('district-modal').classList.add('hidden');
        Districts.deselect();
        Districts.renderMap(document.getElementById('lagos-map'), currentMapView);
    }

    // ===== EVENT MODAL =====
    function showEvent(event, callback) {
        const modal = document.getElementById('event-modal');
        document.getElementById('event-icon').textContent = event.icon;
        document.getElementById('event-tag').textContent = event.tag;
        document.getElementById('event-title').textContent = event.title;
        document.getElementById('event-description').textContent = event.desc;

        document.getElementById('event-effects').innerHTML = '';
        document.getElementById('event-choices').innerHTML = event.choices.map((c, i) => `
            <button class="event-choice-btn" data-choice="${i}">
                <span class="choice-label">${c.label}</span>
                <span class="choice-desc">${c.desc}</span>
            </button>`).join('');

        modal.classList.remove('hidden');

        modal.querySelectorAll('.event-choice-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.choice);
                modal.classList.add('hidden');
                callback(event.choices[idx].effects);
            });
        });
    }

    // ===== POLICY MODAL =====
    function showPolicyModal(budget, turn, activePolicies, callback) {
        const modal = document.getElementById('policy-modal');
        let remaining = budget;
        let selected = [];

        document.getElementById('policy-budget-remaining').textContent = '₦' + remaining.toFixed(1) + 'B';

        // Categories
        const cats = Policies.getCategories();
        const catContainer = document.getElementById('policy-categories');
        catContainer.innerHTML = cats.map(c => `<button class="policy-cat-btn${c.id === 'all' ? ' active' : ''}" data-cat="${c.id}">${c.icon} ${c.name}</button>`).join('');

        let currentCat = 'all';
        catContainer.querySelectorAll('.policy-cat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                catContainer.querySelectorAll('.policy-cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCat = btn.dataset.cat;
                renderPolicies();
            });
        });

        function renderPolicies() {
            const policies = Policies.getByCategory(currentCat, turn, activePolicies);
            const list = document.getElementById('policy-list');
            list.innerHTML = policies.map(p => {
                const isSelected = selected.find(s => s.id === p.id);
                const canAfford = remaining >= p.cost || isSelected;
                return `<div class="policy-item${isSelected ? ' selected' : ''}${!canAfford ? ' locked' : ''}" data-id="${p.id}">
                    <div class="policy-check">${isSelected ? '✓' : ''}</div>
                    <div class="policy-info">
                        <div class="policy-name">${p.name}</div>
                        <div class="policy-desc">${p.desc}</div>
                    </div>
                    <div class="policy-cost">₦${p.cost}B</div>
                </div>`;
            }).join('');

            list.querySelectorAll('.policy-item:not(.locked)').forEach(el => {
                el.addEventListener('click', () => {
                    const pid = el.dataset.id;
                    const policy = Policies.getById(pid);
                    const idx = selected.findIndex(s => s.id === pid);
                    if (idx >= 0) {
                        selected.splice(idx, 1);
                        remaining += policy.cost;
                    } else if (remaining >= policy.cost) {
                        selected.push(policy);
                        remaining -= policy.cost;
                    }
                    document.getElementById('policy-budget-remaining').textContent = '₦' + remaining.toFixed(1) + 'B';
                    renderPolicies();
                });
            });
        }

        renderPolicies();
        modal.classList.remove('hidden');

        document.getElementById('btn-confirm-policies').onclick = () => {
            modal.classList.add('hidden');
            callback(selected);
        };

        document.getElementById('btn-close-policy').onclick = () => {
            modal.classList.add('hidden');
            callback([]);
        };
    }

    // ===== MAP TOOLTIP =====
    function createTooltip() {
        tooltipEl = document.createElement('div');
        tooltipEl.style.cssText = 'position:fixed;padding:8px 14px;background:rgba(26,34,54,0.95);border:1px solid rgba(148,163,184,0.2);border-radius:8px;color:#f1f5f9;font-size:0.8rem;pointer-events:none;z-index:999;display:none;backdrop-filter:blur(8px);';
        document.body.appendChild(tooltipEl);
        document.addEventListener('mousemove', e => {
            if (tooltipEl.style.display !== 'none') {
                tooltipEl.style.left = (e.clientX + 16) + 'px';
                tooltipEl.style.top = (e.clientY + 16) + 'px';
            }
        });
    }

    function showMapTooltip(district) {
        const econ = GameEngine.getDistrictEconomy(district.id);
        tooltipEl.innerHTML = `<strong style="color:${district.color}">${district.name}</strong><br>
            <span style="color:#94a3b8">${district.specialization}</span><br>
            <span>GDP: $${econ ? econ.gdp : '—'}B • Pop: ${econ ? econ.population : '—'}M</span>`;
        tooltipEl.style.display = 'block';
    }

    function hideMapTooltip() { tooltipEl.style.display = 'none'; }

    // ===== TOAST =====
    function toast(title, msg, type = 'info') {
        const icons = { success: '✅', warning: '⚠️', danger: '🚨', info: 'ℹ️' };
        const container = document.getElementById('toast-container');
        const el = document.createElement('div');
        el.className = `toast ${type}`;
        el.innerHTML = `<span class="toast-icon">${icons[type]}</span><div class="toast-body"><div class="toast-title">${title}</div><div class="toast-msg">${msg}</div></div>`;
        container.appendChild(el);
        setTimeout(() => el.remove(), 4000);
    }

    // ===== GAME OVER =====
    function showGameOver(state) {
        const screen = document.getElementById('gameover-screen');
        const grade = GameEngine.getGrade();
        document.getElementById('gameover-grade').textContent = grade;

        document.getElementById('gameover-stats').innerHTML = [
            { l: 'Final GDP', v: '$' + state.gdp.toFixed(1) + 'B' },
            { l: 'Population', v: state.population.toFixed(1) + 'M' },
            { l: 'Employment', v: state.employmentRate.toFixed(1) + '%' },
            { l: 'HDI', v: state.hdi.toFixed(3) },
            { l: 'FDI Inflow', v: '$' + state.fdiInflow.toFixed(1) + 'B' },
            { l: 'Satisfaction', v: state.publicSatisfaction.toFixed(0) + '%' },
            { l: 'Infrastructure', v: state.infraScore.toFixed(0) + '/100' },
            { l: 'Final Score', v: state.score.toLocaleString() }
        ].map(s => `<div class="gameover-stat"><div class="gameover-stat-label">${s.l}</div><div class="gameover-stat-value">${s.v}</div></div>`).join('');

        screen.classList.remove('hidden');
    }

    // ===== FULL UPDATE =====
    function fullUpdate(state) {
        updateHUD(state);
        renderKPIs(state);
        renderGDPChart(state);
        renderSectorChart(state);
        renderSectorList(state);
        renderDistrictList();
        Districts.renderMap(document.getElementById('lagos-map'), currentMapView);
    }

    function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

    return {
        init, updateHUD, renderKPIs, renderGDPChart, renderSectorChart,
        renderSectorList, renderDistrictList, showDistrictDetail,
        hideDistrictDetail, showEvent, showPolicyModal, showMapTooltip,
        hideMapTooltip, toast, showGameOver, fullUpdate
    };
})();
