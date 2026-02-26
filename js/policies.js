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
        P('cultural_center', 'Lagos Cultural Arts Center', 'World-class performing arts center on Lagos Island.', 'tourism', 4, { sectors: { tourism: 18, education: 3 }, modifiers: { satisfactionBonus: 6, fdiMultiplier: 1.08 } }, 5),

        // Early-Mid Game (Turns 4-9)
        P('brt_expansion', 'BRT Network Expansion', 'Add 500 new high-capacity buses and dedicated lanes.', 'infrastructure', 4.5, { sectors: { infrastructure: 10, manufacturing: 2 }, modifiers: { gdpGrowth: 0.008, satisfactionBonus: 5 } }, 4),
        P('local_solar_grids', 'Local Solar Microgrids', 'Decentralized solar power for commercial districts.', 'energy', 5.5, { sectors: { energy: 12, technology: 3 }, modifiers: { gdpGrowth: 0.006, infraBonus: 3 } }, 5),
        P('startup_grants', 'Tech Startup Grants', 'Seed funding for 1,000 local tech businesses.', 'technology', 3, { sectors: { technology: 10, education: 4 }, modifiers: { fdiMultiplier: 1.05, employmentBonus: 2 } }, 4),
        P('agri_processing', 'Agri-Processing Hubs', 'Industrial zones dedicated to food export processing.', 'trade', 6, { sectors: { trade: 12, manufacturing: 10 }, modifiers: { gdpGrowth: 0.015, fdiMultiplier: 1.1 } }, 6),
        P('medical_manufacturing', 'Pharmaceutical Plants', 'Domestic drug manufacturing to reduce imports.', 'health', 5, { sectors: { healthcare: 12, manufacturing: 8 }, modifiers: { satisfactionBonus: 5, gdpGrowth: 0.005 } }, 7),
        P('affordable_mortgages', 'State Mortgage Subsidy', 'Low-interest loans stimulating middle-class housing.', 'housing', 5.5, { sectors: { housing: 15 }, modifiers: { satisfactionBonus: 8, employmentBonus: 3 } }, 6),
        P('border_security', 'Advanced Border Tech', 'Streamlined but secure customs processing at ports.', 'security', 4, { sectors: { security: 10, trade: 5 }, modifiers: { fdiMultiplier: 1.08 } }, 5),
        P('eco_parks', 'Lagos Eco-Parks', 'Reclaiming polluted areas into massive green spaces.', 'tourism', 3.5, { sectors: { tourism: 12, healthcare: 4 }, modifiers: { satisfactionBonus: 7 } }, 7),
        P('public_wifi', 'Municipal Wi-Fi Zones', 'Free public internet in high-traffic commercial hubs.', 'technology', 4, { sectors: { technology: 8, education: 3 }, modifiers: { satisfactionBonus: 5, gdpGrowth: 0.004 } }, 8),
        P('waste_to_energy', 'Waste-to-Energy Plants', 'Incinerators converting landfill waste into electricity.', 'energy', 7, { sectors: { energy: 15, infrastructure: 5 }, modifiers: { gdpGrowth: 0.008, infraBonus: 4, satisfactionBonus: 4 } }, 8),
        P('vocational_scaleup', 'National Skills Mandate', 'Massive scale-up of trades and engineering vocational prep.', 'education', 6, { sectors: { education: 15, manufacturing: 10 }, modifiers: { employmentBonus: 4, fdiMultiplier: 1.05 } }, 9),

        // Late Game Upgrades (Turns 10-19)
        P('high_speed_rail', 'High-Speed Rail: Lagos-Abuja', 'High-speed transit connecting major Nigerian economic hubs.', 'infrastructure', 15, { sectors: { infrastructure: 25, technology: 15 }, modifiers: { gdpGrowth: 0.03, satisfactionBonus: 10, fdiMultiplier: 1.15 } }, 10),
        P('ai_research_hub', 'Sub-Saharan AI Research Hub', 'Premier AI research center attracting global tech talent.', 'education', 10, { sectors: { education: 20, technology: 25 }, modifiers: { gdpGrowth: 0.02, fdiMultiplier: 1.2 } }, 10),
        P('national_6g', 'National 6G Infrastructure', 'Ultra-fast wireless data grid for finance and automation.', 'technology', 12, { sectors: { technology: 30, security: 15 }, modifiers: { fdiMultiplier: 1.3, infraBonus: 5 } }, 12),
        P('pan_african_commodities', 'Pan-African Commodities Bourse', 'A digital, blockchain-backed commodities trading floor.', 'trade', 13, { sectors: { trade: 22, technology: 10 }, modifiers: { gdpGrowth: 0.02, fdiMultiplier: 1.15 } }, 13),
        P('deep_sea_port', 'Badagry Deep Sea Port', 'Next-gen automated port for global shipping mega-vessels.', 'trade', 14, { sectors: { trade: 25, infrastructure: 10 }, modifiers: { gdpGrowth: 0.025, fdiMultiplier: 1.25 } }, 10),
        P('advanced_health_city', 'Advanced Medical City', 'A unified, ultra-modern specialized healthcare pipeline.', 'health', 12, { sectors: { healthcare: 25, energy: 10 }, modifiers: { satisfactionBonus: 12, populationGrowth: 0.005 } }, 11),
        P('offshore_wind_array', 'Offshore Wind Mega-Array', 'Massive offshore wind farm providing clean baseload energy.', 'energy', 25, { sectors: { energy: 40, technology: 15 }, modifiers: { gdpGrowth: 0.04, infraBonus: 15, satisfactionBonus: 20 } }, 15),
        P('vertical_agriculture', 'Industrial Vertical Agriculture', 'Hydroponic high-rises securing local food supply chains.', 'housing', 8, { sectors: { housing: 15, technology: 10 }, modifiers: { satisfactionBonus: 10, populationGrowth: 0.01 } }, 10),
        P('smart_grid_security', 'Integrated Smart Grid Security', 'AI-driven cyber-physical security predicting disruptions.', 'security', 9, { sectors: { security: 20, technology: 15 }, modifiers: { satisfactionBonus: 8, fdiMultiplier: 1.1 } }, 10),
        P('tech_expo_center', 'Lagos Global Tech Expo Center', 'World-class convention hub driving international commerce.', 'tourism', 20, { sectors: { tourism: 30, technology: 20 }, modifiers: { gdpGrowth: 0.035, fdiMultiplier: 1.4 } }, 18),
        P('desalination_plant', 'Large-Scale Desalination', 'Securing clean water supply for the booming population.', 'infrastructure', 14, { sectors: { infrastructure: 20, healthcare: 10 }, modifiers: { satisfactionBonus: 12, populationGrowth: 0.008 } }, 14),
        P('satellite_network', 'Pan-African Satellite Network', 'Launching communications sats from local facilities.', 'technology', 18, { sectors: { technology: 35, trade: 10 }, modifiers: { fdiMultiplier: 1.25, gdpGrowth: 0.02 } }, 16),
        P('fintech_hq', 'Global FinTech Headquarters', 'Establishing Lagos as the undeniable financial capital of Africa.', 'trade', 15, { sectors: { trade: 25, technology: 20 }, modifiers: { fdiMultiplier: 1.3, gdpGrowth: 0.03 } }, 15),
        P('robotics_manufacturing', 'Advanced Robotics Manufacturing', 'Automated factories producing consumer & industrial robots.', 'technology', 22, { sectors: { manufacturing: 35, technology: 20 }, modifiers: { gdpGrowth: 0.04, employmentBonus: -1 } }, 17),
        P('marine_biotech', 'Marine Biotech Research', 'Exploiting ocean resources for pharmaceuticals and food.', 'health', 16, { sectors: { healthcare: 20, technology: 15 }, modifiers: { gdpGrowth: 0.015, fdiMultiplier: 1.15 } }, 18),
        P('synthetic_meat_labs', 'Cultured Protein Facilities', 'Lab-grown meat factories solving food security sustainably.', 'housing', 15, { sectors: { housing: 20, healthcare: 15 }, modifiers: { satisfactionBonus: 10, populationGrowth: 0.01 } }, 19),

        // Final Tier (Turns 20-30)
        P('coastal_resilience', 'Lagos Coastal Resilience Wall', 'Massive sea wall preventing flooding and protecting assets.', 'housing', 35, { sectors: { housing: 30, infrastructure: 20, energy: 15 }, modifiers: { gdpGrowth: 0.05, satisfactionBonus: 25, populationGrowth: 0.02 } }, 20),
        P('green_transit', 'City-Wide Green Transit', 'Full conversion of all transport to zero-emission infrastructure.', 'health', 18, { sectors: { healthcare: 20, technology: 15 }, modifiers: { satisfactionBonus: 15, populationGrowth: 0.01 } }, 20),
        P('orbital_solar', 'Orbital Solar Downlink', 'Microwave transmitters converting space-mined solar energy.', 'energy', 30, { sectors: { energy: 35, technology: 25 }, modifiers: { gdpGrowth: 0.04, infraBonus: 10 } }, 21),
        P('lekki_epe_reclamation', 'Lekki-Epe Land Reclamation', 'Engineered landmasses to create new economic free-trade zones.', 'infrastructure', 40, { sectors: { infrastructure: 35, trade: 20 }, modifiers: { gdpGrowth: 0.06, fdiMultiplier: 1.5, infraBonus: 20 } }, 22),
        P('automated_logistics', 'Automated Drone Logistics', 'City-wide autonomous delivery and freight network.', 'infrastructure', 28, { sectors: { infrastructure: 30, technology: 25 }, modifiers: { gdpGrowth: 0.04, satisfactionBonus: 10 } }, 23),
        P('genomic_medicine', 'Genomic Medicine Rollout', 'Personalized DNA-based healthcare for all citizens.', 'health', 25, { sectors: { healthcare: 40, technology: 20 }, modifiers: { satisfactionBonus: 20, populationGrowth: 0.015 } }, 24),
        P('smart_city_os', 'Lagos Smart City OS', 'Complete AI integration of all city services and infrastructure.', 'technology', 38, { sectors: { technology: 45, infrastructure: 30, security: 25 }, modifiers: { fdiMultiplier: 1.4, gdpGrowth: 0.05, infraBonus: 15 } }, 25),
        P('continental_free_trade_hub', 'Continental Trade Apex', 'The absolute center of all African continental free trade.', 'trade', 45, { sectors: { trade: 50, infrastructure: 25 }, modifiers: { gdpGrowth: 0.08, fdiMultiplier: 1.6 } }, 26),
        P('nextgen_education', 'Neuro-Optimized Education', 'AI-tailored learning pathways revolutionizing the workforce.', 'education', 30, { sectors: { education: 45, technology: 20 }, modifiers: { employmentBonus: 8, gdpGrowth: 0.03 } }, 27),
        P('hydrogen_economy', 'Hydrogen Fuel Economy', 'Pioneering green hydrogen production and export.', 'energy', 42, { sectors: { energy: 50, trade: 25 }, modifiers: { gdpGrowth: 0.06, fdiMultiplier: 1.35, satisfactionBonus: 15 } }, 28),
        P('neural_infrastructure', 'Public Neural-Net Infrastructure', 'Brain-computer interface grid for lightning-fast public access.', 'technology', 48, { sectors: { technology: 55, security: 30 }, modifiers: { gdpGrowth: 0.07, satisfactionBonus: 20 } }, 29),
        P('megacity_integration', 'Megalopolis Integration', 'Seamless economic integration of Lagos, Ogun, and Oyo states.', 'infrastructure', 60, { sectors: { infrastructure: 50, housing: 40, trade: 30 }, modifiers: { gdpGrowth: 0.1, populationGrowth: 0.03, satisfactionBonus: 30 } }, 30)
    ];

    // Procedurally generate continuous maintenance/upgrade policies for each turn (1-30)
    // This ensures there are always ~10 new upgrade options unlocked every single turn
    const recurringData = [
        { cat: 'infrastructure', sec: 'infrastructure', name: 'Infrastructure' },
        { cat: 'education', sec: 'education', name: 'Education' },
        { cat: 'technology', sec: 'technology', name: 'Technology' },
        { cat: 'trade', sec: 'trade', name: 'Trade' },
        { cat: 'health', sec: 'healthcare', name: 'Healthcare' },
        { cat: 'energy', sec: 'energy', name: 'Energy' },
        { cat: 'housing', sec: 'housing', name: 'Housing' },
        { cat: 'security', sec: 'security', name: 'Security' },
        { cat: 'tourism', sec: 'tourism', name: 'Tourism' }
    ];

    for (let t = 1; t <= 30; t++) {
        recurringData.forEach(d => {
            const cost = 1.5 + (t * 0.5);
            ALL_POLICIES.push(P(
                `continuous_${d.cat}_t${t}`,
                `${d.name} Expansion Phase ${t}`,
                `Ongoing continuous development for ${d.name} in Year ${2024 + t}.`,
                d.cat,
                Math.round(cost * 10) / 10,
                { sectors: { [d.sec]: 2 }, modifiers: { gdpGrowth: 0.001, satisfactionBonus: 1 } },
                t
            ));
        });
    }

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
