// Mode 5: Realistic Simulation
// THE MOST IMPORTANT MODE - preserves ALL humor and milestone messages

'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import TicketDisplay from '@/components/TicketDisplay';
import MessageFeed from '@/components/MessageFeed';
import StatsDisplay from '@/components/StatsDisplay';
import { generateRandomTicket, validateCustomTicket } from '@/lib/powerball';
import { Ticket } from '@/lib/types';

interface Message {
  id: number;
  text: string;
  timestamp: number;
}

export default function RealisticWinPage() {
  const [started, setStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [ticketMode, setTicketMode] = useState<'random' | 'custom'>('random');
  const [whites, setWhites] = useState<string[]>(['', '', '', '', '']);
  const [powerball, setPowerball] = useState('');
  const [error, setError] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState({
    ticketsGenerated: 0,
    moneySpent: 0,
    yearsWaited: 0
  });
  const [result, setResult] = useState<{
    ticket: Ticket;
    ticketsGenerated: number;
    moneySpent: number;
    yearsWaited: number;
  } | null>(null);

  const messageIdRef = useRef(0);
  const workerRef = useRef<Worker | null>(null);
  const messageQueueRef = useRef<Array<{ text: string; delay?: number }>>([]);
  const processingQueueRef = useRef(false);

  // Initialize worker
  useEffect(() => {
    // Create worker
    workerRef.current = new Worker(
      new URL('../../../workers/realistic-sim.worker.ts', import.meta.url)
    );

    // Handle messages from worker
    workerRef.current.onmessage = (e) => {
      const data = e.data;

      if (data.type === 'message') {
        // Add message to queue
        messageQueueRef.current.push({ text: data.text, delay: data.delay });
        processMessageQueue();
      } else if (data.type === 'progress') {
        setStats(data.stats);
      } else if (data.type === 'complete') {
        setResult(data.result);
        setRunning(false);
      } else if (data.type === 'error') {
        if (data.error !== 'Stopped by user') {
          addMessage(data.error);
        }
        setRunning(false);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Process message queue with delays
  const processMessageQueue = async () => {
    if (processingQueueRef.current) return;
    processingQueueRef.current = true;

    while (messageQueueRef.current.length > 0) {
      const msg = messageQueueRef.current.shift();
      if (msg) {
        addMessage(msg.text);
        if (msg.delay) {
          await new Promise(resolve => setTimeout(resolve, msg.delay));
        }
      }
    }

    processingQueueRef.current = false;
  };

  const addMessage = (text: string) => {
    const msg: Message = {
      id: messageIdRef.current++,
      text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, msg]);
  };

  const handleWhiteChange = (index: number, value: string) => {
    const newWhites = [...whites];
    newWhites[index] = value;
    setWhites(newWhites);
    setError('');
  };

  const handleStart = () => {
    let newTicket: Ticket;

    if (ticketMode === 'custom') {
      // Parse and validate custom numbers
      const whiteNumbers = whites.map(w => parseInt(w, 10)).filter(n => !isNaN(n));
      const powerballNumber = parseInt(powerball, 10);

      const validation = validateCustomTicket(whiteNumbers, powerballNumber);

      if (!validation.valid) {
        setError(validation.error || 'Invalid ticket');
        return;
      }

      // Create ticket with sorted whites
      const sortedWhites = [...whiteNumbers].sort((a, b) => a - b);
      newTicket = { whites: sortedWhites, powerball: powerballNumber };
    } else {
      // Generate random ticket
      newTicket = generateRandomTicket();
    }

    setTicket(newTicket);
    setStarted(true);
    setRunning(true);
    setMessages([]);
    setStats({ ticketsGenerated: 0, moneySpent: 0, yearsWaited: 0 });
    setResult(null);
    setError('');

    // Start worker
    workerRef.current?.postMessage({ action: 'start', ticket: newTicket });
  };

  const handleStop = () => {
    workerRef.current?.postMessage({ action: 'stop' });
    setRunning(false);
  };

  const handleReset = () => {
    setStarted(false);
    setRunning(false);
    setTicket(null);
    setTicketMode('random');
    setWhites(['', '', '', '', '']);
    setPowerball('');
    setError('');
    setMessages([]);
    setStats({ ticketsGenerated: 0, moneySpent: 0, yearsWaited: 0 });
    setResult(null);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Menu
          </Link>
          <h1 className="text-6xl font-bold font-['Teko'] tracking-wide bg-gradient-to-r from-[#00f0ff] to-[#ff0080] bg-clip-text text-transparent mb-3">Realistic Simulation</h1>
          <p className="text-gray-600">Experience the TRUE odds of winning (1 in 292 million)</p>
        </div>

        {/* Warning */}
        {!started && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-8 mb-8">
            <div className="text-2xl font-bold text-yellow-900 mb-4">⚠️ Warning ⚠️</div>
            <div className="text-yellow-800 space-y-2 mb-6">
              <p>This mode simulates <strong>real lottery odds</strong>.</p>
              <p>
                It generates ONE ticket and checks it against ONE random drawing at a time,
                just like in real life.
              </p>
              <p>
                With odds of <strong>1 in 292,201,338</strong>, this will take a{' '}
                <strong>VERY long time</strong>.
              </p>
              <p>You'll see humorous milestone messages along the way that put the odds into perspective.</p>
            </div>

            {/* Ticket Mode Selection */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6">
              <label className="block text-lg font-semibold mb-4 text-gray-900">
                Choose Your Ticket:
              </label>

              <div className="space-y-4 mb-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="ticketMode"
                    value="random"
                    checked={ticketMode === 'random'}
                    onChange={() => setTicketMode('random')}
                    className="w-5 h-5 mr-3"
                  />
                  <span className="text-gray-700 font-medium">Random Ticket (generated automatically)</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="ticketMode"
                    value="custom"
                    checked={ticketMode === 'custom'}
                    onChange={() => setTicketMode('custom')}
                    className="w-5 h-5 mr-3"
                  />
                  <span className="text-gray-700 font-medium">Custom Ticket (choose your own numbers)</span>
                </label>
              </div>

              {/* Custom Number Inputs */}
              {ticketMode === 'custom' && (
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                  <div className="mb-4">
                    <label className="block text-md font-semibold mb-3 text-gray-900">
                      White Balls (1-69):
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {whites.map((value, idx) => (
                        <input
                          key={idx}
                          type="number"
                          min="1"
                          max="69"
                          value={value}
                          onChange={(e) => handleWhiteChange(idx, e.target.value)}
                          placeholder={`${idx + 1}`}
                          className="w-full px-3 py-2 text-center text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-black bg-white"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-md font-semibold mb-3 text-gray-900">
                      Powerball (1-26):
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="26"
                      value={powerball}
                      onChange={(e) => setPowerball(e.target.value)}
                      placeholder="PB"
                      className="w-24 px-3 py-2 text-center text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-black bg-white"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 mb-4">
                      <div className="text-red-700 font-semibold">{error}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleStart}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
            >
              I Understand, Start Simulation
            </button>
          </div>
        )}

        {/* Simulation Running */}
        {started && (
          <>
            {/* Ticket Display */}
            {ticket && (
              <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-8">
                <div className="text-lg font-semibold text-gray-700 mb-4">Your Ticket:</div>
                <TicketDisplay ticket={ticket} />
              </div>
            )}

            {/* Stats Display */}
            <div className="mb-8">
              <StatsDisplay
                ticketsGenerated={stats.ticketsGenerated}
                moneySpent={stats.moneySpent}
                yearsWaited={stats.yearsWaited}
              />
            </div>

            {/* Controls */}
            <div className="mb-8 flex gap-4">
              {running ? (
                <button
                  onClick={handleStop}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
                >
                  Stop Simulation
                </button>
              ) : !result ? (
                <button
                  onClick={handleReset}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
                >
                  Reset
                </button>
              ) : null}
            </div>

            {/* Message Feed */}
            <div className="mb-8">
              <div className="text-lg font-semibold text-gray-700 mb-4">Simulation Log:</div>
              <MessageFeed messages={messages} className="h-96" />
            </div>

            {/* Result Display */}
            {result && (
              <div className="bg-green-50 border-4 border-green-500 rounded-lg p-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-900 mb-6">
                    🎉 YOU WON THE LOTTERY! 🎉
                  </div>

                  <div className="bg-white rounded-lg p-6 mb-6">
                    <div className="text-lg font-semibold text-gray-700 mb-4">Winning Ticket:</div>
                    <div className="flex justify-center mb-6">
                      <TicketDisplay ticket={result.ticket} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 text-left">
                      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                        <div className="text-sm text-blue-600 font-semibold mb-1">
                          Tickets Generated
                        </div>
                        <div className="text-2xl font-bold text-blue-900">
                          {result.ticketsGenerated.toLocaleString()}
                        </div>
                      </div>

                      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                        <div className="text-sm text-red-600 font-semibold mb-1">Money Spent</div>
                        <div className="text-2xl font-bold text-red-900">
                          ${result.moneySpent.toLocaleString()}
                        </div>
                      </div>

                      <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                        <div className="text-sm text-purple-600 font-semibold mb-1">
                          Years Waited
                        </div>
                        <div className="text-2xl font-bold text-purple-900">
                          {result.yearsWaited.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </div>
                      </div>

                      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                        <div className="text-sm text-green-600 font-semibold mb-1">Winnings</div>
                        <div className="text-2xl font-bold text-green-900">$141,000,000</div>
                      </div>
                    </div>

                    <div className="mt-6 text-lg font-semibold text-gray-700">
                      Net Result:{' '}
                      <span
                        className={
                          result.moneySpent > 141000000 ? 'text-red-600' : 'text-green-600'
                        }
                      >
                        {result.moneySpent > 141000000 ? '-' : '+'}$
                        {Math.abs(141000000 - result.moneySpent).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
                  >
                    Try Again (Please Don't)
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
