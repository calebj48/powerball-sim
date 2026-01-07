// Message feed component for displaying simulation messages
// Supports auto-scroll and timed message delays

'use client';

import { useEffect, useRef } from 'react';

interface Message {
  id: number;
  text: string;
  timestamp: number;
}

interface MessageFeedProps {
  messages: Message[];
  className?: string;
}

export default function MessageFeed({ messages, className = '' }: MessageFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`relative bg-gradient-to-br from-[#0a0a0f] to-[#16213e] border border-[#00f0ff]/20 p-6 rounded-xl font-['JetBrains_Mono'] text-sm overflow-y-auto shadow-[inset_0_0_20px_rgba(0,240,255,0.1)] ${className}`}>
      {/* Terminal-style scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(0deg,transparent_50%,rgba(0,240,255,0.03)_50%)] bg-[length:100%_4px] rounded-xl"></div>

      {messages.length === 0 ? (
        <div className="text-[#718096] flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-[#00f0ff] rounded-full animate-pulse"></span>
          Waiting for simulation to start...
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <div key={msg.id} className="mb-2 text-[#00f0ff] leading-relaxed hover:text-[#ff0080] transition-colors">
              <span className="text-[#718096] mr-2">{'>'}</span>
              {msg.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
}
