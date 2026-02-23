/**
 * events.js — Random events & scenarios system
 */
const Events = (() => {
    const POOL = [
        {
            id: 'oil_boom', icon: '🛢️', tag: 'ECONOMIC', title: 'Oil Price Surge',
            desc: 'Global oil prices have spiked, boosting Nigeria\'s federal revenue and increasing Lagos budget allocation.',
            choices: [
                { label: 'Invest in diversification', desc: 'Use the windfall to diversify away from oil dependency.', effects: { gdpGrowth: 0.01, budgetMultiplier: 1.3 } },
                { label: 'Maximize extraction', desc: 'Double down on oil-related trade and logistics.', effects: { gdpGrowth: 0.02, fdiMultiplier: 1.1 } }
            ], weight: 8
        },
        {
            id: 'oil_crash', icon: '📉', tag: 'CRISIS', title: 'Oil Price Collapse',
            desc: 'Oil prices have crashed, severely cutting federal allocations to Lagos.',
            choices: [
                { label: 'Austerity measures', desc: 'Cut spending and tighten the budget.', effects: { budgetMultiplier: 0.7, satisfactionBonus: -5 } },
                { label: 'Borrow & invest', desc: 'Take on debt to maintain spending levels.', effects: { budgetMultiplier: 0.9, gdpGrowth: -0.005 } }
            ], weight: 6
        },
        {
            id: 'tech_boom', icon: '🚀', tag: 'OPPORTUNITY', title: 'African Tech Boom',
            desc: 'International VCs are pouring money into African startups. Lagos is the top destination.',
            choices: [
                { label: 'Create incentives', desc: 'Offer tax breaks and accelerator programs.', effects: { fdiMultiplier: 1.4, gdpGrowth: 0.015 } },
                { label: 'Regulate carefully', desc: 'Implement consumer protections first.', effects: { fdiMultiplier: 1.15, satisfactionBonus: 5 } }
            ], weight: 7
        },
        {
            id: 'flooding', icon: '🌊', tag: 'DISASTER', title: 'Severe Flooding',
            desc: 'Heavy rains have caused severe flooding in low-lying areas, displacing thousands.',
            choices: [
                { label: 'Emergency relief', desc: 'Deploy emergency funds for immediate assistance.', effects: { satisfactionBonus: 3, budgetMultiplier: 0.85, infraBonus: -3 } },
                { label: 'Build drainage systems', desc: 'Invest in long-term flood prevention infrastructure.', effects: { infraBonus: 5, budgetMultiplier: 0.8, satisfactionBonus: -2 } }
            ], weight: 9
        },
        {
            id: 'election', icon: '🗳️', tag: 'POLITICAL', title: 'State Elections',
            desc: 'Lagos state elections are approaching, and public focus shifts to governance.',
            choices: [
                { label: 'Popular spending', desc: 'Announce popular welfare programs.', effects: { satisfactionBonus: 10, budgetMultiplier: 0.85 } },
                { label: 'Stay the course', desc: 'Focus on ongoing development.', effects: { satisfactionBonus: 2, gdpGrowth: 0.005 } }
            ], weight: 5
        },
        {
            id: 'pandemic', icon: '🦠', tag: 'CRISIS', title: 'Health Pandemic',
            desc: 'A viral outbreak threatens Lagos\'s densely populated areas.',
            choices: [
                { label: 'Strict lockdown', desc: 'Impose lockdowns to contain the spread.', effects: { gdpGrowth: -0.03, satisfactionBonus: -8, populationGrowth: -0.005 } },
                { label: 'Targeted response', desc: 'Focus on healthcare surge capacity.', effects: { gdpGrowth: -0.01, satisfactionBonus: -3, budgetMultiplier: 0.85 } }
            ], weight: 3
        },
        {
            id: 'diaspora', icon: '✈️', tag: 'OPPORTUNITY', title: 'Diaspora Investment Wave',
            desc: 'Nigerian diaspora investors are returning capital to Lagos in record numbers.',
            choices: [
                { label: 'Diaspora bonds', desc: 'Issue special diaspora investment bonds.', effects: { fdiMultiplier: 1.3, gdpGrowth: 0.01 } },
                { label: 'Real estate focus', desc: 'Channel investments into housing.', effects: { fdiMultiplier: 1.15, satisfactionBonus: 5 } }
            ], weight: 7
        },
        {
            id: 'port_congestion', icon: '🚛', tag: 'CHALLENGE', title: 'Port Congestion Crisis',
            desc: 'Apapa port is severely congested, with ships waiting weeks to berth.',
            choices: [
                { label: 'Emergency logistics', desc: 'Deploy emergency traffic and logistics management.', effects: { gdpGrowth: -0.005, satisfactionBonus: -3, infraBonus: 2 } },
                { label: 'Divert to Lekki', desc: 'Fast-track Lekki deep sea port operations.', effects: { gdpGrowth: 0.005, infraBonus: 4, budgetMultiplier: 0.9 } }
            ], weight: 6
        },
        {
            id: 'nollywood', icon: '🎬', tag: 'CULTURE', title: 'Nollywood Renaissance',
            desc: 'Nollywood is experiencing a global renaissance, attracting international attention to Lagos.',
            choices: [
                { label: 'Film studios', desc: 'Invest in world-class film production facilities.', effects: { gdpGrowth: 0.008, fdiMultiplier: 1.1, satisfactionBonus: 6 } },
                { label: 'Cultural district', desc: 'Create a dedicated cultural and entertainment zone.', effects: { gdpGrowth: 0.005, satisfactionBonus: 8 } }
            ], weight: 5
        },
        {
            id: 'power_outage', icon: '🔌', tag: 'CRISIS', title: 'Major Power Grid Failure',
            desc: 'A cascading power grid failure has plunged most of Lagos into darkness.',
            choices: [
                { label: 'Auto generators', desc: 'Distribute emergency generators.', effects: { budgetMultiplier: 0.85, satisfactionBonus: -5 } },
                { label: 'Grid overhaul', desc: 'Begin emergency grid repair and upgrade.', effects: { infraBonus: 8, budgetMultiplier: 0.75, satisfactionBonus: -3 } }
            ], weight: 7
        },
        {
            id: 'crypto_hub', icon: '₿', tag: 'TECHNOLOGY', title: 'Cryptocurrency Surge',
            desc: 'Nigeria leads global crypto adoption. Lagos becomes a blockchain hub.',
            choices: [
                { label: 'Embrace crypto', desc: 'Create a crypto-friendly regulatory environment.', effects: { fdiMultiplier: 1.25, gdpGrowth: 0.008 } },
                { label: 'Cautious approach', desc: 'Implement consumer protection regulations first.', effects: { fdiMultiplier: 1.08, satisfactionBonus: 3 } }
            ], weight: 5
        },
        {
            id: 'climate_accord', icon: '🌍', tag: 'OPPORTUNITY', title: 'Green Climate Fund',
            desc: 'Lagos secures a major grant from the Green Climate Fund for sustainable development.',
            choices: [
                { label: 'Green energy', desc: 'Invest in renewable energy projects.', effects: { budgetMultiplier: 1.25, gdpGrowth: 0.006, infraBonus: 3 } },
                { label: 'Green transport', desc: 'Fund electric vehicle infrastructure.', effects: { budgetMultiplier: 1.2, satisfactionBonus: 5, infraBonus: 4 } }
            ], weight: 4
        },
        {
            id: 'traffic_jam', icon: '🚗', tag: 'CHALLENGE', title: 'Record Traffic Gridlock',
            desc: 'Lagos experiences its worst traffic gridlock, with average commutes exceeding 4 hours.',
            choices: [
                { label: 'Car-free zones', desc: 'Implement car-free zones in congested areas.', effects: { satisfactionBonus: -3, infraBonus: 3 } },
                { label: 'BRT expansion', desc: 'Rapidly expand the Bus Rapid Transit system.', effects: { satisfactionBonus: 4, infraBonus: 5, budgetMultiplier: 0.9 } }
            ], weight: 8
        },
        {
            id: 'manufacturing_boom', icon: '🏭', tag: 'ECONOMIC', title: 'Manufacturing Surge',
            desc: 'Global supply chain shifts are driving manufacturing investments to Lagos.',
            choices: [
                { label: 'Industrial zones', desc: 'Create special economic zones for manufacturers.', effects: { gdpGrowth: 0.015, employmentBonus: 4, fdiMultiplier: 1.15 } },
                { label: 'Green manufacturing', desc: 'Attract only clean manufacturing companies.', effects: { gdpGrowth: 0.008, satisfactionBonus: 5, fdiMultiplier: 1.08 } }
            ], weight: 5
        },
        {
            id: 'brain_drain', icon: '🧠', tag: 'CHALLENGE', title: 'Brain Drain Crisis',
            desc: 'Skilled professionals are leaving Lagos for opportunities abroad at record rates.',
            choices: [
                { label: 'Retention packages', desc: 'Offer competitive retention incentives.', effects: { budgetMultiplier: 0.85, employmentBonus: 2, satisfactionBonus: 3 } },
                { label: 'Attract replacements', desc: 'Recruit talent from other African cities.', effects: { populationGrowth: 0.005, employmentBonus: 1 } }
            ], weight: 6
        },
        {
            id: 'afrobeats', icon: '🎵', tag: 'CULTURE', title: 'Afrobeats Global Explosion',
            desc: 'Afrobeats music is dominating global charts, shining a spotlight on Lagos.',
            choices: [
                { label: 'Music district', desc: 'Build a dedicated music and nightlife district.', effects: { gdpGrowth: 0.006, satisfactionBonus: 8, fdiMultiplier: 1.05 } },
                { label: 'Tourism push', desc: 'Market Lagos as a music tourism destination.', effects: { gdpGrowth: 0.004, satisfactionBonus: 5, fdiMultiplier: 1.1 } }
            ], weight: 5
        },
        {
            id: 'un_summit', icon: '🏛️', tag: 'OPPORTUNITY', title: 'UN Development Summit',
            desc: 'Lagos is selected to host a major UN development summit.',
            choices: [
                { label: 'Maximize exposure', desc: 'Launch a global Lagos investment campaign.', effects: { fdiMultiplier: 1.3, satisfactionBonus: 5, budgetMultiplier: 0.9 } },
                { label: 'Focus on results', desc: 'Use the summit to secure development partnerships.', effects: { fdiMultiplier: 1.15, gdpGrowth: 0.008 } }
            ], weight: 3
        },
        {
            id: 'housing_crisis', icon: '🏠', tag: 'CRISIS', title: 'Housing Affordability Crisis',
            desc: 'Housing costs have surged 60%, pricing out millions of Lagos residents.',
            choices: [
                { label: 'Rent control', desc: 'Implement temporary rent control measures.', effects: { satisfactionBonus: 6, fdiMultiplier: 0.9, gdpGrowth: -0.003 } },
                { label: 'Build more', desc: 'Fast-track affordable housing construction.', effects: { satisfactionBonus: 3, budgetMultiplier: 0.8, infraBonus: 2 } }
            ], weight: 7
        },
        {
            id: 'forex_crisis', icon: '💱', tag: 'ECONOMIC', title: 'Naira Currency Crisis',
            desc: 'The naira has lost 30% of its value, impacting imports and cost of living.',
            choices: [
                { label: 'Import substitution', desc: 'Boost local manufacturing to reduce import dependency.', effects: { gdpGrowth: -0.01, employmentBonus: 3, satisfactionBonus: -5 } },
                { label: 'FDI attraction', desc: 'Leverage the weak naira to attract foreign investment.', effects: { fdiMultiplier: 1.3, satisfactionBonus: -3 } }
            ], weight: 6
        },
        {
            id: 'sports_victory', icon: '⚽', tag: 'CULTURE', title: 'Nigeria Wins AFCON',
            desc: 'The Super Eagles win AFCON! National euphoria boosts morale and tourism.',
            choices: [
                { label: 'Sports infrastructure', desc: 'Build new sports facilities to capitalize on enthusiasm.', effects: { satisfactionBonus: 10, gdpGrowth: 0.003 } },
                { label: 'Tourism campaign', desc: 'Launch a sports tourism campaign.', effects: { satisfactionBonus: 7, fdiMultiplier: 1.05, gdpGrowth: 0.004 } }
            ], weight: 4
        }
    ];

    let usedEvents = [];

    function reset() { usedEvents = []; }

    function getRandomEvent(turn) {
        const available = POOL.filter(e => !usedEvents.includes(e.id));
        if (available.length === 0) { usedEvents = []; return getRandomEvent(turn); }
        // Weighted random
        const totalWeight = available.reduce((s, e) => s + e.weight, 0);
        let r = Math.random() * totalWeight;
        for (const e of available) {
            r -= e.weight; if (r <= 0) { usedEvents.push(e.id); return e; }
        }
        const fallback = available[0]; usedEvents.push(fallback.id); return fallback;
    }

    // 70% chance of event each turn
    function shouldTriggerEvent() { return Math.random() < 0.7; }

    return { getRandomEvent, shouldTriggerEvent, reset };
})();
