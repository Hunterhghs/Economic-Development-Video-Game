/**
 * policies.js — Policy & investment decision trees
 */
const Policies = (() => {
    const CATEGORIES = [
        { id: 'all', name: 'All', icon: '📋' },
        { id: 'infrastructure', name: 'Infrastructure', icon: '🏗️' },
        { id: 'education', name: 'Education', icon: '🎓' },
        { id: 'technology', name: 'Technology', icon: '💻' },
        { id: 'trade', name: 'Trade & Ports', icon: '🚢' },
        { id: 'health', name: 'Healthcare', icon: '🏥' },
        { id: 'energy', name: 'Energy', icon: '⚡' },
        { id: 'housing', name: 'Housing', icon: '🏘️' },
        { id: 'security', name: 'Security', icon: '🛡️' },
        { id: 'tourism', name: 'Tourism', icon: '🌴' }
    ];

    const P = (id, name, desc, cat, cost, effects, unlock) => ({ id, name, desc, category: cat, cost, effects, unlockTurn: unlock });
    const ALL_POLICIES = [
        P('road_expansion', 'Road Network Expansion', 'Expand Lagos road network to reduce gridlock.', 'infrastructure', 3.5, { sectors: { infrastructure: 8, manufacturing: 3 }, modifiers: { gdpGrowth: 0.005, satisfactionBonus: 3 } }, 1),
        P('rail_system', 'Light Rail Transit', 'Build modern light rail connecting major districts.', 'infrastructure', 6, { sectors: { infrastructure: 15, technology: 5 }, modifiers: { gdpGrowth: 0.012, satisfactionBonus: 8, infraBonus: 5 } }, 3),
        P('smart_traffic', 'AI Traffic Management', 'AI-powered traffic control across intersections.', 'infrastructure', 2.5, { sectors: { infrastructure: 6, technology: 4 }, modifiers: { satisfactionBonus: 5, infraBonus: 3 } }, 5),
        P('bridge_construction', 'Fourth Mainland Bridge', 'New bridge linking mainland to Lekki.', 'infrastructure', 8, { sectors: { infrastructure: 20 }, modifiers: { gdpGrowth: 0.02, infraBonus: 10, satisfactionBonus: 10 } }, 8),
        P('tech_academy', 'Lagos Tech Academy', 'World-class tech academy in Yaba training 10K devs/year.', 'education', 2, { sectors: { education: 10, technology: 8 }, modifiers: { employmentBonus: 2 } }, 1),
        P('vocational', 'Vocational Training Centers', '50 vocational centers in underserved communities.', 'education', 1.5, { sectors: { education: 6, manufacturing: 4 }, modifiers: { employmentBonus: 3, satisfactionBonus: 3 } }, 1),
        P('university_expansion', 'University Campus Expansion', 'Expand UNILAG & LASU with research facilities.', 'education', 4, { sectors: { education: 12, technology: 5, housing: 3 }, modifiers: { gdpGrowth: 0.008 } }, 4),
        P('stem_initiative', 'STEM Education Initiative', 'K-12 STEM program across Lagos public schools.', 'education', 2.5, { sectors: { education: 8, technology: 3 }, modifiers: { employmentBonus: 1, satisfactionBonus: 4 } }, 2),
        P('tech_hub', 'Yaba Silicon Valley', 'Transform Yaba into Africa\'s premier tech hub.', 'technology', 4, { sectors: { technology: 15, education: 5 }, modifiers: { fdiMultiplier: 1.15, gdpGrowth: 0.01 } }, 2),
        P('fiber_optic', 'Fiber Optic Network', 'City-wide fiber optic internet infrastructure.', 'technology', 3, { sectors: { technology: 10, infrastructure: 5 }, modifiers: { fdiMultiplier: 1.1, gdpGrowth: 0.006 } }, 1),
        P('fintech_zone', 'FinTech Special Zone', 'Regulatory sandbox for fintech on Victoria Island.', 'technology', 2, { sectors: { technology: 8 }, modifiers: { fdiMultiplier: 1.2, gdpGrowth: 0.008 } }, 3),
        P('digital_id', 'Digital Identity Platform', 'Blockchain digital identity for all residents.', 'technology', 2.5, { sectors: { technology: 6, security: 5 }, modifiers: { satisfactionBonus: 3 } }, 6),
        P('port_modernize', 'Apapa Port Modernization', 'Automated container handling and deeper berths.', 'trade', 5, { sectors: { trade: 15, infrastructure: 5 }, modifiers: { gdpGrowth: 0.015, fdiMultiplier: 1.1 } }, 1),
        P('lekki_ftz', 'Lekki Free Trade Zone', 'Expand Lekki FTZ with tax incentives.', 'trade', 4, { sectors: { trade: 10, manufacturing: 10 }, modifiers: { fdiMultiplier: 1.25, gdpGrowth: 0.012 } }, 2),
        P('afcfta_hub', 'AfCFTA Trading Hub', 'Position Lagos as AfCFTA logistics hub.', 'trade', 3, { sectors: { trade: 12 }, modifiers: { gdpGrowth: 0.01, fdiMultiplier: 1.15 } }, 5),
        P('primary_health', 'Primary Healthcare Expansion', '100 new healthcare centers in underserved areas.', 'health', 2, { sectors: { healthcare: 10 }, modifiers: { satisfactionBonus: 5, populationGrowth: 0.002 } }, 1),
        P('hospital', 'Teaching Hospital Complex', 'State-of-the-art teaching hospital.', 'health', 5, { sectors: { healthcare: 18, education: 5 }, modifiers: { satisfactionBonus: 8 } }, 4),
        P('telemedicine', 'Telemedicine Network', 'Digital health platform across all districts.', 'health', 1.5, { sectors: { healthcare: 8, technology: 3 }, modifiers: { satisfactionBonus: 4 } }, 3),
        P('solar_farm', 'Solar Farm Initiative', '500MW solar generation on Lagos mainland.', 'energy', 4, { sectors: { energy: 15, infrastructure: 3 }, modifiers: { gdpGrowth: 0.006, satisfactionBonus: 5 } }, 1),
        P('smart_grid', 'Smart Grid Infrastructure', 'Smart grid reducing power losses to 10%.', 'energy', 6, { sectors: { energy: 20, technology: 5, infrastructure: 5 }, modifiers: { gdpGrowth: 0.01, infraBonus: 5, satisfactionBonus: 8 } }, 5),
        P('gas_plant', 'Natural Gas Power Plant', '1GW gas-fired plant for reliable baseload.', 'energy', 5, { sectors: { energy: 18, manufacturing: 5 }, modifiers: { gdpGrowth: 0.008, infraBonus: 4 } }, 3),
        P('affordable_housing', 'Affordable Housing Program', '20,000 housing units for low/mid income.', 'housing', 3.5, { sectors: { housing: 12 }, modifiers: { satisfactionBonus: 8, populationGrowth: 0.003 } }, 1),
        P('eko_atlantic', 'Eko Atlantic Expansion', 'Accelerate Eko Atlantic mixed-use development.', 'housing', 7, { sectors: { housing: 15, infrastructure: 8, tourism: 5 }, modifiers: { fdiMultiplier: 1.2, gdpGrowth: 0.015 } }, 6),
        P('urban_renewal', 'Urban Renewal Initiative', 'Rehabilitate aging buildings on Island & Mainland.', 'housing', 2.5, { sectors: { housing: 8, infrastructure: 5 }, modifiers: { satisfactionBonus: 5, infraBonus: 3 } }, 2),
        P('smart_surveillance', 'Smart Surveillance Network', 'AI-powered CCTV and crime analytics.', 'security', 2, { sectors: { security: 10, technology: 3 }, modifiers: { satisfactionBonus: 4, fdiMultiplier: 1.05 } }, 1),
        P('community_policing', 'Community Policing Program', 'Community officers focused on conflict resolution.', 'security', 1.5, { sectors: { security: 8 }, modifiers: { satisfactionBonus: 6 } }, 1),
        P('emergency_response', 'Emergency Response Center', 'Centralized emergency command center.', 'security', 3, { sectors: { security: 12, infrastructure: 3 }, modifiers: { satisfactionBonus: 5, infraBonus: 2 } }, 4),
        P('tourism_board', 'Lagos Tourism Board', 'Tourism promotion agency & cultural destination.', 'tourism', 1.5, { sectors: { tourism: 10 }, modifiers: { gdpGrowth: 0.004, fdiMultiplier: 1.05 } }, 1),
        P('waterfront', 'Waterfront Promenade', '10km lagoon promenade with restaurants & parks.', 'tourism', 3, { sectors: { tourism: 15, housing: 3 }, modifiers: { satisfactionBonus: 7, gdpGrowth: 0.005 } }, 3),
        P('cultural_center', 'Lagos Cultural Arts Center', 'World-class performing arts center on Lagos Island.', 'tourism', 4, { sectors: { tourism: 18, education: 3 }, modifiers: { satisfactionBonus: 6, fdiMultiplier: 1.08 } }, 5)
    ];

    function getCategories() { return CATEGORIES; }
    function getAvailable(turn, activePolicies) {
        return ALL_POLICIES.filter(p => p.unlockTurn <= turn && !activePolicies.includes(p.id));
    }
    function getByCategory(category, turn, activePolicies) {
        const available = getAvailable(turn, activePolicies);
        if (category === 'all') return available;
        return available.filter(p => p.category === category);
    }
    function getById(id) { return ALL_POLICIES.find(p => p.id === id); }
    function getAll() { return ALL_POLICIES; }

    return { getCategories, getAvailable, getByCategory, getById, getAll };
})();
