/**
 * districts.js — Lagos district data and SVG map rendering
 */

const Districts = (() => {

    const DISTRICTS = [
        {
            id: 'lagos-island',
            name: 'Lagos Island',
            description: 'Financial hub & cultural heritage center',
            color: '#00c77b',
            gdpShare: 0.25,
            popShare: 0.08,
            devLevel: 72,
            specialization: 'Finance & Heritage',
            // SVG path for the district (stylized map)
            path: 'M 320 340 L 360 320 L 410 325 L 430 350 L 420 380 L 380 390 L 340 375 L 315 360 Z',
            labelPos: { x: 370, y: 355 }
        },
        {
            id: 'victoria-island',
            name: 'Victoria Island',
            description: 'Luxury, FDI & tech startup district',
            color: '#f5c542',
            gdpShare: 0.22,
            popShare: 0.06,
            devLevel: 78,
            specialization: 'Tech & FDI',
            path: 'M 430 350 L 470 330 L 530 335 L 550 360 L 535 390 L 490 400 L 440 385 L 425 370 Z',
            labelPos: { x: 488, y: 365 }
        },
        {
            id: 'ikeja',
            name: 'Ikeja',
            description: 'Administrative center & manufacturing zone',
            color: '#00b4d8',
            gdpShare: 0.18,
            popShare: 0.20,
            devLevel: 55,
            specialization: 'Admin & Manufacturing',
            path: 'M 200 160 L 300 140 L 380 160 L 400 220 L 370 280 L 290 300 L 220 270 L 190 210 Z',
            labelPos: { x: 295, y: 220 }
        },
        {
            id: 'lekki',
            name: 'Lekki',
            description: 'New development & free trade zone',
            color: '#8b5cf6',
            gdpShare: 0.12,
            popShare: 0.10,
            devLevel: 42,
            specialization: 'Free Trade Zone',
            path: 'M 550 360 L 620 340 L 710 360 L 740 400 L 700 440 L 620 450 L 560 420 L 540 390 Z',
            labelPos: { x: 640, y: 395 }
        },
        {
            id: 'apapa',
            name: 'Apapa',
            description: 'Major port & logistics hub',
            color: '#f59e0b',
            gdpShare: 0.13,
            popShare: 0.09,
            devLevel: 48,
            specialization: 'Port & Logistics',
            path: 'M 180 310 L 240 290 L 310 300 L 320 340 L 315 360 L 280 390 L 220 400 L 175 370 Z',
            labelPos: { x: 250, y: 345 }
        },
        {
            id: 'mainland',
            name: 'Mainland',
            description: 'Tech talent, universities & culture',
            color: '#3b82f6',
            gdpShare: 0.10,
            popShare: 0.47,
            devLevel: 35,
            specialization: 'Education & Talent',
            path: 'M 100 120 L 200 100 L 200 160 L 190 210 L 220 270 L 290 300 L 240 290 L 180 310 L 120 280 L 80 200 Z',
            labelPos: { x: 160, y: 205 }
        }
    ];

    // Water / lagoon paths
    const WATER_PATHS = [
        // Lagos Lagoon
        'M 50 350 Q 200 300 350 320 Q 500 300 600 320 Q 700 310 780 340 L 780 500 Q 600 480 400 490 Q 200 500 50 480 Z',
        // Atlantic coastline
        'M 50 470 Q 200 450 400 460 Q 600 450 780 470 L 780 600 L 50 600 Z'
    ];

    let selectedDistrict = null;

    function getAll() { return DISTRICTS; }

    function getById(id) { return DISTRICTS.find(d => d.id === id); }

    function getSelected() { return selectedDistrict; }

    function select(id) { selectedDistrict = id; }

    function deselect() { selectedDistrict = null; }

    /**
     * Render the SVG map
     */
    function renderMap(svgElement, viewMode) {
        if (!svgElement) return;
        svgElement.innerHTML = '';

        // Background
        const bg = createSVG('rect', {
            x: 0, y: 0, width: 800, height: 600,
            fill: '#0a0e17'
        });
        svgElement.appendChild(bg);

        // Grid lines (subtle)
        for (let i = 0; i < 800; i += 50) {
            svgElement.appendChild(createSVG('line', {
                x1: i, y1: 0, x2: i, y2: 600,
                stroke: 'rgba(148,163,184,0.04)', 'stroke-width': 1
            }));
        }
        for (let j = 0; j < 600; j += 50) {
            svgElement.appendChild(createSVG('line', {
                x1: 0, y1: j, x2: 800, y2: j,
                stroke: 'rgba(148,163,184,0.04)', 'stroke-width': 1
            }));
        }

        // Water
        WATER_PATHS.forEach(wp => {
            svgElement.appendChild(createSVG('path', {
                d: wp, class: 'water'
            }));
        });

        // Water label
        const waterLabel = createSVG('text', {
            x: 400, y: 470, fill: 'rgba(0,180,216,0.3)',
            'font-family': "'Inter', sans-serif",
            'font-size': '14px',
            'font-style': 'italic',
            'text-anchor': 'middle'
        });
        waterLabel.textContent = 'Lagos Lagoon';
        svgElement.appendChild(waterLabel);

        const oceanLabel = createSVG('text', {
            x: 400, y: 550, fill: 'rgba(0,180,216,0.2)',
            'font-family': "'Inter', sans-serif",
            'font-size': '12px',
            'font-style': 'italic',
            'text-anchor': 'middle'
        });
        oceanLabel.textContent = 'Atlantic Ocean';
        svgElement.appendChild(oceanLabel);

        // Districts
        const state = GameEngine.getState();
        DISTRICTS.forEach(d => {
            const fillColor = getDistrictFill(d, viewMode, state);
            const distGroup = createSVG('g', {});

            // Glow effect for selected
            if (selectedDistrict === d.id) {
                const glow = createSVG('path', {
                    d: d.path,
                    fill: 'none',
                    stroke: d.color,
                    'stroke-width': 6,
                    opacity: 0.3,
                    filter: 'blur(4px)'
                });
                distGroup.appendChild(glow);
            }

            // District shape
            const path = createSVG('path', {
                d: d.path,
                fill: fillColor,
                class: `district-path${selectedDistrict === d.id ? ' selected' : ''}`,
                'data-district': d.id
            });
            path.addEventListener('click', () => {
                select(d.id);
                UI.showDistrictDetail(d.id);
                renderMap(svgElement, viewMode);
            });
            path.addEventListener('mouseenter', () => {
                UI.showMapTooltip(d);
            });
            path.addEventListener('mouseleave', () => {
                UI.hideMapTooltip();
            });
            distGroup.appendChild(path);

            // Label
            const label = createSVG('text', {
                x: d.labelPos.x,
                y: d.labelPos.y - 8,
                class: 'district-label'
            });
            label.textContent = d.name;
            distGroup.appendChild(label);

            // Sub-label
            const subLabel = createSVG('text', {
                x: d.labelPos.x,
                y: d.labelPos.y + 8,
                class: 'district-label-sub'
            });
            subLabel.textContent = d.specialization;
            distGroup.appendChild(subLabel);

            // Dev level indicator
            const devText = createSVG('text', {
                x: d.labelPos.x,
                y: d.labelPos.y + 22,
                fill: d.color,
                'font-family': "'Outfit', sans-serif",
                'font-size': '11px',
                'font-weight': '700',
                'text-anchor': 'middle',
                'pointer-events': 'none'
            });
            if (viewMode === 'economy') {
                const econ = GameEngine.getDistrictEconomy(d.id);
                devText.textContent = econ ? `$${econ.gdp}B` : '';
            } else if (viewMode === 'population') {
                const econ = GameEngine.getDistrictEconomy(d.id);
                devText.textContent = econ ? `${econ.population}M` : '';
            } else {
                devText.textContent = `Lv ${d.devLevel}`;
            }
            distGroup.appendChild(devText);

            svgElement.appendChild(distGroup);
        });

        // Compass rose
        const compass = createSVG('text', {
            x: 740, y: 80, fill: 'rgba(148,163,184,0.3)',
            'font-family': "'Outfit', sans-serif",
            'font-size': '18px',
            'font-weight': '600',
            'text-anchor': 'middle'
        });
        compass.textContent = 'N ↑';
        svgElement.appendChild(compass);
    }

    function getDistrictFill(district, viewMode, state) {
        const dev = district.devLevel;
        if (viewMode === 'economy') {
            const econ = GameEngine.getDistrictEconomy(district.id);
            const intensity = econ ? Math.min(econ.gdp / 30, 1) : 0.3;
            return `rgba(${hexToRgb(district.color)}, ${0.3 + intensity * 0.5})`;
        } else if (viewMode === 'population') {
            const pop = district.popShare;
            return `rgba(${hexToRgb(district.color)}, ${0.2 + pop * 0.8})`;
        }
        // Development view
        const hue = (dev / 100) * 120; // 0=red, 120=green
        return `hsla(${hue}, 70%, 35%, 0.7)`;
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r},${g},${b}`;
    }

    function createSVG(tag, attrs) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        return el;
    }

    /**
     * Update district development levels based on policies
     */
    function boostDistrict(districtId, amount) {
        const d = DISTRICTS.find(dd => dd.id === districtId);
        if (d) {
            d.devLevel = Math.min(100, Math.max(0, d.devLevel + amount));
        }
    }

    function boostAllDistricts(amount) {
        DISTRICTS.forEach(d => {
            d.devLevel = Math.min(100, Math.max(0, d.devLevel + amount));
        });
    }

    return {
        getAll,
        getById,
        getSelected,
        select,
        deselect,
        renderMap,
        boostDistrict,
        boostAllDistricts
    };
})();
