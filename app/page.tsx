'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown, Check, Info, Shield, Zap, RefreshCw, BarChart3, Activity, Wallet, Fuel, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

// Custom style for Solana wallet adapter
import '@solana/wallet-adapter-react-ui/styles.css';

// Token definitions
interface Token {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  chain: 'base' | 'solana';
}

const BASE_TOKENS: Token[] = [
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', icon: 'BASE', chain: 'base' },
  { id: 'usdc', symbol: 'USDC', name: 'USDC', icon: 'USDC', chain: 'base' },
  { id: 'degen', symbol: 'DEGEN', name: 'Degen', icon: 'DEGN', chain: 'base' },
  { id: 'cbbtc', symbol: 'cbBTC', name: 'Coinbase BTC', icon: 'BTC', chain: 'base' },
];

const SOLANA_TOKENS: Token[] = [
  { id: 'sol', symbol: 'SOL', name: 'Solana', icon: 'SOL', chain: 'solana' },
  { id: 'usdc', symbol: 'USDC', name: 'USDC', icon: 'USDC', chain: 'solana' },
  { id: 'weth', symbol: 'wETH', name: 'Wrapped ETH', icon: 'WETH', chain: 'solana' },
  { id: 'bonk', symbol: 'BONK', name: 'Bonk', icon: 'BONK', chain: 'solana' },
];

