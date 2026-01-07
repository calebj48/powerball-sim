// Main menu landing page

'use client';

import ModeCard from '@/components/ModeCard';
import { useDrawings } from '@/context/DrawingsContext';

export default function Home() {
  const { loading, error } = useDrawings();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="text-6xl font-bold font-['Teko'] tracking-wider bg-gradient-to-r from-[#00f0ff] via-[#ff0080] to-[#ffd700] bg-clip-text text-transparent animate-pulse">
              LOADING
            </div>
            <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-[#00f0ff] via-[#ff0080] to-[#ffd700] opacity-30"></div>
          </div>
          <div className="text-lg text-[#a0aec0] font-['Outfit']">
            Loading 15+ years of historical drawings
          </div>
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00f0ff] animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 rounded-full bg-[#ff0080] animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 rounded-full bg-[#ffd700] animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="relative bg-[#16213e] border-2 border-[#ff0080] rounded-2xl p-8 max-w-md shadow-[0_0_50px_rgba(255,0,128,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff0080]/10 to-transparent rounded-2xl"></div>
          <div className="relative">
            <div className="text-4xl font-bold font-['Teko'] text-[#ff0080] mb-3 tracking-wide">ERROR</div>
            <div className="text-lg text-[#a0aec0]">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <h1 className="text-8xl md:text-9xl font-bold font-['Teko'] tracking-wider bg-gradient-to-r from-[#00f0ff] via-[#ff0080] to-[#ffd700] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,240,255,0.5)]">
              POWERBALL
            </h1>
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-[#00f0ff] via-[#ff0080] to-[#ffd700] opacity-20 -z-10"></div>
          </div>
          <div className="text-3xl font-bold font-['Teko'] tracking-widest text-white/80 mb-4 -mt-4">
            SIMULATOR
          </div>
          <p className="text-xl text-[#a0aec0] font-['Outfit'] max-w-2xl mx-auto">
            Experience the <span className="text-[#ff0080] font-semibold">futility</span> of the lottery with cold, hard data
          </p>

          {/* Decorative elements */}
          <div className="flex justify-center gap-4 mt-8">
            <div className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_10px_#00f0ff] float-animation"></div>
            <div className="w-2 h-2 rounded-full bg-[#ff0080] shadow-[0_0_10px_#ff0080] float-animation" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-2 h-2 rounded-full bg-[#ffd700] shadow-[0_0_10px_#ffd700] float-animation" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <ModeCard
            title="Random Ticket"
            description="Generate a random Powerball ticket and check if it would have won in the past 15 years of drawings"
            icon="🎲"
            href="/modes/random-ticket"
          />

          <ModeCard
            title="Custom Ticket"
            description="Create your own ticket and see if it would have won in the past 15 years of drawings"
            icon="✏️"
            href="/modes/custom-ticket"
          />

          <ModeCard
            title="Bulk Simulation"
            description="Generate thousands of tickets and test them all against almost 2,000 historical drawings"
            icon="📊"
            href="/modes/bulk-sim"
          />

          <ModeCard
            title="Fast Win"
            description="Generate tickets until one matches a historical drawing [2010-2025]"
            icon="⚡"
            href="/modes/fast-win"
          />

          <ModeCard
            title="Realistic Simulation"
            description="Experience the TRUE odds of winning (Warning: extremely slow)"
            icon="⏳"
            href="/modes/realistic-win"
          />
        </div>
      </div>
    </div>
  );
}
