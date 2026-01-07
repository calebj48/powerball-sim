// Mode 3: Bulk Ticket Simulation

'use client';

import { useState } from 'react';
import Link from 'next/link';
import TicketDisplay from '@/components/TicketDisplay';
import { useDrawings } from '@/context/DrawingsContext';
import { generateAndTestNTickets } from '@/lib/powerball';
import { Ticket } from '@/lib/types';

export default function BulkSimPage() {
  const { drawings } = useDrawings();
  const [quantity, setQuantity] = useState('1000');
  const [showTickets, setShowTickets] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [generating, setGenerating] = useState(false);
  const [checking, setChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    wins: Array<{ ticketIndex: number; date: string }>;
    losses: number;
  } | null>(null);

  const handleGenerate = async () => {
    const n = parseInt(quantity, 10);
    if (isNaN(n) || n <= 0) {
      alert('Please enter a valid positive number');
      return;
    }

    setGenerating(true);
    setChecking(true);
    setProgress(0);
    setResults(null);

    try {
      const result = await generateAndTestNTickets(
        n,
        drawings,
        (current) => setProgress(current)
      );

      setTickets(result.tickets);
      setResults({
        wins: result.wins,
        losses: result.losses
      });
      setGenerating(false);
      setChecking(false);
    } catch (err) {
      console.error(err);
      setGenerating(false);
      setChecking(false);
    }
  };

  const handleReset = () => {
    setTickets([]);
    setResults(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Menu
          </Link>
          <h1 className="text-6xl font-bold font-['Teko'] tracking-wide bg-gradient-to-r from-[#00f0ff] to-[#ff0080] bg-clip-text text-transparent mb-3">Bulk Simulation</h1>
          <p className="text-gray-600">Generate thousands of tickets and test them all against history</p>
        </div>

        {/* Input Form */}
        {tickets.length === 0 && (
          <div className="bg-white border-2 border-gray-300 rounded-lg p-8 mb-8">
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                How many tickets to generate?
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1000"
                className="w-48 px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showTickets}
                  onChange={(e) => setShowTickets(e.target.checked)}
                  className="w-5 h-5 mr-3"
                />
                <span className="text-gray-700">Display all tickets before checking</span>
              </label>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              {generating ? 'Generating...' : 'Generate & Check Tickets'}
            </button>
          </div>
        )}

        {/* Progress */}
        {checking && (
          <div className="bg-white border-2 border-gray-300 rounded-lg p-8 mb-8">
            <div className="text-lg font-semibold text-gray-700 mb-4">
              Checking tickets... {progress} / {quantity}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${(progress / parseInt(quantity)) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Ticket Display */}
        {showTickets && tickets.length > 0 && !results && (
          <div className="bg-white border-2 border-gray-300 rounded-lg p-8 mb-8">
            <div className="text-lg font-semibold text-gray-700 mb-4">Generated Tickets:</div>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {tickets.map((ticket, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-gray-600 w-16 text-right">#{idx + 1}:</span>
                  <TicketDisplay ticket={ticket} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="bg-white border-2 border-gray-300 rounded-lg p-8">
            <div className="text-2xl font-bold text-gray-900 mb-6">Results</div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 text-center">
                <div className="text-sm text-blue-600 font-semibold mb-2">Tickets Played</div>
                <div className="text-3xl font-bold text-blue-900">{tickets.length}</div>
              </div>

              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 text-center">
                <div className="text-sm text-green-600 font-semibold mb-2">Wins</div>
                <div className="text-3xl font-bold text-green-900">{results.wins.length}</div>
              </div>

              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 text-center">
                <div className="text-sm text-red-600 font-semibold mb-2">Losses</div>
                <div className="text-3xl font-bold text-red-900">{results.losses}</div>
              </div>
            </div>

            {results.wins.length > 0 && (
              <div className="mb-6">
                <div className="text-lg font-semibold text-gray-700 mb-4">Winning Tickets:</div>
                <div className="space-y-4">
                  {results.wins.map((win, idx) => (
                    <div key={idx} className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-green-900">Ticket #{win.ticketIndex + 1}</span>
                          <TicketDisplay ticket={tickets[win.ticketIndex]} />
                        </div>
                        <div className="text-green-700 font-semibold">
                          Won on {win.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleReset}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Run Another Simulation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