export default function BridgePage() {
  const [isReady, setIsReady] = useState(false);
  const [amount, setAmount] = useState('1.25');
  const [isBridging, setIsBridging] = useState(false);
  const [step, setStep] = useState(0);

  const [fromToken, setFromToken] = useState<Token>(BASE_TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(SOLANA_TOKENS[0]);
  const [showTokenModal, setShowTokenModal] = useState<'from' | 'to' | null>(null);

  // EVM Hooks
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { connect: connectEvm, connectors } = useConnect();
  const { disconnect: disconnectEvm } = useDisconnect();

  // Solana Hooks
  const { publicKey, connected: isSolanaConnected, disconnect: disconnectSolana } = useWallet();
  const { setVisible: setSolanaModalVisible } = useWalletModal();

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
    if (!isEvmConnected || !isSolanaConnected) {
      alert("Please connect both wallets to proceed");
      return;
    }
    setIsBridging(true);
    setStep(1);
    setTimeout(() => setStep(2), 3000);
    setTimeout(() => setStep(3), 8000);
    setTimeout(() => setStep(4), 15000);
  };

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (!isReady) return null;

  return (
    <div className="flex flex-col h-screen font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 glass shrink-0 relative z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-base flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-500/20 text-white">
            BC
          </div>
          <span className="font-semibold text-sm tracking-tight text-white">
            BASE CROSSING <span className="text-white/20 ml-1">v1.4.0</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Base Wallet */}
          <div className="flex flex-col items-end">
            {!isEvmConnected ? (
              <button 
                onClick={() => connectEvm({ connector: connectors[0] })}
                className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-white hover:bg-white/10 transition-colors"
              >
                CONNECT BASE
              </button>
            ) : (
              <div className="flex items-center gap-2 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[9px] font-mono-custom text-blue-400 font-bold">{truncateAddress(evmAddress!)}</span>
                <button onClick={() => disconnectEvm()} className="text-white/20 hover:text-white/40 text-[8px] ml-1">×</button>
              </div>
            )}
          </div>

          {/* Solana Wallet */}
          <div className="flex flex-col items-end">
            {!isSolanaConnected ? (
              <button 
                onClick={() => setSolanaModalVisible(true)}
                className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-white hover:bg-white/10 transition-colors"
              >
                CONNECT SOLANA
              </button>
            ) : (
              <div className="flex items-center gap-2 px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                <span className="text-[9px] font-mono-custom text-purple-400 font-bold">{truncateAddress(publicKey!.toBase58())}</span>
                <button onClick={() => disconnectSolana()} className="text-white/20 hover:text-white/40 text-[8px] ml-1">×</button>
              </div>
            )}
          </div>
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
                <p className="text-sm font-mono-custom font-bold text-white">$12.8M</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <p className="text-[10px] text-white/40 mb-1">Active TVL</p>
                <p className="text-sm font-mono-custom font-bold text-white">$42.4M</p>
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
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 group hover:bg-white/5 px-2 rounded-lg transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">{tx.amount}</span>
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/20 blur-[120px] pointer-events-none"></div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg glass rounded-2xl p-6 border-white/10 card-active relative z-10"
          >
            <div className="flex justify-between items-end mb-8">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-[0.2em]">Bridge Engine</span>
                <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
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
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex justify-between text-[10px] font-bold text-white/30 mb-3 uppercase tracking-widest">
                  <span>From</span>
                  <span>{isEvmConnected ? 'Active Connection' : 'Disconnect'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => setShowTokenModal('from')}
                    className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
                  >
                    <div className="w-10 h-10 rounded-full gradient-base p-0.5 shadow-lg shadow-blue-500/20">
                      <div className="w-full h-full rounded-full bg-[#0A0A0C] flex items-center justify-center font-bold text-[9px] text-white">
                        {fromToken.icon}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5 leading-none mb-1">
                        <span className="text-lg font-bold text-white">{fromToken.symbol}</span>
                        <ChevronDown className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <span className="text-[10px] text-white/40 font-mono-custom uppercase tracking-tighter">Base Mainnet</span>
                    </div>
                  </button>
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
                <div className="w-10 h-10 rounded-full bg-[#17171A] border border-white/10 flex items-center justify-center">
                  <ArrowDown className="w-5 h-5 text-blue-400" />
                </div>
              </div>

              {/* TO SECTION */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex justify-between text-[10px] font-bold text-white/30 mb-3 uppercase tracking-widest">
                  <span>To</span>
                  <span>{isSolanaConnected ? 'Active Connection' : 'Wallet Required'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => setShowTokenModal('to')}
                    className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
                  >
                    <div className="w-10 h-10 rounded-full gradient-sol p-0.5 shadow-lg shadow-purple-500/20">
                      <div className="w-full h-full rounded-full bg-[#0A0A0C] flex items-center justify-center font-bold text-[9px] text-white">
                        {toToken.icon}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5 leading-none mb-1">
                        <span className="text-lg font-bold text-white">{toToken.symbol}</span>
                        <ChevronDown className="w-4 h-4 text-white/20 group-hover:text-purple-400 transition-colors" />
                      </div>
                      <span className="text-[10px] text-white/40 font-mono-custom uppercase tracking-tighter">Solana Network</span>
                    </div>
                  </button>
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
              <div className="flex justify-between items-center text-[10px] font-bold tracking-widest">
                <div className="flex items-center gap-2">
                   <Fuel className="w-3 h-3 text-white/30" />
                   <span className="text-white/30 uppercase">Fee Breakdown</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center text-[11px] font-medium p-2 rounded bg-white/5 border border-white/5">
                  <span className="text-white/30 uppercase tracking-widest text-[9px]">Base Gas</span>
                  <span className="font-mono-custom text-green-400 font-bold">$0.12</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-medium p-2 rounded bg-white/5 border border-white/5">
                  <span className="text-white/30 uppercase tracking-widest text-[9px]">Solana Fee</span>
                  <span className="font-mono-custom text-purple-400 font-bold">$0.01</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-[11px] font-medium px-1">
                <span className="text-white/30 uppercase tracking-widest text-[9px]">Platform Fee (0.1%)</span>
                <span className="font-mono-custom text-white/80">$2.14</span>
              </div>
            </div>

            <button 
              disabled={isBridging || !amount || Number(amount) <= 0 || !isEvmConnected || !isSolanaConnected}
              onClick={handleBridge}
              className={cn(
                "w-full mt-8 py-5 rounded-xl text-white font-black uppercase tracking-[0.2em] text-sm shadow-2xl transition-all active:scale-[0.98]",
                (isBridging || !isEvmConnected || !isSolanaConnected) ? "opacity-50 cursor-not-allowed bg-white/10" : "gradient-base hover:shadow-blue-500/40"
              )}
            >
              {!isEvmConnected || !isSolanaConnected ? "Connect Wallets to Bridge" : isBridging ? "Processing..." : "Approve & Bridge Assets"}
            </button>
          </motion.div>
        </section>

        {/* Right Sidebar: Progress & Health */}
        <section className="hidden md:flex col-span-3 flex-col gap-4 overflow-hidden">
          <div className="glass rounded-xl p-4">
            <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-6 flex items-center gap-2">
              <Activity className="w-3 h-3" /> Bridge Status
            </h3>
            <div className="space-y-6 relative">
              <div className="absolute left-2.5 top-0 bottom-0 w-px bg-white/5"></div>
              {[
                { title: 'Initiation', id: 1 },
                { title: 'Finality', id: 2 },
                { title: 'Settlement', id: 3 },
                { title: 'Release', id: 4 },
              ].map((s, i) => (
                <div key={i} className={cn("flex gap-4 items-start relative z-10", step < s.id && "opacity-20")}>
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-mono-custom border",
                    step >= s.id ? "bg-blue-500 border-blue-500 text-white" : "bg-white/5 border-white/10 text-white/40"
                  )}>
                    {step > s.id ? <Check className="w-3 h-3" /> : s.id}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-none mb-1 text-white">{s.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Token Modal */}
      <AnimatePresence>
        {showTokenModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTokenModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm glass rounded-2xl overflow-hidden border-white/10 shadow-2xl relative z-10"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/80">Select Token</h3>
                <button onClick={() => setShowTokenModal(null)} className="text-white/20 hover:text-white/40">×</button>
              </div>
              <div className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="Search by name or address" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {(showTokenModal === 'from' ? BASE_TOKENS : SOLANA_TOKENS).map((token) => (
                    <button
                      key={token.id}
                      onClick={() => {
                        if (showTokenModal === 'from') setFromToken(token);
                        else setToToken(token);
                        setShowTokenModal(null);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full p-0.5",
                          token.chain === 'base' ? "gradient-base" : "gradient-sol"
                        )}>
                          <div className="w-full h-full rounded-full bg-[#0B0B0D] flex items-center justify-center font-bold text-[9px] text-white">
                            {token.icon}
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-white group-hover:text-white/100">{token.symbol}</div>
                          <div className="text-[10px] text-white/30 uppercase font-mono-custom">{token.name}</div>
                        </div>
                      </div>
                      {(showTokenModal === 'from' ? fromToken.id === token.id : toToken.id === token.id) && (
                        <Check className="w-4 h-4 text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 99px; }
        
        /* Provider Overrides */
        .wallet-adapter-button {
          height: auto !important;
          padding: 0 !important;
          background-color: transparent !important;
          font-family: inherit !important;
        }
        .wallet-adapter-modal-wrapper {
          background-color: #0A0A0C !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 16px !important;
        }
      `}</style>
    </div>
  );
}
