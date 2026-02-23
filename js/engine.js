/**
 * engine.js — Core economic simulation engine for Lagos
 */

const GameEngine = (() => {
    // Base economic parameters for Lagos (2025)
    const BASE_STATE = {
        year: 2025,
        turn: 1,
        maxTurns: 30,
        budget: 15, // ₦ Billion
        budgetBase: 15,
        score: 0,

        // Core KPIs
        gdp: 84, // $ Billion (Lagos GDP ~$84B)
        gdpPerCapita: 4200, // $
        population: 22, // Million
        employmentRate: 68, // %
        fdiInflow: 3.2, // $ Billion
        hdi: 0.56, // 0-1 scale
        infraScore: 38, // 0-100
        tradeVolume: 28, // $ Billion
        publicSatisfaction: 52, // 0-100
        budgetBalance: 0, // surplus/deficit

        // Sector levels (0-100)
        sectors: {
            infrastructure: 35,
            education: 40,
            healthcare: 30,
            technology: 25,
            manufacturing: 32,
            trade: 55,
            tourism: 20,
            housing: 28,
            energy: 22,
            security: 35
        },

        // Historical data for charts
        history: {
            gdp: [84],
            population: [22],
            employmentRate: [68],
            fdi: [3.2],
            hdi: [0.56],
            satisfaction: [52],
            budget: [15],
            infraScore: [38]
        },

        // Active policies
        activePolicies: [],

        // Events that have occurred
        eventLog: [],

        // Turn modifiers from events/policies
        modifiers: {
            gdpGrowth: 0,
            employmentBonus: 0,
            fdiMultiplier: 1,
            satisfactionBonus: 0,
            budgetMultiplier: 1,
            populationGrowth: 0,
            infraBonus: 0
        }
    };

    let state = null;

    function init() {
        state = JSON.parse(JSON.stringify(BASE_STATE));
        return state;
    }

    function getState() {
        return state;
    }

    function setState(newState) {
        state = newState;
    }

    /**
     * Advance the simulation by one year
     */
    function advanceTurn(selectedPolicies, eventConsequences) {
        if (state.turn >= state.maxTurns) return state;

        // 1) Apply policy costs & effects
        let totalSpent = 0;
        if (selectedPolicies && selectedPolicies.length > 0) {
            selectedPolicies.forEach(p => {
                totalSpent += p.cost;
                applyPolicyEffects(p);
                if (!state.activePolicies.includes(p.id)) {
                    state.activePolicies.push(p.id);
                }
            });
        }

        // 2) Apply event consequences
        if (eventConsequences) {
            applyModifiers(eventConsequences);
        }

        // 3) Compute economic growth
        const baseGdpGrowth = computeGdpGrowth();
        state.gdp *= (1 + baseGdpGrowth);
        state.gdp = round(state.gdp, 1);

        // 4) Population dynamics
        const popGrowth = 0.032 + state.modifiers.populationGrowth; // Lagos ~3.2% annual growth
        state.population *= (1 + popGrowth);
        state.population = round(state.population, 2);

        // 5) GDP per capita
        state.gdpPerCapita = round((state.gdp * 1e9) / (state.population * 1e6), 0);

        // 6) Employment
        const empDelta = (baseGdpGrowth * 30) + (state.modifiers.employmentBonus) + (sectorAvg(['manufacturing', 'technology', 'trade']) - 40) * 0.05;
        state.employmentRate = clamp(state.employmentRate + empDelta, 30, 98);
        state.employmentRate = round(state.employmentRate, 1);

        // 7) FDI
        const fdiGrowth = (state.sectors.technology / 100 * 0.3) + (state.infraScore / 100 * 0.2) + (state.sectors.trade / 100 * 0.2);
        state.fdiInflow *= (1 + fdiGrowth * 0.15) * state.modifiers.fdiMultiplier;
        state.fdiInflow = round(state.fdiInflow, 2);

        // 8) HDI composite
        state.hdi = computeHDI();

        // 9) Infrastructure score
        const infraGain = (state.sectors.infrastructure - 40) * 0.06 + state.modifiers.infraBonus;
        state.infraScore = clamp(state.infraScore + infraGain, 0, 100);
        state.infraScore = round(state.infraScore, 1);

        // 10) Trade volume
        state.tradeVolume = round(state.tradeVolume * (1 + baseGdpGrowth * 0.8 + state.sectors.trade / 500), 1);

        // 11) Public satisfaction
        const satDelta = (state.employmentRate - 65) * 0.1
            + (state.sectors.healthcare - 40) * 0.04
            + (state.sectors.housing - 35) * 0.04
            + (state.sectors.security - 35) * 0.05
            + state.modifiers.satisfactionBonus;
        state.publicSatisfaction = clamp(state.publicSatisfaction + satDelta, 5, 100);
        state.publicSatisfaction = round(state.publicSatisfaction, 1);

        // 12) Budget for next turn
        state.budgetBalance = round(state.budgetBase - totalSpent, 1);
        state.budget = round((state.gdp * 0.08 + state.fdiInflow * 0.3 + 5) * state.modifiers.budgetMultiplier, 1);
        state.budgetBase = state.budget;

        // 13) Natural sector decay/growth
        Object.keys(state.sectors).forEach(s => {
            state.sectors[s] = clamp(state.sectors[s] - 0.5 + Math.random() * 0.3, 5, 100);
            state.sectors[s] = round(state.sectors[s], 1);
        });

        // 14) Score
        state.score = computeScore();

        // 15) Advance turn
        state.year++;
        state.turn++;

        // 16) Push history
        state.history.gdp.push(state.gdp);
        state.history.population.push(state.population);
        state.history.employmentRate.push(state.employmentRate);
        state.history.fdi.push(state.fdiInflow);
        state.history.hdi.push(state.hdi);
        state.history.satisfaction.push(state.publicSatisfaction);
        state.history.budget.push(state.budget);
        state.history.infraScore.push(state.infraScore);

        // 17) Reset per-turn modifiers
        resetModifiers();

        return state;
    }

    function applyPolicyEffects(policy) {
        if (policy.effects) {
            if (policy.effects.sectors) {
                Object.entries(policy.effects.sectors).forEach(([sector, val]) => {
                    if (state.sectors[sector] !== undefined) {
                        state.sectors[sector] = clamp(state.sectors[sector] + val, 0, 100);
                    }
                });
            }
            if (policy.effects.modifiers) {
                applyModifiers(policy.effects.modifiers);
            }
        }
    }

    function applyModifiers(mods) {
        Object.entries(mods).forEach(([key, val]) => {
            if (key === 'fdiMultiplier' || key === 'budgetMultiplier') {
                state.modifiers[key] *= val;
            } else if (state.modifiers[key] !== undefined) {
                state.modifiers[key] += val;
            }
        });
    }

    function resetModifiers() {
        state.modifiers = {
            gdpGrowth: 0,
            employmentBonus: 0,
            fdiMultiplier: 1,
            satisfactionBonus: 0,
            budgetMultiplier: 1,
            populationGrowth: 0,
            infraBonus: 0
        };
    }

    function computeGdpGrowth() {
        const sectorContribution = sectorAvg(Object.keys(state.sectors)) / 100 * 0.04;
        const infraContribution = state.infraScore / 100 * 0.02;
        const fdiContribution = Math.min(state.fdiInflow / 20, 0.02);
        const base = 0.04; // Lagos base GDP growth ~4%
        return base + sectorContribution + infraContribution + fdiContribution + state.modifiers.gdpGrowth;
    }

    function computeHDI() {
        const eduIndex = state.sectors.education / 100;
        const healthIndex = state.sectors.healthcare / 100;
        const incomeIndex = Math.min(state.gdpPerCapita / 15000, 1);
        const hdi = Math.pow(eduIndex * healthIndex * incomeIndex, 1 / 3);
        return round(clamp(hdi, 0.1, 0.99), 3);
    }

    function computeScore() {
        return Math.round(
            state.gdp * 2 +
            state.employmentRate * 5 +
            state.hdi * 500 +
            state.infraScore * 3 +
            state.publicSatisfaction * 4 +
            state.fdiInflow * 10 -
            (100 - state.employmentRate) * 3
        );
    }

    function getGrade() {
        const s = state.score;
        if (s > 6000) return 'S';
        if (s > 5000) return 'A+';
        if (s > 4000) return 'A';
        if (s > 3000) return 'B+';
        if (s > 2500) return 'B';
        if (s > 2000) return 'C+';
        if (s > 1500) return 'C';
        if (s > 1000) return 'D';
        return 'F';
    }

    function sectorAvg(keys) {
        const sum = keys.reduce((a, k) => a + (state.sectors[k] || 0), 0);
        return sum / keys.length;
    }

    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
    function round(v, d) { const m = Math.pow(10, d); return Math.round(v * m) / m; }

    // District-level economics
    function getDistrictEconomy(districtId) {
        const d = Districts.getById(districtId);
        if (!d) return null;
        const share = d.gdpShare;
        return {
            gdp: round(state.gdp * share, 2),
            population: round(state.population * d.popShare, 2),
            employment: round(state.employmentRate * (0.8 + d.devLevel * 0.004), 1),
            infrastructure: round(state.infraScore * (0.6 + d.devLevel * 0.008), 1)
        };
    }

    return {
        init,
        getState,
        setState,
        advanceTurn,
        getDistrictEconomy,
        getGrade,
        computeScore
    };
})();
