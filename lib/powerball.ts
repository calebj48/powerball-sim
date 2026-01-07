// Core Powerball simulation logic
// Direct TypeScript translations of Python functions

import { Ticket, Drawing, BulkSimulationResult, ValidationResult } from './types';

/**
 * Generate a random Powerball ticket
 * Python: generate_random_ticket()
 *   whites = sorted(random.sample(range(1, 70), 5))
 *   powerball = random.randint(1, 26)
 */
export function generateRandomTicket(): Ticket {
  const whites: number[] = [];
  const available = Array.from({ length: 69 }, (_, i) => i + 1);

  // Sample 5 unique numbers from 1-69
  for (let i = 0; i < 5; i++) {
    const idx = Math.floor(Math.random() * available.length);
    whites.push(available[idx]);
    available.splice(idx, 1);
  }

  // Sort whites (Python does this with sorted())
  whites.sort((a, b) => a - b);

  // Random powerball 1-26
  const powerball = Math.floor(Math.random() * 26) + 1;

  return { whites, powerball };
}

/**
 * Validate a custom ticket
 * Python: make_custom_ticket() validation logic
 */
export function validateCustomTicket(
  whites: number[],
  powerball: number
): ValidationResult {
  // Check whites length
  if (whites.length !== 5) {
    return { valid: false, error: 'Must enter exactly 5 white ball numbers' };
  }

  // Check white ball range (1-69)
  for (const n of whites) {
    if (!Number.isInteger(n)) {
      return { valid: false, error: 'White balls must be integers' };
    }
    if (n < 1 || n > 69) {
      return { valid: false, error: 'White balls must be between 1 and 69' };
    }
  }

  // Check for duplicates
  const unique = new Set(whites);
  if (unique.size !== 5) {
    return { valid: false, error: 'White ball numbers must be unique' };
  }

  // Check powerball
  if (!Number.isInteger(powerball)) {
    return { valid: false, error: 'Powerball must be an integer' };
  }
  if (powerball < 1 || powerball > 26) {
    return { valid: false, error: 'Powerball must be between 1 and 26' };
  }

  return { valid: true };
}

/**
 * Check if a ticket matches any historical drawing
 * Python: check_ticket(whites, powerball)
 */
export function checkTicket(
  ticket: Ticket,
  drawings: Drawing[]
): { won: boolean; date?: string } {
  // Ensure whites are sorted for comparison
  const sortedWhites = [...ticket.whites].sort((a, b) => a - b);

  for (const drawing of drawings) {
    // Python: draw_whites = sorted(nums[:5])
    const drawWhites = [...drawing.whites].sort((a, b) => a - b);

    // Check if whites match AND powerball matches
    // Python: if whites == draw_whites and powerball == draw_pb
    const whitesMatch = sortedWhites.every((n, i) => n === drawWhites[i]);
    const powerballMatch = ticket.powerball === drawing.powerball;

    if (whitesMatch && powerballMatch) {
      return { won: true, date: drawing.date };
    }
  }

  return { won: false };
}

/**
 * Generate and test N unique tickets against all historical drawings
 * Python: generate_and_test_n_tickets()
 */
