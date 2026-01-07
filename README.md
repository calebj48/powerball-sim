# Powerball Lottery Simulator

A Next.js web application that simulates Powerball lottery gameplay based on 15+ years of historical data. This is a direct TypeScript translation of the Python script, preserving all logic, algorithms, and humor.

## Overview

Experience the futility of the lottery through 5 interactive simulation modes:

1. **Random Ticket** - Generate random tickets and check if they ever won historically
2. **Custom Ticket** - Create your own ticket numbers and test them
3. **Bulk Simulation** - Generate thousands of tickets and test them all
4. **Fast Win** - Generate tickets until finding a historical match
5. **Realistic Simulation** - Experience TRUE 1-in-292-million odds (with hilarious milestone messages)

## Features

- 🎯 **Direct Python-to-TypeScript translation** - All core logic matches the original Python script exactly
- 📊 **Real historical data** - Uses actual Powerball drawings from 2010-present
- 😄 **All humor preserved** - Mode 5 includes every milestone message from the original
- ⚡ **Web Worker optimization** - Mode 5 runs in background thread for responsive UI
- 🎨 **Modern UI** - Built with Next.js, TypeScript, and Tailwind CSS

## Installation & Setup

### Prerequisites

- Node.js 18+ and npm installed

### Steps

1. **Navigate to the project**
   ```bash
   cd C:\Users\Caleb\Desktop\powerball-sim
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
powerball-sim/
├── app/
│   ├── modes/
│   │   ├── random-ticket/    # Mode 1: Random ticket generator
│   │   ├── custom-ticket/    # Mode 2: Custom ticket creator
│   │   ├── bulk-sim/         # Mode 3: Bulk simulation
│   │   ├── fast-win/         # Mode 4: Fast win mode
│   │   └── realistic-win/    # Mode 5: Realistic simulation
│   ├── page.tsx              # Main menu
│   └── layout.tsx            # Root layout
├── lib/
│   ├── types.ts              # TypeScript type definitions
│   ├── csv-loader.ts         # CSV data loading
│   └── powerball.ts          # Core simulation logic (6 functions)
├── components/
│   ├── TicketDisplay.tsx     # Visual ticket component
│   ├── MessageFeed.tsx       # Simulation message log
│   ├── StatsDisplay.tsx      # Real-time statistics
│   └── ModeCard.tsx          # Menu cards
├── workers/
│   └── realistic-sim.worker.ts  # Web Worker for Mode 5
├── context/
│   └── DrawingsContext.tsx   # Global CSV data provider
└── public/
    └── data/
        └── powerball_data.csv   # Historical drawing data
```

## Core Functions (Translated from Python)

All functions in `lib/powerball.ts` are direct TypeScript translations:

1. **`generateRandomTicket()`** - Generate random ticket (5 whites + powerball)
2. **`validateCustomTicket()`** - Validate user input
3. **`checkTicket()`** - Check ticket against historical drawings
4. **`generateAndTestNTickets()`** - Bulk ticket generation and testing
5. **`runUntilWinFast()`** - Generate until historical match
6. **`runRealisticSimulation()`** - Simulate real 1-in-292M odds with milestone messages

## Simulation Modes

### Mode 1: Random Ticket
- Generates one random ticket
- Checks against all historical drawings
- Shows if that exact combination ever won

### Mode 2: Custom Ticket
- Enter your own 5 white balls (1-69) and powerball (1-26)
- Validates input (no duplicates, correct ranges)
- Checks against historical data

### Mode 3: Bulk Simulation
- Generate 1000s of unique tickets
- Option to display all tickets
- Checks each against all historical drawings
- Shows wins/losses and dates

### Mode 4: Fast Win
- Continuously generates random tickets
- Checks each against 800+ historical drawings
- Stops when finding a match
- Fast because it leverages historical data

### Mode 5: Realistic Simulation ⭐
**THE CROWN JEWEL** - Preserves all humor from the Python version

- Simulates ACTUAL lottery odds (1 in 292,201,338)
- Generates ONE ticket vs ONE random drawing at a time
- Progress updates every 1 million tickets
- **8 hilarious milestone messages** at specific thresholds:
  - 3,500,001 tickets - "AKA this mode is WAY slower"
  - 5,230,000 tickets - Reminder to stop
  - 12,000,000 tickets - Probability reality check
  - 51,390,000 tickets - "$100 million spent..."
  - 102,000,000 tickets - "821,000 years of drawings"
  - 150,900,000 tickets - "You'd be statistically LUCKY"
  - 180,050,000 tickets - "This is why you won't win"
  - 292,000,000 tickets - Average expected time
  - 320,000,000 tickets - "expected is not guaranteed"

## Technical Details

### Probability Calculations
- **Odds:** 1 in 292,201,338 (exact same as Python)
- **Cost per ticket:** $2
- **Years formula:** (3 * tickets) / 365
- **Winnings:** $141 million after taxes

### CSV Data Format
```
Draw Date,Winning Numbers,Multiplier
09/26/2020,11 21 27 36 62 24,3
```

### Web Worker Implementation
Mode 5 uses Web Workers to:
- Run simulation in background thread
- Keep UI responsive during millions of iterations
- Allow Stop button to work immediately
- Update stats every 1M tickets

## Development

### Build for production
```bash
npm run build
```

### Run production build
```bash
npm start
```

### Lint code
```bash
npm run lint
```

## Comparison to Original Python

### Exact Matches
✅ All random number generation logic
✅ All validation rules
✅ All probability calculations
✅ All milestone thresholds
✅ All message text (word-for-word)
✅ All timing delays (2 seconds)

### Improvements
✨ Modern web UI instead of CLI
✨ Web Worker for non-blocking simulation
✨ Visual ticket display
✨ Real-time statistics dashboard
✨ Responsive design

## Credits

Based on the original Python Powerball simulator by Caleb.

Translated to TypeScript/Next.js while preserving all logic, humor, and personality.

## License

For educational and entertainment purposes.

---

**Remember:** The house always wins. The lottery is a tax on people who are bad at math. This simulator exists to prove it. 😄
