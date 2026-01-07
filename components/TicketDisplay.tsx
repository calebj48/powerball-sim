// Visual ticket display component
// Shows 5 white balls + 1 powerball with proper styling

import { Ticket } from '@/lib/types';

interface TicketDisplayProps {
  ticket: Ticket;
  className?: string;
}

export default function TicketDisplay({ ticket, className = '' }: TicketDisplayProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* White balls */}
      {ticket.whites.map((num, idx) => (
        <div
          key={idx}
          className="relative w-16 h-16 group"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          {/* Outer glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00f0ff] to-[#ff0080] blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>

          {/* Ball */}
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center border-2 border-white/50 shadow-[0_0_20px_rgba(0,240,255,0.4),inset_0_2px_10px_rgba(255,255,255,0.8)] group-hover:scale-110 transition-transform">
            <span className="text-2xl font-bold font-['JetBrains_Mono'] bg-gradient-to-br from-[#1a1a2e] to-[#16213e] bg-clip-text text-transparent">
              {num}
            </span>
          </div>
        </div>
      ))}

      {/* Separator */}
      <div className="text-3xl font-bold font-['Teko'] text-[#00f0ff] mx-1 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">
        +
      </div>

      {/* Powerball */}
      <div
        className="relative w-16 h-16 group"
        style={{ animationDelay: '500ms' }}
      >
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff0080] to-[#ff0000] blur-lg opacity-60 group-hover:opacity-80 transition-opacity animate-pulse"></div>

        {/* Ball */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#ff0080] to-[#ff0000] flex items-center justify-center border-2 border-[#ff0080] shadow-[0_0_30px_rgba(255,0,128,0.6),inset_0_2px_10px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform">
          <span className="text-2xl font-bold font-['JetBrains_Mono'] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {ticket.powerball.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}
