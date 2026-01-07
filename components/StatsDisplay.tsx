// Stats display component for showing real-time simulation statistics

interface StatsDisplayProps {
  ticketsGenerated: number;
  moneySpent: number;
  yearsWaited: number;
  className?: string;
}

export default function StatsDisplay({
  ticketsGenerated,
  moneySpent,
  yearsWaited,
  className = ''
}: StatsDisplayProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {/* Tickets Generated */}
      <div className="relative group bg-gradient-to-br from-[#16213e] to-[#1a1a2e] border border-[#00f0ff]/30 rounded-xl p-6 text-center overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.2)]">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

        <div className="relative z-10">
          <div className="text-sm text-[#00f0ff] font-semibold font-['Outfit'] tracking-wider mb-2 uppercase">
            Tickets Generated
          </div>
          <div className="text-4xl font-bold font-['JetBrains_Mono'] text-white drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
            {ticketsGenerated.toLocaleString()}
          </div>
        </div>

        {/* Top corner glow */}
        <div className="absolute -top-8 -right-8 w-16 h-16 bg-[#00f0ff] rounded-full blur-2xl opacity-30"></div>
      </div>

      {/* Money Spent */}
      <div className="relative group bg-gradient-to-br from-[#16213e] to-[#1a1a2e] border border-[#ff0080]/30 rounded-xl p-6 text-center overflow-hidden shadow-[0_0_30px_rgba(255,0,128,0.2)]">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff0080]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

        <div className="relative z-10">
          <div className="text-sm text-[#ff0080] font-semibold font-['Outfit'] tracking-wider mb-2 uppercase">
            Money Spent
          </div>
          <div className="text-4xl font-bold font-['JetBrains_Mono'] text-white drop-shadow-[0_0_10px_rgba(255,0,128,0.5)]">
            ${moneySpent.toLocaleString()}
          </div>
        </div>

        {/* Top corner glow */}
        <div className="absolute -top-8 -right-8 w-16 h-16 bg-[#ff0080] rounded-full blur-2xl opacity-30"></div>
      </div>

      {/* Years Waited */}
      <div className="relative group bg-gradient-to-br from-[#16213e] to-[#1a1a2e] border border-[#ffd700]/30 rounded-xl p-6 text-center overflow-hidden shadow-[0_0_30px_rgba(255,215,0,0.2)]">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

        <div className="relative z-10">
          <div className="text-sm text-[#ffd700] font-semibold font-['Outfit'] tracking-wider mb-2 uppercase">
            Years Waited
          </div>
          <div className="text-4xl font-bold font-['JetBrains_Mono'] text-white drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
            {yearsWaited.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </div>
        </div>

        {/* Top corner glow */}
        <div className="absolute -top-8 -right-8 w-16 h-16 bg-[#ffd700] rounded-full blur-2xl opacity-30"></div>
      </div>
    </div>
  );
}