export async function generateAndTestNTickets(
  n: number,
  drawings: Drawing[],
  onProgress?: (current: number) => void
): Promise<BulkSimulationResult> {
  // Generate unique tickets using Set
  // Python: tickets = set()
  const ticketSet = new Set<string>();
  const tickets: Ticket[] = [];

  // Python: while len(tickets) < n
  while (tickets.length < n) {
    const ticket = generateRandomTicket();
    // Create unique key for deduplication
    const key = `${ticket.whites.join(',')}-${ticket.powerball}`;

    if (!ticketSet.has(key)) {
      ticketSet.add(key);
      tickets.push(ticket);
    }
  }

  // Check each ticket against all drawings
  // Python: wins = [], losses = 0
  const wins: Array<{ ticketIndex: number; date: string }> = [];
  let losses = 0;

  for (let i = 0; i < tickets.length; i++) {
    const result = checkTicket(tickets[i], drawings);

    if (result.won && result.date) {
      wins.push({ ticketIndex: i, date: result.date });
    } else {
      losses++;
    }

    onProgress?.(i + 1);

    // Yield to event loop periodically
    if (i % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  return { tickets, wins, losses };
}

/**
 * Generate tickets until finding one that matches a historical winner
 * Python: run_until_win_fast()
 */
export async function runUntilWinFast(
  drawings: Drawing[],
  onProgress?: (ticketsChecked: number) => void,
  shouldStop?: () => boolean
): Promise<{
  ticket: Ticket;
  date: string;
  ticketsGenerated: number;
}> {
  // Python: seen_tickets = set()
  const seenTickets = new Set<string>();
  let ticketsChecked = 0;

  while (true) {
    // Check if user requested stop
    if (shouldStop?.()) {
      throw new Error('Stopped by user');
    }

    const ticket = generateRandomTicket();
    const key = `${ticket.whites.join(',')}-${ticket.powerball}`;

    // Python: if ticket in seen_tickets: continue
    if (seenTickets.has(key)) continue;
    seenTickets.add(key);
    ticketsChecked++;

    // Check against all historical drawings
    const result = checkTicket(ticket, drawings);

    if (result.won && result.date) {
      return {
        ticket,
        date: result.date,
        ticketsGenerated: ticketsChecked
      };
    }

    // Update progress periodically
    if (ticketsChecked % 1000 === 0) {
      onProgress?.(ticketsChecked);
      // Yield to event loop
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}

/**
 * Run realistic lottery simulation with 1 in 292 million odds
 * Python: realism()
 *
 * THIS IS THE CRITICAL FUNCTION - preserves ALL humor and milestone messages
 */
export async function runRealisticSimulation(
  onMessage: (message: string, delay?: number) => void,
  onProgress: (stats: {
    ticketsGenerated: number;
    moneySpent: number;
    yearsWaited: number;
  }) => void,
  shouldStop?: () => boolean
): Promise<{
  ticket: Ticket;
  ticketsGenerated: number;
  moneySpent: number;
  yearsWaited: number;
}> {
  let counter = 0;

  // Generate ONE ticket at start (Python: whites = sorted(...), powerball = ...)
  const ticket = generateRandomTicket();

  onMessage('Generating tickets until a winning ticket is found (this may take a while)...');

  while (true) {
    if (shouldStop?.()) {
      throw new Error('Stopped by user');
    }

    // Generate ONE random drawing (not checking historical data)
    // Python: draw_whites = sorted(random.sample(range(1, 70), 5))
    const drawTicket = generateRandomTicket();
    const drawWhites = drawTicket.whites.sort((a, b) => a - b);
    const drawPowerball = Math.floor(Math.random() * 26) + 1;

    // Check if match
    const ticketWhites = [...ticket.whites].sort((a, b) => a - b);
    const whitesMatch = ticketWhites.every((n, i) => n === drawWhites[i]);
    const powerballMatch = ticket.powerball === drawPowerball;

    if (whitesMatch && powerballMatch) {
      // WINNING SEQUENCE - exact Python logic
      onMessage('-----------------------------');
      onMessage('WINNING TICKET FOUND', 2000);
      onMessage(
        `Ticket numbers: ${ticket.whites.join(' ')} ${ticket.powerball.toString().padStart(2, '0')}`
      );
      onMessage(`Total tickets generated: ${(counter + 1).toLocaleString()}`, 2000);
      onMessage('Congratulations, you won the lottery!', 2000);
      onMessage(`You spent about $${(2 * (counter + 1)).toLocaleString()} to get here.`, 2000);
      onMessage('You won about $141 million after taxes.', 2000);

      const years = (3 * (counter + 1)) / 365;
      onMessage(
        `You spent about ${years.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })} years waiting for the drawings.`,
        2000
      );
      onMessage('Enjoy your retirement!', 2000);

      return {
        ticket,
        ticketsGenerated: counter + 1,
        moneySpent: 2 * (counter + 1),
        yearsWaited: years
      };
    }

    counter++;

    // Progress update every 1M
    // Python: if counter % 1000000 == 0
    if (counter % 1000000 === 0) {
      onMessage(`Generated ${counter.toLocaleString()} tickets so far...`);
      onProgress({
        ticketsGenerated: counter,
        moneySpent: 2 * counter,
        yearsWaited: (3 * counter) / 365
      });
    }

    // MILESTONE MESSAGES - EXACT from Python with exact thresholds
    if (counter === 3500001) {
      onMessage('This mode checks one ticket against random drawings, simulating real odds.');
      await delay(2000);
      onMessage('This is opposed to the other mode that checks 15 years of real drawings per ticket.');
      await delay(2000);
      onMessage('AKA this mode is WAY slower.');
    }

    if (counter === 5230000) {
      onMessage('If you want to stop at any time, click the Stop button');
    }

    if (counter === 12000000) {
      onMessage('Probability wise, it will take 292 million tickets on average to win.');
      await delay(2000);
      onMessage("that's about 30 times longer than you've been waiting already.");
      await delay(2000);
      onMessage('Now realize that each of the the tens of millions of tickets being generated would cost $2...');
    }

    if (counter === 51390000) {
      onMessage("At this point, you've spent over $100 million on lottery tickets.");
      await delay(2000);
      onMessage('I admire your dedication, but...');
      await delay(2000);
      onMessage("it's still going to be a while.");
    }

    if (counter === 102000000) {
      onMessage('After $200 million spent on powerball tickets at 7/11,');
      await delay(2000);
      onMessage('And over 821,000 years of waiting for drawings,');
      await delay(2000);
      onMessage('You are just over a third of the way to the average expected time to win.');
    }

    if (counter === 150900000) {
      onMessage("It's been 1.2 million years of drawings so far.");
      await delay(2000);
      onMessage("And you've spent $300 million on tickets.");
      await delay(2000);
      onMessage('And if you won right now (still leaving you in debt at this point)...');
      await delay(2000);
      onMessage('You would be statistically LUCKY to have won this early.');
    }

    if (counter === 180050000) {
      onMessage("Still you haven't won.");
      await delay(2000);
      onMessage("This is why you won't win the lottery.");
    }

    if (counter === 292000000) {
      onMessage('It has been an estimated 2.3 million years of drawings.');
      await delay(2000);
      onMessage("And you've spent $584 million on tickets.");
      await delay(2000);
      onMessage("On average, this is when you'd expect to win the lottery.");
    }

    if (counter === 320000000) {
      onMessage('Unfortunately, expected is not guaranteed.');
      await delay(2000);
      onMessage("You still haven't won your 1 in 292 million chance after 300 million chances");
      await delay(2000);
      onMessage("And that isn't even (statistically speaking) THAT unlucky");
    }

    // Yield to event loop every 10k iterations to keep UI responsive
    if (counter % 10000 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}

/**
 * Helper function for delays (matches Python's time.sleep())
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
