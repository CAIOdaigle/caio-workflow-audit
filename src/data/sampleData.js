import { v4 as uuidv4 } from 'uuid';
import { subDays, format } from 'date-fns';

// Generate sample data for the last two weeks
export const generateSampleData = () => {
  const today = new Date();
  const entries = [];

  // Sample activities for each category
  const sampleActivities = {
    1: [ // Client Advisory
      "AI Council meeting with Acme Corp",
      "Strategy session - Digital transformation roadmap",
      "Executive presentation on AI adoption",
      "Advisory call with CFO on ROI metrics",
      "Workshop facilitation - AI use case identification"
    ],
    2: [ // Pilot Management
      "Pilot status review - Customer service chatbot",
      "Documentation of pilot outcomes",
      "Troubleshooting integration issues",
      "Team sync on pilot progress",
      "Success metrics review meeting"
    ],
    3: [ // Research & Evaluation
      "Reading latest AI industry reports",
      "Evaluating new LLM capabilities",
      "Vendor demo - Document processing tool",
      "Competitive analysis research",
      "Testing new automation platform"
    ],
    4: [ // Governance & Documentation
      "Updating AI usage policy",
      "Writing compliance documentation",
      "Framework revision for data governance",
      "Process documentation updates",
      "Risk assessment template creation"
    ],
    5: [ // Communication
      "Email responses and follow-ups",
      "Slack messages and team updates",
      "Writing weekly status report",
      "Preparing training materials",
      "Meeting notes and action items"
    ],
    6: [ // Administration
      "Scheduling upcoming meetings",
      "Invoice preparation",
      "File organization and cleanup",
      "Calendar management",
      "Expense report submission"
    ]
  };

  // Create entries for each day in the last 14 days (weekdays only)
  for (let i = 1; i <= 14; i++) {
    const date = subDays(today, i);
    const dayOfWeek = date.getDay();

    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const dateStr = format(date, 'yyyy-MM-dd');

    // Morning block - typically meetings/advisory
    if (Math.random() > 0.3) {
      const category = Math.random() > 0.5 ? 1 : 2;
      entries.push({
        id: uuidv4(),
        date: dateStr,
        startTime: '09:00',
        endTime: '10:30',
        duration: 1.5,
        activity: sampleActivities[category][Math.floor(Math.random() * sampleActivities[category].length)],
        categoryId: category,
        notes: '',
        createdAt: new Date().toISOString()
      });
    }

    // Mid-morning - often communication
    entries.push({
      id: uuidv4(),
      date: dateStr,
      startTime: '10:30',
      endTime: '11:00',
      duration: 0.5,
      activity: sampleActivities[5][Math.floor(Math.random() * sampleActivities[5].length)],
      categoryId: 5,
      notes: '',
      createdAt: new Date().toISOString()
    });

    // Late morning - research or governance
    if (Math.random() > 0.4) {
      const category = Math.random() > 0.5 ? 3 : 4;
      entries.push({
        id: uuidv4(),
        date: dateStr,
        startTime: '11:00',
        endTime: '12:00',
        duration: 1,
        activity: sampleActivities[category][Math.floor(Math.random() * sampleActivities[category].length)],
        categoryId: category,
        notes: '',
        createdAt: new Date().toISOString()
      });
    }

    // Afternoon - mixed
    const afternoonCategory = [1, 2, 3, 5][Math.floor(Math.random() * 4)];
    entries.push({
      id: uuidv4(),
      date: dateStr,
      startTime: '14:00',
      endTime: '15:30',
      duration: 1.5,
      activity: sampleActivities[afternoonCategory][Math.floor(Math.random() * sampleActivities[afternoonCategory].length)],
      categoryId: afternoonCategory,
      notes: '',
      createdAt: new Date().toISOString()
    });

    // Late afternoon - communication and admin
    entries.push({
      id: uuidv4(),
      date: dateStr,
      startTime: '15:30',
      endTime: '16:00',
      duration: 0.5,
      activity: sampleActivities[5][Math.floor(Math.random() * sampleActivities[5].length)],
      categoryId: 5,
      notes: '',
      createdAt: new Date().toISOString()
    });

    // End of day admin
    if (Math.random() > 0.5) {
      entries.push({
        id: uuidv4(),
        date: dateStr,
        startTime: '16:00',
        endTime: '16:30',
        duration: 0.5,
        activity: sampleActivities[6][Math.floor(Math.random() * sampleActivities[6].length)],
        categoryId: 6,
        notes: '',
        createdAt: new Date().toISOString()
      });
    }
  }

  return entries.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return a.startTime.localeCompare(b.startTime);
  });
};
