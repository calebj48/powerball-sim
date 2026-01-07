// Mode 4: Fast Win (Generate until historical match)

'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import TicketDisplay from '@/components/TicketDisplay';
import { useDrawings } from '@/context/DrawingsContext';
import { runUntilWinFast } from '@/lib/powerball';
import { Ticket } from '@/lib/types';

export default function FastWinPage() {
  const { drawings } = useDrawings();
  const [running, setRunning] = useState(false);
  const [ticketsChecked, setTicketsChecked] = useState(0);
  const [result, setResult] = useState<{
    ticket: Ticket;
    date: string;
    ticketsGenerated: number;
  } | null>(null);
  const stopRef = useRef(false);

  const handleStart = async () => {
    setRunning(true);
    setTicketsChecked(0);
    setResult(null);
    stopRef.current = false;

    try {
      const winResult = await runUntilWinFast(
        drawings,
        (checked) => setTicketsChecked(checked),
        () => stopRef.current
      );

      setResult(winResult);
      setRunning(false);
    } catch (err: any) {
      if (err.message === 'Stopped by user') {
        // User stopped it
      } else {
        console.error(err);
      }
      setRunning(false);
    }
  };

  const handleStop = () => {
    stopRef.current = true;
  };

  const handleReset = () => {
    setTicketsChecked(0);
    setResult(null);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Menu
          </Link>
          <h1 className="text-6xl font-bold font-['Teko'] tracking-wide bg-gradient-to-r from-[#00f0ff] to-[#ff0080] bg-clip-text text-transparent mb-3">Fast Win</h1>
          <p className="text-gray-600">Generate tickets until one matches a historical winner</p>
        </div>

        {/* Explanation */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-8">
          <div className="font-semibold text-blue-900 mb-2">How this works:</div>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Continuously generates random tickets</li>
            <li>Checks each against ALL historical drawings (15+ years)</li>
            <li>Stops when finding a ticket matching any historical winner</li>
            <li>Fast because it checks 800+ historical drawings per ticket</li>
          </ul>
        </div>

        {/* Controls */}
        {!running && !result && (
          <div className="mb-8">
            <button
              onClick={handleStart}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Start Simulation
            </button>
          </div>
        )}

        {running && (
          <div className="mb-8">
            <button
              onClick={handleStop}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Stop Simulation
            </button>
          </div>
        )}

        {/* Progress */}
        {running && (
          <div className="bg-white border-2 border-gray-300 rounded-lg p-8 mb-8">
            <div className="text-center">
              <div className="text-lg text-gray-600 mb-2">Tickets Checked</div>
              <div className="text-5xl font-bold text-blue-600 mb-4">
                {ticketsChecked.toLocaleString()}
              </div>
              <div className="animate-pulse text-gray-500">Searching for a winner...</div>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-green-900 mb-4">
                🎉 WINNING TICKET FOUND! 🎉
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="text-lg font-semibold text-gray-700 mb-4">Winning Ticket:</div>
              <div className="flex justify-center mb-4">
                <TicketDisplay ticket={result.ticket} />
              </div>
              <div className="text-center text-gray-700">
                <div className="mb-2">
                  <span className="font-semibold">Winning draw date:</span> {result.date}
                </div>
                <div>
                  <span className="font-semibold">Total tickets generated:</span>{' '}
                  {result.ticketsGenerated.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleReset}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Run Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
