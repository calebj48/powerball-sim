// Mode 1: Random Ticket Generator

'use client';

import { useState } from 'react';
import Link from 'next/link';
import TicketDisplay from '@/components/TicketDisplay';
import { useDrawings } from '@/context/DrawingsContext';
import { generateRandomTicket, checkTicket } from '@/lib/powerball';
import { Ticket } from '@/lib/types';

export default function RandomTicketPage() {
  const { drawings } = useDrawings();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [result, setResult] = useState<{ checked: boolean; won: boolean; date?: string } | null>(null);
  const [checking, setChecking] = useState(false);

  const handleGenerate = () => {
    const newTicket = generateRandomTicket();
    setTicket(newTicket);
    setResult(null);
  };

  const handleCheck = async () => {
    if (!ticket) return;

    setChecking(true);
    // Simulate delay like Python's time.sleep(1)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const checkResult = checkTicket(ticket, drawings);
    setResult({
      checked: true,
      won: checkResult.won,
      date: checkResult.date
    });

    setChecking(false);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#00f0ff] hover:text-[#ff0080] mb-6 font-['Outfit'] font-medium transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Menu
          </Link>
          <h1 className="text-6xl font-bold font-['Teko'] tracking-wide bg-gradient-to-r from-[#00f0ff] to-[#ff0080] bg-clip-text text-transparent mb-3">
            RANDOM TICKET
          </h1>
          <p className="text-lg text-[#a0aec0] font-['Outfit']">
            Generate a random Powerball ticket and check if it ever won historically
          </p>
        </div>

        {/* Generate Button */}
        <div className="mb-8">
          <button
            onClick={handleGenerate}
            className="relative group bg-gradient-to-r from-[#00f0ff] to-[#ff0080] text-white font-bold font-['Outfit'] py-4 px-10 rounded-xl text-lg transition-all duration-300 shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(255,0,128,0.6)] hover:scale-105"
          >
            <span className="relative z-10">Generate Random Ticket</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff0080] to-[#00f0ff] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>

        {/* Ticket Display */}
        {ticket && (
          <div className="relative bg-gradient-to-br from-[#16213e] to-[#1a1a2e] border border-white/10 rounded-2xl p-8 mb-8 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/5 to-transparent rounded-2xl"></div>

            <div className="relative z-10">
              <div className="text-xl font-semibold font-['Teko'] tracking-wide text-[#00f0ff] mb-6 uppercase">
                Your Ticket:
              </div>
              <TicketDisplay ticket={ticket} className="justify-center" />

              {/* Check Button */}
              {!result && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleCheck}
                    disabled={checking}
                    className="relative group bg-gradient-to-r from-[#ffd700] to-[#ff6b00] disabled:from-gray-600 disabled:to-gray-700 text-white font-bold font-['Outfit'] py-3 px-10 rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:shadow-[0_0_50px_rgba(255,215,0,0.6)] disabled:shadow-none hover:scale-105 disabled:scale-100"
                  >
                    {checking ? 'Checking...' : 'Check Against Historical Data'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Result Display */}
        {result && result.checked && (
          <div className={`relative border-2 rounded-2xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.5)] ${
            result.won
              ? 'bg-gradient-to-br from-[#16213e] to-[#1a1a2e] border-[#ffd700]'
              : 'bg-gradient-to-br from-[#16213e] to-[#1a1a2e] border-white/10'
          }`}>
            {/* Glow effect for winner */}
            {result.won && (
              <div className="absolute inset-0 bg-[#ffd700] blur-2xl opacity-20 rounded-2xl"></div>
            )}

            <div className="relative z-10 text-center">
              <div className="text-5xl font-bold font-['Teko'] tracking-wide mb-4">
                {result.won ? (
                  <span className="bg-gradient-to-r from-[#ffd700] to-[#ff6b00] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,215,0,0.8)]">
                    🎉 JACKPOT WINNER! 🎉
                  </span>
                ) : (
                  <span className="text-[#a0aec0]">NO WIN</span>
                )}
              </div>
              <div className="text-xl font-['Outfit'] text-white/90 mb-2">
                {result.won
                  ? `You would have WON the lottery on ${result.date}`
                  : 'Sorry — this ticket never won.'}
              </div>
              {!result.won && (
                <div className="text-sm text-[#718096] italic mt-2">
                  Try again... the odds are only 1 in 292,201,338
                </div>
              )}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={handleGenerate}
                className="relative group bg-gradient-to-r from-[#00f0ff] to-[#ff0080] text-white font-bold font-['Outfit'] py-3 px-8 rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(255,0,128,0.6)] hover:scale-105"
              >
                Generate Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
