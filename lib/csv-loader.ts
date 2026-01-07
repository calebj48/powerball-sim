// CSV loader for Powerball historical drawing data
// Based on Python CSV reading logic from the original script

import { Drawing } from './types';

/**
 * Loads and parses the Powerball historical drawings CSV file
 * Python equivalent: reading CSV_FILE in check_ticket() and other functions
 *
 * CSV Format:
 * - Row 0: Header (Draw Date,Winning Numbers,Multiplier)
 * - Row N: date, "num1 num2 num3 num4 num5 powerball", multiplier
 */
export async function loadDrawings(): Promise<Drawing[]> {
  try {
    const response = await fetch('/data/powerball_data.csv');
    const csvText = await response.text();

    const lines = csvText.split('\n');
    const drawings: Drawing[] = [];

    // Skip header (line 0)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines

      // Parse CSV row
      const parts = line.split(',');
      if (parts.length < 2) continue;

      const date = parts[0].trim();
      const numbersStr = parts[1].trim();

      // Parse "num1 num2 num3 num4 num5 powerball"
      // Python: nums = list(map(int, row[1].split()))
      const nums = numbersStr.split(/\s+/).map(n => parseInt(n, 10));

      if (nums.length < 6) continue; // Invalid row

      // Python: draw_whites = sorted(nums[:5])
      const whites = nums.slice(0, 5).sort((a, b) => a - b);

      // Python: draw_pb = nums[5]
      const powerball = nums[5];

      drawings.push({
        date,
        whites,
        powerball
      });
    }

    return drawings;
  } catch (error) {
    console.error('Failed to load powerball data:', error);
    throw new Error('Could not load historical drawing data');
  }
}
