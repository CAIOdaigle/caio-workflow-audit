export const categories = [
  {
    id: 1,
    name: "Client Advisory",
    shortCode: "ADV",
    color: "#0038ff",
    bgColor: "#e6ebff",
    description: "High-value strategic work. This is what clients pay for.",
    examples: [
      "AI Council meetings",
      "Strategy sessions",
      "Executive recommendations",
      "Client workshops",
      "Stakeholder presentations",
      "Advisory calls"
    ],
    isHighValue: true,
    isAutomatable: false
  },
  {
    id: 2,
    name: "Pilot Management",
    shortCode: "PLT",
    color: "#7c3aed",
    bgColor: "#ede9fe",
    description: "Tracking progress, documenting outcomes, troubleshooting. Necessary work that keeps initiatives on track.",
    examples: [
      "Pilot status reviews",
      "Progress documentation",
      "Troubleshooting issues",
      "Success metrics tracking",
      "Team coordination",
      "Implementation support"
    ],
    isHighValue: true,
    isAutomatable: false
  },
  {
    id: 3,
    name: "Research & Evaluation",
    shortCode: "RES",
    color: "#0891b2",
    bgColor: "#cffafe",
    description: "Monitoring the AI landscape. Assessing new tools. Evaluating vendors. Staying current so your advice stays relevant.",
    examples: [
      "Reading AI news and updates",
      "Tool evaluations",
      "Vendor assessments",
      "Industry research",
      "Competitive analysis",
      "Technology exploration"
    ],
    isHighValue: false,
    isAutomatable: true
  },
  {
    id: 4,
    name: "Governance & Documentation",
    shortCode: "GOV",
    color: "#059669",
    bgColor: "#d1fae5",
    description: "Policies, frameworks, compliance materials. The paperwork that protects organizations and enables scale.",
    examples: [
      "Policy writing",
      "Framework development",
      "Compliance documentation",
      "Process documentation",
      "Guidelines creation",
      "Audit preparation"
    ],
    isHighValue: false,
    isAutomatable: true
  },
  {
    id: 5,
    name: "Communication",
    shortCode: "COM",
    color: "#d97706",
    bgColor: "#fef3c7",
    description: "Executive updates, stakeholder reports, training materials, emails, Slack. The connective tissue between everything else.",
    examples: [
      "Email responses",
      "Status updates",
      "Slack messages",
      "Report writing",
      "Training materials",
      "Meeting follow-ups"
    ],
    isHighValue: false,
    isAutomatable: true
  },
  {
    id: 6,
    name: "Administration",
    shortCode: "ADM",
    color: "#dc2626",
    bgColor: "#fee2e2",
    description: "Scheduling, invoicing, file management, general overhead. Work that has to happen but doesn't drive client outcomes.",
    examples: [
      "Scheduling meetings",
      "Calendar management",
      "Invoicing",
      "File organization",
      "Expense reports",
      "General admin tasks"
    ],
    isHighValue: false,
    isAutomatable: true
  }
];

export const caioTrapBenchmark = {
  1: 8,   // Client Advisory
  2: 7,   // Pilot Management
  3: 20,  // Research & Evaluation
  4: 15,  // Governance & Documentation
  5: 30,  // Communication
  6: 20   // Administration
};

export const idealTarget = {
  1: 30,  // Client Advisory
  2: 25,  // Pilot Management
  3: 15,  // Research & Evaluation
  4: 10,  // Governance & Documentation
  5: 15,  // Communication
  6: 5    // Administration
};

export const getCategoryById = (id) => categories.find(c => c.id === id);

export const getHighValueCategories = () => categories.filter(c => c.isHighValue);
export const getAutomatableCategories = () => categories.filter(c => c.isAutomatable);
