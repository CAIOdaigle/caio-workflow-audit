// App-wide constants

// Target hours for the two-week audit period (based on 40hr/week full-time)
export const TARGET_HOURS = 80;

// Minimum entries required before showing "Continue to Review" button
export const MIN_ENTRIES_FOR_REVIEW = 5;

// Minimum hours for showing "meaningful insights" message
export const MIN_HOURS_FOR_INSIGHTS = 20;

// Thresholds for determining workflow health status
export const WORKFLOW_THRESHOLDS = {
  // Percentage of automatable work that indicates "CAIO Trap"
  TRAP_THRESHOLD: 40,
  // Minimum high-value percentage for "healthy" status
  HEALTHY_HIGH_VALUE: 30,
  // Maximum automatable percentage for "healthy" status
  HEALTHY_AUTOMATABLE: 30
};

// Time entry form constraints
export const ENTRY_CONSTRAINTS = {
  // Maximum days in the past allowed for entries
  MAX_DAYS_BACK: 14,
  // Activity description max length
  MAX_ACTIVITY_LENGTH: 500,
  // Notes max length
  MAX_NOTES_LENGTH: 1000
};

// Time picker configuration
export const TIME_PICKER = {
  START_HOUR: 6,
  END_HOUR: 22,
  INCREMENT_MINUTES: 15
};
