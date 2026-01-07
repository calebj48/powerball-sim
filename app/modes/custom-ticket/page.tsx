// Mode 2: Custom Ticket Creator

'use client';

import { useState } from 'react';
import Link from 'next/link';
import TicketDisplay from '@/components/TicketDisplay';
import { useDrawings } from '@/context/DrawingsContext';
import { validateCustomTicket, checkTicket } from '@/lib/powerball';
import { Ticket } from '@/lib/types';

export default function CustomTicketPage() {
  const { drawings } = useDrawings();
  const [whites, setWhites] = useState<string[]>(['', '', '', '', '']);
  const [powerball, setPowerball] = useState('');
  const [error, setError] = useState<string>('');
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [result, setResult] = useState<{ checked: boolean; won: boolean; date?: string } | null>(null);
  const [checking, setChecking] = useState(false);

  const handleWhiteChange = (index: number, value: string) => {
    const newWhites = [...whites];
    newWhites[index] = value;
    setWhites(newWhites);
    setError('');
  };

  const handleCreateTicket = () => {
    // Parse numbers
    const whiteNumbers = whites.map(w => parseInt(w, 10)).filter(n => !isNaN(n));
    const powerballNumber = parseInt(powerball, 10);

    // Validate
    const validation = validateCustomTicket(whiteNumbers, powerballNumber);

    if (!validation.valid) {
      setError(validation.error || 'Invalid ticket');
      return;
    }

    // Create ticket with sorted whites
    const sortedWhites = [...whiteNumbers].sort((a, b) => a - b);
    setTicket({ whites: sortedWhites, powerball: powerballNumber });
    setResult(null);
    setError('');
  };

  const handleCheck = async () => {
    if (!ticket) return;

    setChecking(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const checkResult = checkTicket(ticket, drawings);
    setResult({
      checked: true,
      won: checkResult.won,
      date: checkResult.date
    });

    setChecking(false);
  };

  const handleReset = () => {
    setWhites(['', '', '', '', '']);
    setPowerball('');
    setTicket(null);
    setResult(null);
    setError('');
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
            CUSTOM TICKET
          </h1>
          <p className="text-lg text-[#a0aec0] font-['Outfit']">
            Create your own ticket and see if it would have ever won
          </p>
        </div>

        {/* Input Form */}
        {!ticket && (
          <div className="relative bg-gradient-to-br from-[#16213e] to-[#1a1a2e] border border-white/10 rounded-2xl p-8 mb-8 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/5 to-transparent rounded-2xl"></div>

            <div className="relative z-10">
              <div className="mb-6">
                <label className="block text-xl font-semibold font-['Teko'] tracking-wide text-[#00f0ff] mb-4 uppercase">
                  White Balls (1-69):
                </label>
                <div className="grid grid-cols-5 gap-4">
                  {whites.map((value, idx) => (
                    <input
                      key={idx}
                      type="number"
                      min="1"
                      max="69"
                      value={value}
                      onChange={(e) => handleWhiteChange(idx, e.target.value)}
                      placeholder={`${idx + 1}`}
                      className="w-full px-4 py-3 text-center text-xl font-['JetBrains_Mono'] font-bold bg-[#0a0a0f] border-2 border-white/20 text-white rounded-xl focus:border-[#00f0ff] focus:outline-none focus:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all placeholder:text-[#718096]"
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xl font-semibold font-['Teko'] tracking-wide text-[#ff0080] mb-4 uppercase">
                  Powerball (1-26):
                </label>
                <input
                  type="number"
                  min="1"
                  max="26"
                  value={powerball}
                  onChange={(e) => setPowerball(e.target.value)}
                  placeholder="PB"
                  className="w-32 px-4 py-3 text-center text-xl font-['JetBrains_Mono'] font-bold bg-[#0a0a0f] border-2 border-[#ff0080]/30 text-white rounded-xl focus:border-[#ff0080] focus:outline-none focus:shadow-[0_0_20px_rgba(255,0,128,0.3)] transition-all placeholder:text-[#718096]"
                />
              </div>

              {error && (
                <div className="relative bg-[#16213e] border-2 border-[#ff0080] rounded-xl p-4 mb-6 shadow-[0_0_30px_rgba(255,0,128,0.2)]">
                  <div className="text-[#ff0080] font-semibold font-['Outfit']">{error}</div>
                </div>
              )}

              <button
                onClick={handleCreateTicket}
                className="relative group bg-gradient-to-r from-[#00f0ff] to-[#ff0080] text-white font-bold font-['Outfit'] py-4 px-10 rounded-xl text-lg transition-all duration-300 shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(255,0,128,0.6)] hover:scale-105"
              >
                <span className="relative z-10">Create Ticket</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff0080] to-[#00f0ff] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>
        )}

        {/* Ticket Display */}
        {ticket && (
          <div className="relative bg-gradient-to-br from-[#16213e] to-[#1a1a2e] border border-white/10 rounded-2xl p-8 mb-8 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/5 to-transparent rounded-2xl"></div>

            <div className="relative z-10">
              <div className="text-xl font-semibold font-['Teko'] tracking-wide text-[#00f0ff] mb-6 uppercase">
                Your Ticket:
              </div>
              <TicketDisplay ticket={ticket} className="justify-center" />

              {/* Check Button */}
              {!result && (
                <div className="mt-8 flex gap-4 justify-center">
                  <button
                    onClick={handleCheck}
                    disabled={checking}
                    className="relative group bg-gradient-to-r from-[#ffd700] to-[#ff6b00] disabled:from-gray-600 disabled:to-gray-700 text-white font-bold font-['Outfit'] py-3 px-10 rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:shadow-[0_0_50px_rgba(255,215,0,0.6)] disabled:shadow-none hover:scale-105 disabled:scale-100"
                  >
                    {checking ? 'Checking...' : 'Check Ticket'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-[#16213e] border-2 border-white/20 hover:border-[#ff0080] text-white font-bold font-['Outfit'] py-3 px-10 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,0,128,0.3)] hover:scale-105"
                  >
                    Reset
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
                onClick={handleReset}
                className="relative group bg-gradient-to-r from-[#00f0ff] to-[#ff0080] text-white font-bold font-['Outfit'] py-3 px-8 rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(255,0,128,0.6)] hover:scale-105"
              >
                Create Another Ticket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
