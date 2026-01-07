// Type definitions for Powerball simulation
// Direct TypeScript translations from Python data structures

export type Ticket = {
  whites: number[];      // 5 numbers, 1-69, sorted
  powerball: number;     // 1 number, 1-26
};

export type Drawing = {
  date: string;
  whites: number[];
  powerball: number;
};

export type SimulationResult = {
  won: boolean;
  date?: string;
  ticketsGenerated: number;
  moneySpent: number;
  yearsWaited: number;
};

export type BulkSimulationResult = {
  tickets: Ticket[];
  wins: Array<{ ticketIndex: number; date: string }>;
  losses: number;
};

export type ValidationResult = {
  valid: boolean;
  error?: string;
};
