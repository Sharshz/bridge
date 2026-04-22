'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown, Check, Info, Shield, Zap, RefreshCw, BarChart3, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BridgePage() {
  const [isReady, setIsReady] = useState(false);
  const [amount, setAmount] = useState('1.25');
  const [isBridging, setIsBridging] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready();
      } catch (e) {
        console.error('Failed to init Farcaster SDK', e);
      }
      setIsReady(true);
    };
    init();
  }, []);

  const handleBridge = () => {
    setIsBridging(true);
    setStep(1);
    // Simulate progression
    setTimeout(() => setStep(2), 3000);
    setTimeout(() => setStep(3), 8000);
    setTimeout(() => setStep(4), 15000);
  };

  if (!isReady) return null;

  return (
    <div className="flex flex-col h-screen font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 glass shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-base flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-500/20 text-white">
            BC
          </div>
          <span className="font-semibold text-sm tracking-tight">
            BASE CROSSING <span className="text-white/20 ml-1">v1.2.0</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-mono-custom uppercase tracking-wider text-white/60">Mainnet-1</span>
          </div>
          <button className="px-4 py-1.5 rounded-md bg-white text-black text-xs font-bold hover:bg-white/90 transition-colors shadow-xl shadow-white/5">
            CONNECT WALLET
          </button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 p-4 overflow-hidden">
        {/* Left Sidebar: Stats & History */}
        <section className="hidden md:flex col-span-3 flex-col gap-4 overflow-hidden">
          <div className="glass rounded-xl p-4 flex flex-col gap-3">
            <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-2">
              <BarChart3 className="w-3 h-3" /> Protocol Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <p className="text-[10px] text-white/40 mb-1">24H Volume</p>
                <p className="text-sm font-mono-custom font-bold">$12.8M</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <p className="text-[10px] text-white/40 mb-1">Active TVL</p>
                <p className="text-sm font-mono-custom font-bold">$42.4M</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-4 flex-1 flex flex-col overflow-hidden">
            <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4 flex items-center gap-2">
              <RefreshCw className="w-3 h-3" /> Recent Transfers
            </h3>
            <div className="space-y-1 overflow-y-auto pr-1 custom-scrollbar">
              {[
                { amount: '0.45 ETH', route: 'Base → Solana', status: 'SUCCESS', color: 'text-green-400' },
                { amount: '1,200 USDC', route: 'Base → Solana', status: 'PENDING', color: 'text-blue-400' },
                { amount: '2.14 ETH', route: 'Solana → Base', status: 'SUCCESS', color: 'text-green-400' },
                { amount: '125.0 SOL', route: 'Solana → Base', status: 'SUCCESS', color: 'text-green-400' },
                { amount: '0.12 ETH', route: 'Base → Solana', status: 'SUCCESS', color: 'text-green-400' },
                { amount: '500 USDC', route: 'Base → Solana', status: 'FAILED', color: 'text-red-400' },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 group hover:bg-white/5 px-2 rounded-lg transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">{tx.amount}</span>
                    <span className="text-[10px] text-white/30 uppercase font-mono-custom tracking-tighter">{tx.route}</span>
                  </div>
                  <span className={cn("text-[10px] font-bold font-mono-custom italic", tx.color)}>{tx.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Center: Bridge Interface */}
        <section className="col-span-1 md:col-span-6 flex items-center justify-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/20 blur-[120px] pointer-events-none"></div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg glass rounded-2xl p-6 border-white/10 card-active relative z-10"
          >
            <div className="flex justify-between items-end mb-8">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-[0.2em]">Bridge Engine</span>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  Cross-Chain Transfer
                  <div className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-mono-custom uppercase tracking-widest mt-1">
                    Powered by Li.Fi
                  </div>
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/40 block mb-1 uppercase tracking-widest font-bold">Estimated Time</span>
                <span className="text-sm font-mono-custom text-blue-400 font-bold">~ 2m 45s</span>
              </div>
            </div>

            <div className="space-y-2">
              {/* FROM SECTION */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors group">
                <div className="flex justify-between text-[10px] font-bold text-white/30 mb-3 uppercase tracking-widest">
                  <span>From</span>
                  <span>Balance: 2.45 ETH</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-base p-0.5 shadow-lg shadow-blue-500/20">
                      <div className="w-full h-full rounded-full bg-[#0A0A0C] flex items-center justify-center font-bold text-[9px] text-white">BASE</div>
                    </div>
                    <div>
                      <span className="text-lg font-bold block leading-none mb-1">Ethereum</span>
                      <span className="text-[10px] text-white/40 font-mono-custom uppercase tracking-tighter">Base Mainnet</span>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-transparent text-right text-3xl font-bold font-mono-custom focus:outline-none w-1/2 text-white placeholder-white/20" 
                  />
                </div>
              </div>

              {/* SWAP ICON */}
              <div className="flex justify-center -my-4 relative z-20">
                <div className="w-10 h-10 rounded-full bg-[#17171A] border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 hover:scale-110 transition-all shadow-2xl active:scale-95">
                  <ArrowDown className="w-5 h-5 text-blue-400" />
                </div>
              </div>

              {/* TO SECTION */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors group">
                <div className="flex justify-between text-[10px] font-bold text-white/30 mb-3 uppercase tracking-widest">
                  <span>To</span>
                  <span>Estimated Output</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-sol p-0.5 shadow-lg shadow-purple-500/20">
                      <div className="w-full h-full rounded-full bg-[#0A0A0C] flex items-center justify-center font-bold text-[9px] text-white">SOL</div>
                    </div>
                    <div>
                      <span className="text-lg font-bold block leading-none mb-1">wEthereum</span>
                      <span className="text-[10px] text-white/40 font-mono-custom uppercase tracking-tighter">Solana Network</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold font-mono-custom text-white/90">{(Number(amount) * 0.998).toFixed(4)}</div>
                    <div className="text-[10px] text-white/20 font-mono-custom uppercase tracking-widest mt-1">
                      $ {(Number(amount) * 2854.21).toLocaleString()} USD
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QUOTE DETAILS */}
            <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-white/30 flex items-center gap-1.5 uppercase tracking-widest"><RefreshCw className="w-3 h-3" /> Slippage Tolerance</span>
                <span className="font-mono-custom text-white/80">0.5%</span>
              </div>
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-white/30 flex items-center gap-1.5 uppercase tracking-widest"><Zap className="w-3 h-3" /> Bridge Fee</span>
                <span className="font-mono-custom text-white/80">$1.12 (0.0004 ETH)</span>
              </div>
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-white/30 flex items-center gap-1.5 uppercase tracking-widest"><Shield className="w-3 h-3" /> Security Mode</span>
                <span className="text-blue-400 uppercase font-black text-[9px] tracking-[0.2em] bg-blue-400/5 px-2 py-0.5 rounded border border-blue-400/10">Double Validation</span>
              </div>
            </div>

            <button 
              disabled={isBridging || !amount || Number(amount) <= 0}
              onClick={handleBridge}
              className={cn(
                "w-full mt-8 py-5 rounded-xl text-white font-black uppercase tracking-[0.2em] text-sm shadow-2xl transition-all active:scale-[0.98]",
                isBridging ? "opacity-50 cursor-not-allowed bg-white/10" : "gradient-base hover:shadow-blue-500/40"
              )}
            >
              {isBridging ? (
                <div className="flex items-center justify-center gap-3">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Transfer...</span>
                </div>
              ) : "Approve & Bridge Assets"}
            </button>

            <p className="mt-4 text-center text-[10px] text-white/20 font-mono-custom uppercase tracking-[0.1em]">
              The estimated bridge time depends on block finality.
            </p>
          </motion.div>
        </section>

        {/* Right Sidebar: Progress & Health */}
        <section className="hidden md:flex col-span-3 flex-col gap-4 overflow-hidden">
          <div className="glass rounded-xl p-4">
            <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Bridge Lifecycle
            </h3>
            <div className="space-y-8 relative">
              <div className="absolute left-2.5 top-0 bottom-0 w-px bg-white/5"></div>
              
              {[
                { title: 'Source Initiation', desc: 'Wallet signature verification', id: 1 },
                { title: 'Block Confirmation', desc: 'Base finality sequence', id: 2 },
                { title: 'Relayer Settlement', desc: 'Proof generation active', id: 3 },
                { title: 'Destination Mint', desc: 'Release on Solana SPL', id: 4 },
              ].map((s, i) => (
                <div key={i} className={cn(
                  "flex gap-4 items-start relative z-10 transition-all duration-500",
                  step < s.id && "opacity-20 grayscale",
                  step === s.id && "scale-105"
                )}>
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-mono-custom border",
                    step > s.id ? "bg-blue-500 border-blue-500 text-white" : 
                    step === s.id ? "bg-blue-500/20 border-blue-500 text-blue-400 ring-4 ring-blue-500/10" : 
                    "bg-white/5 border-white/10 text-white/40"
                  )}>
                    {step > s.id ? <Check className="w-3 h-3" /> : s.id}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-none mb-1">{s.title}</span>
                    <span className="text-[9px] text-white/30 uppercase font-mono-custom tracking-tighter">{s.desc}</span>
                    {step === s.id && (
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="h-0.5 bg-blue-500 mt-2 origin-left w-20"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-4 flex-1">
            <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4 flex items-center gap-2">
              <Activity className="w-3 h-3" /> Network Vitals
            </h3>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold tracking-widest">
                  <span className="text-white/40">BASE GAS</span>
                  <span className="text-green-400 font-mono-custom italic">1.2 GWEI</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400/80 w-1/4 shadow-glow"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold tracking-widest">
                  <span className="text-white/40">SOLANA TPS</span>
                  <span className="text-purple-400 font-mono-custom italic">2,842</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400/80 w-[85%] shadow-glow"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold tracking-widest">
                  <span className="text-white/40">RELAYER LOAD</span>
                  <span className="text-yellow-400 font-mono-custom italic">OPTIMAL</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400/80 w-[12%] shadow-glow"></div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
              <div className="flex items-start gap-2">
                <Info className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[9px] text-blue-300 leading-normal font-mono-custom italic">
                  ZK-Relayer Proofs are currently at 99.9% availability.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="h-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-between px-6 text-[9px] font-mono-custom text-white/20 shrink-0 uppercase tracking-widest font-bold">
        <div className="flex gap-4">
          <span>RPC: https://mainnet.base.org — <span className="text-green-500/50">CONNECTED</span></span>
          <span className="hidden md:inline text-white/5">|</span>
          <span className="hidden md:inline">SOL-RPC: https://api.mainnet-beta.solana.com</span>
        </div>
        <div className="flex gap-4">
          <span>LATENCY: 12ms</span>
          <span className="hidden md:inline text-white/5">|</span>
          <span className="hidden md:inline">NODE_ID: BC-ALPHA-01</span>
        </div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 99px;
        }
        .shadow-glow {
          box-shadow: 0 0 8px currentColor;
        }
      `}</style>
    </div>
  );
}
