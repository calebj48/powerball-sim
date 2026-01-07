// Mode selection card component for the main menu

'use client';

import Link from 'next/link';

interface ModeCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
}

export default function ModeCard({ title, description, icon, href }: ModeCardProps) {
  return (
    <Link href={href}>
      <div className="group relative bg-gradient-to-br from-[#16213e] to-[#1a1a2e] border border-white/10 rounded-2xl p-6 hover:border-[#00f0ff] transition-all duration-500 cursor-pointer h-full flex flex-col overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/0 via-[#ff0080]/0 to-[#ffd700]/0 group-hover:from-[#00f0ff]/10 group-hover:via-[#ff0080]/5 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"></div>

        {/* Glowing corner accent */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#00f0ff] rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            {icon}
          </div>
          <h3 className="text-2xl font-bold font-['Teko'] tracking-wide text-white mb-3 group-hover:text-[#00f0ff] transition-colors duration-300">
            {title}
          </h3>
          <p className="text-[#a0aec0] flex-grow leading-relaxed font-['Outfit']">
            {description}
          </p>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00f0ff] via-[#ff0080] to-[#ffd700] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>
    </Link>
  );
}
