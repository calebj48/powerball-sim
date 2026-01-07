// Web Worker for Realistic Simulation
// Runs the simulation in background thread to keep UI responsive

// Types (duplicated here since workers don't share main thread scope)
type Ticket = {
  whites: number[];
  powerball: number;
};

type WorkerMessage =
  | { action: 'start'; ticket: Ticket }
  | { action: 'stop' };

type WorkerResponse =
  | { type: 'message'; text: string; delay?: number }
  | { type: 'progress'; stats: { ticketsGenerated: number; moneySpent: number; yearsWaited: number } }
  | { type: 'complete'; result: { ticket: Ticket; ticketsGenerated: number; moneySpent: number; yearsWaited: number } }
  | { type: 'error'; error: string };

let stopFlag = false;

// Helper: generate random ticket (duplicated from main thread)
function generateRandomTicket(): Ticket {
  const whites: number[] = [];
  const available = Array.from({ length: 69 }, (_, i) => i + 1);

  for (let i = 0; i < 5; i++) {
    const idx = Math.floor(Math.random() * available.length);
    whites.push(available[idx]);
    available.splice(idx, 1);
  }

  whites.sort((a, b) => a - b);
  const powerball = Math.floor(Math.random() * 26) + 1;

  return { whites, powerball };
}

// Helper: delay function
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main simulation function
async function runRealisticSimulationWorker(ticket: Ticket) {
  let counter = 0;

  postMessage({
    type: 'message',
    text: 'Generating tickets until a winning ticket is found (this may take a while)...'
  } as WorkerResponse);

  while (true) {
    if (stopFlag) {
      postMessage({ type: 'error', error: 'Stopped by user' } as WorkerResponse);
      return;
    }

    // Generate ONE random drawing
    const drawWhites = generateRandomTicket().whites.sort((a, b) => a - b);
    const drawPowerball = Math.floor(Math.random() * 26) + 1;

    // Check if match
    const ticketWhites = [...ticket.whites].sort((a, b) => a - b);
    const whitesMatch = ticketWhites.every((n, i) => n === drawWhites[i]);
    const powerballMatch = ticket.powerball === drawPowerball;

    if (whitesMatch && powerballMatch) {
      // WINNING SEQUENCE
      postMessage({ type: 'message', text: '-----------------------------' } as WorkerResponse);
      postMessage({ type: 'message', text: 'WINNING TICKET FOUND', delay: 2000 } as WorkerResponse);
      postMessage({
        type: 'message',
        text: `Ticket numbers: ${ticket.whites.join(' ')} ${ticket.powerball.toString().padStart(2, '0')}`
      } as WorkerResponse);
      postMessage({
        type: 'message',
        text: `Total tickets generated: ${(counter + 1).toLocaleString()}`,
        delay: 2000
      } as WorkerResponse);
      postMessage({
        type: 'message',
        text: 'Congratulations, you won the lottery!',
        delay: 2000
      } as WorkerResponse);
      postMessage({
        type: 'message',
        text: `You spent about $${(2 * (counter + 1)).toLocaleString()} to get here.`,
        delay: 2000
      } as WorkerResponse);
      postMessage({
        type: 'message',
        text: 'You won about $141 million after taxes.',
        delay: 2000
      } as WorkerResponse);

      const years = (3 * (counter + 1)) / 365;
      postMessage({
        type: 'message',
        text: `You spent about ${years.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })} years waiting for the drawings.`,
        delay: 2000
      } as WorkerResponse);
      postMessage({
        type: 'message',
        text: 'Enjoy your retirement!',
        delay: 2000
      } as WorkerResponse);

      postMessage({
        type: 'complete',
        result: {
          ticket,
          ticketsGenerated: counter + 1,
          moneySpent: 2 * (counter + 1),
          yearsWaited: years
        }
      } as WorkerResponse);

      return;
    }

    counter++;

    // Progress update every 1M
    if (counter % 1000000 === 0) {
      postMessage({
        type: 'message',
        text: `Generated ${counter.toLocaleString()} tickets so far...`
      } as WorkerResponse);
      postMessage({
        type: 'progress',
        stats: {
          ticketsGenerated: counter,
          moneySpent: 2 * counter,
          yearsWaited: (3 * counter) / 365
        }
      } as WorkerResponse);
    }

    // MILESTONE MESSAGES - EXACT from Python
    if (counter === 3500001) {
      postMessage({
        type: 'message',
        text: 'This mode checks one ticket against random drawings, simulating real odds.'
      } as WorkerResponse);
      await delay(2000);
      postMessage({
        type: 'message',
        text: 'This is opposed to the other mode that checks 15 years of real drawings per ticket.'
      } as WorkerResponse);
      await delay(2000);
      postMessage({
        type: 'message',
        text: 'AKA this mode is WAY slower.'
      } as WorkerResponse);
    }

    if (counter === 5230000) {
      postMessage({
        type: 'message',
        text: 'If you want to stop at any time, click the Stop button'
      } as WorkerResponse);
    }

    if (counter === 12000000) {
      postMessage({
        type: 'message',
        text: 'Probability wise, it will take 292 million tickets on average to win.'
      } as WorkerResponse);
      await delay(2000);
      postMessage({
        type: 'message',
        text: "that's about 30 times longer than you've been waiting already."
      } as WorkerResponse);
      await delay(2000);
      postMessage({
        type: 'message',
        text: 'Now realize that each of the the tens of millions of tickets being generated would cost $2...'
      } as WorkerResponse);
    }

    if (counter === 51390000) {
      postMessage({
        type: 'message',
        text: "At this point, you've spent over $100 million on lottery tickets."
      } as WorkerResponse);
      await delay(2000);
      postMessage({
        type: 'message',
        text: 'I admire your dedication, but...'
      } as WorkerResponse);
      await delay(2000);
      postMessage({
        type: 'message',
        text: "it's still going to be a while."
      } as WorkerResponse);
    }

    if (counter === 102000000) {
      postMessage({
        type: 'message',
        text: 'After $200 million spent on powerball tickets at 7/11,'
      } as WorkerResponse);
      await delay(2000);
      postMessage({
        type: 'message',
        text: 'And over 821,000 years of waiting for drawings,'
      } as WorkerResponse);
      await delay(2000);
      postMessage({
        type: 'message',
        text: 'You are just over a third of the way to the average expected time to win.'
      } as WorkerResponse);
    }

    if (counter === 150900000) {
      postMessage({
        type: 'message',
        text: "It's been 1.2 million years of drawings so far."
      } as WorkerResponse);
      await delay(2000);
      postMessage({
        type: 'message',
        text: "And you've spent $300 million on tickets."
      } as WorkerResponse);
      await delay(2000);
      postMessage({
        type: 'message',
        text: 'And if you won right now (still leaving you in debt at this point)...'
      } as WorkerResponse);
      await delay(2000);
      postMessage({
        type: 'message',
        text: 'You would be statistically LUCKY to have won this early.'
      } as WorkerResponse);
    }

    if (counter === 180050000) {
      postMessage({
        type: 'message',
        text: "Still you haven't won."
      } as WorkerResponse);
      await delay(2000);
      postMessage({
        type: 'message',
        text: "This is why you won't win the lottery."
      } as WorkerResponse);
    }

    if (counter === 292000000) {
      postMessage({
        type: 'message',
        text: 'It has been an estimated 2.3 million years of drawings.'
      } as WorkerResponse);
      await delay(2000);
      postMessage({
        type: 'message',
        text: "And you've spent $584 million on tickets."
      } as WorkerResponse);
      await delay(2000);
      postMessage({
        type: 'message',
        text: "On average, this is when you'd expect to win the lottery."
      } as WorkerResponse);
    }

    if (counter === 320000000) {
      postMessage({
        type: 'message',
        text: 'Unfortunately, expected is not guaranteed.'
      } as WorkerResponse);
      await delay(2000);
      postMessage({
        type: 'message',
        text: "You still haven't won your 1 in 292 million chance after 300 million chances"
      } as WorkerResponse);
      await delay(2000);
      postMessage({
        type: 'message',
        text: "And that isn't even (statistically speaking) THAT unlucky"
      } as WorkerResponse);
    }

    // Yield to event loop every 10k iterations
    if (counter % 10000 === 0) {
      await delay(0);
    }
  }
}

// Message handler
self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  if (e.data.action === 'start') {
    stopFlag = false;
    runRealisticSimulationWorker(e.data.ticket);
  } else if (e.data.action === 'stop') {
    stopFlag = true;
  }
};

// Export empty object to satisfy TypeScript
export {};
