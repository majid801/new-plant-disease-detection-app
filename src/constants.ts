export interface FarmerProblem {
  id: string;
  question: string;
  solution: string;
  category: 'soil' | 'water' | 'pests' | 'market' | 'general';
}

export const farmerProblems: FarmerProblem[] = [
  {
    id: "1",
    category: "soil",
    question: "How can I prevent soil erosion on my farm?",
    solution: "Use cover crops like clover or rye, practice contour plowing, and build terraces on slopes. Planting windbreaks (trees/shrubs) also helps reduce wind erosion."
  },
  {
    id: "2",
    category: "water",
    question: "What are the best ways to manage water during a drought?",
    solution: "Implement drip irrigation to minimize waste, use mulch to retain soil moisture, and harvest rainwater during the wet season. Choose drought-resistant crop varieties."
  },
  {
    id: "3",
    category: "pests",
    question: "How do I deal with a sudden locust infestation?",
    solution: "Monitor fields regularly. Use biopesticides like Metarhizium acridum. Coordinate with local agricultural authorities for large-scale management and early warning systems."
  },
  {
    id: "4",
    category: "market",
    question: "How can I get better prices for my produce?",
    solution: "Join a farmer cooperative to increase bargaining power. Explore direct-to-consumer markets or digital platforms. Diversify crops to avoid market saturation."
  },
  {
    id: "5",
    category: "soil",
    question: "My soil is too acidic. What should I do?",
    solution: "Apply agricultural lime (calcium carbonate) based on a soil test. This neutralizes acidity and improves nutrient availability for most crops."
  },
  {
    id: "6",
    category: "general",
    question: "How can I reduce post-harvest losses?",
    solution: "Ensure proper drying of grains, use hermetic storage bags, and improve handling during transport. Invest in small-scale cold storage if dealing with perishables."
  },
  {
    id: "7",
    category: "pests",
    question: "What is Integrated Pest Management (IPM)?",
    solution: "IPM is an ecosystem-based strategy that focuses on long-term prevention of pests through a combination of techniques such as biological control, habitat manipulation, and use of resistant varieties."
  },
  {
    id: "8",
    category: "soil",
    question: "How do I improve soil fertility naturally?",
    solution: "Incorporate compost, animal manure, and green manure. Practice crop rotation with legumes (beans/peas) which fix nitrogen in the soil."
  },
  {
    id: "9",
    category: "water",
    question: "How can I test if my irrigation water is safe?",
    solution: "Send a sample to a certified laboratory to check for salinity, heavy metals, and pathogens. High salinity can stunt growth and damage soil structure."
  },
  {
    id: "10",
    category: "general",
    question: "What are the benefits of crop rotation?",
    solution: "It breaks pest and disease cycles, improves soil structure, balances nutrient demand, and reduces the need for chemical fertilizers and pesticides."
  },
  {
    id: "11",
    category: "soil",
    question: "How to manage soil salinity?",
    solution: "Improve drainage to leach salts away, use gypsum to replace sodium, and plant salt-tolerant crops like barley or sugar beet."
  },
  {
    id: "12",
    category: "pests",
    question: "How to control weeds without heavy chemicals?",
    solution: "Use mulching, practice timely mechanical weeding, use cover crops to smother weeds, and implement stale seedbed techniques."
  },
  {
    id: "13",
    category: "market",
    question: "How to find reliable market information?",
    solution: "Use government agricultural apps, listen to local radio bulletins, and participate in farmer groups on social media to track daily price trends."
  },
  {
    id: "14",
    category: "water",
    question: "Is rainwater harvesting worth the investment?",
    solution: "Yes, especially in dry regions. It provides a backup water source, reduces erosion from runoff, and is generally free of salts and chemicals found in groundwater."
  },
  {
    id: "15",
    category: "general",
    question: "How to protect crops from wild animals?",
    solution: "Install solar-powered electric fencing, use bio-fencing (thorny shrubs), or use sound/light deterrents. Community-level guarding is also effective."
  },
  {
    id: "16",
    category: "soil",
    question: "What is the best time for soil testing?",
    solution: "Test your soil every 2-3 years, ideally after harvest and before the next planting season, to allow time for applying necessary amendments."
  },
  {
    id: "17",
    category: "pests",
    question: "How to identify beneficial insects?",
    solution: "Learn to recognize ladybugs, lacewings, and hoverflies. They eat harmful pests like aphids. Avoid broad-spectrum pesticides that kill these 'farmer friends'."
  },
  {
    id: "18",
    category: "general",
    question: "How to start organic farming?",
    solution: "Start small, phase out synthetic chemicals over 3 years, focus on soil health, and seek certification from local organic bodies for better market value."
  },
  {
    id: "19",
    category: "water",
    question: "How to prevent waterlogging in fields?",
    solution: "Improve field drainage with ditches or subsurface pipes. Avoid over-irrigation and level the land to prevent water from pooling in low spots."
  },
  {
    id: "20",
    category: "market",
    question: "What is value addition in farming?",
    solution: "Processing raw produce (e.g., making jam from fruit, flour from grain) to increase shelf life and sell at a higher price than raw materials."
  },
  {
    id: "21",
    category: "soil",
    question: "How to fix soil compaction?",
    solution: "Avoid using heavy machinery on wet soil. Use deep-rooting cover crops (like tillage radish) and practice controlled traffic farming."
  },
  {
    id: "22",
    category: "pests",
    question: "How to manage fungal diseases in humid weather?",
    solution: "Ensure proper plant spacing for airflow, remove infected plant parts immediately, and use preventive organic fungicides like neem oil or copper-based sprays."
  },
  {
    id: "23",
    category: "general",
    question: "How to manage farm waste?",
    solution: "Compost crop residues and manure. Recycle plastic mulch and containers. Use biogas digesters to turn animal waste into energy and fertilizer."
  },
  {
    id: "24",
    category: "water",
    question: "How to reduce evaporation from soil?",
    solution: "Apply organic mulch (straw, wood chips) or plastic mulch. Irrigate during early morning or late evening when temperatures are lower."
  },
  {
    id: "25",
    category: "market",
    question: "How to access government subsidies?",
    solution: "Register with the local agricultural department, keep land records updated, and regularly visit the official government portal or local 'Kisan' centers."
  },
  {
    id: "26",
    category: "soil",
    question: "What are the signs of nitrogen deficiency?",
    solution: "Yellowing of older leaves (chlorosis), stunted growth, and thin stems. Apply nitrogen-rich fertilizers like urea or composted manure."
  },
  {
    id: "27",
    category: "pests",
    question: "How to control aphids naturally?",
    solution: "Spray plants with a strong stream of water, use insecticidal soap, or release natural predators like ladybugs. Neem oil is also very effective."
  },
  {
    id: "28",
    category: "general",
    question: "How to choose the right seeds?",
    solution: "Buy certified seeds from reputable sources. Choose varieties that are resistant to local pests and suited to your specific climate and soil type."
  },
  {
    id: "29",
    category: "water",
    question: "How to maintain a drip irrigation system?",
    solution: "Flush the lines regularly to prevent clogging, clean filters weekly, and check for leaks or blocked emitters throughout the season."
  },
  {
    id: "30",
    category: "market",
    question: "How to manage price risk?",
    solution: "Use forward contracts if available, diversify your crop portfolio, and invest in storage to sell when prices are higher instead of immediately after harvest."
  },
  {
    id: "31",
    category: "soil",
    question: "How to increase soil organic matter?",
    solution: "Leave crop residues in the field, use cover crops, and regularly apply compost or well-rotted manure. Avoid excessive tilling."
  },
  {
    id: "32",
    category: "pests",
    question: "How to deal with rodents in storage?",
    solution: "Use rodent-proof storage containers (metal or thick plastic), keep storage areas clean, and use traps or natural predators like cats."
  },
  {
    id: "33",
    category: "general",
    question: "How to prepare for extreme weather events?",
    solution: "Stay updated with weather forecasts. Have an emergency plan for livestock, secure equipment, and consider crop insurance for financial protection."
  },
  {
    id: "34",
    category: "water",
    question: "What is fertigation?",
    solution: "It is the application of fertilizers through the irrigation system. It ensures nutrients are delivered directly to the root zone, reducing waste."
  },
  {
    id: "35",
    category: "market",
    question: "How to build a brand for my farm products?",
    solution: "Focus on quality and consistency. Use simple, clean packaging and tell your farm's story (e.g., 'pesticide-free', 'family-owned') to connect with customers."
  },
  {
    id: "36",
    category: "soil",
    question: "How to identify phosphorus deficiency?",
    solution: "Leaves may turn dark green or purple, especially on the undersides. Growth is stunted and root development is poor. Use bone meal or rock phosphate."
  },
  {
    id: "37",
    category: "pests",
    question: "How to manage root-knot nematodes?",
    solution: "Practice crop rotation with non-host plants (like marigolds), use solarization (covering soil with plastic in summer), and add organic matter."
  },
  {
    id: "38",
    category: "general",
    question: "How to improve labor efficiency?",
    solution: "Invest in small-scale mechanization, provide proper training to workers, and plan tasks according to the weather and crop cycle."
  },
  {
    id: "39",
    category: "water",
    question: "How to measure soil moisture easily?",
    solution: "Use the 'feel method' (squeeze a handful of soil), or invest in simple tensiometers or digital moisture sensors for more accuracy."
  },
  {
    id: "40",
    category: "market",
    question: "How to export farm produce?",
    solution: "Ensure your products meet international quality standards (like GlobalGAP), get necessary export licenses, and partner with experienced exporters."
  },
  {
    id: "41",
    category: "soil",
    question: "How to prevent nutrient leaching?",
    solution: "Apply fertilizers in smaller, frequent doses rather than one large dose. Use slow-release fertilizers and maintain good soil organic matter."
  },
  {
    id: "42",
    category: "pests",
    question: "How to control spider mites?",
    solution: "Increase humidity around plants, use predatory mites, or apply neem oil or sulfur-based sprays. Avoid dusty conditions which favor mites."
  },
  {
    id: "43",
    category: "general",
    question: "How to maintain farm machinery?",
    solution: "Follow the manufacturer's service schedule, keep equipment clean and dry, and perform regular checks on oil, filters, and moving parts."
  },
  {
    id: "44",
    category: "water",
    question: "How to use greywater for irrigation?",
    solution: "Only use greywater from sinks/showers (not toilets). Avoid water with heavy detergents or bleach. Apply it to the soil, not directly on edible plant parts."
  },
  {
    id: "45",
    category: "market",
    question: "How to use social media for marketing?",
    solution: "Post high-quality photos of your farm and produce. Engage with local community groups and offer 'farm-to-table' updates to build a loyal following."
  },
  {
    id: "46",
    category: "soil",
    question: "How to identify potassium deficiency?",
    solution: "Edges of leaves turn brown and look 'burnt' (scorching). Stems are weak and fruit quality is poor. Use wood ash or potassium sulfate."
  },
  {
    id: "47",
    category: "pests",
    question: "How to manage whiteflies?",
    solution: "Use yellow sticky traps, introduce natural predators like Encarsia formosa, or use neem oil. Reflective mulches can also deter them."
  },
  {
    id: "48",
    category: "general",
    question: "How to improve farm safety?",
    solution: "Provide protective gear (PPE), store chemicals in locked areas, ensure all machinery has safety guards, and train everyone on first aid."
  },
  {
    id: "49",
    category: "water",
    question: "How to manage salinity in greenhouse farming?",
    solution: "Use high-quality source water, ensure excellent drainage, and periodically 'flush' the growing medium with excess water to wash out salts."
  },
  {
    id: "50",
    category: "market",
    question: "How to get organic certification?",
    solution: "Contact a local certifying agency, maintain detailed records of all farm inputs for 3 years, and pass an annual inspection of your farm practices."
  }
];
