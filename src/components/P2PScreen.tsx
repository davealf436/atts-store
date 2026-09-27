import React from 'react';
import { ArrowLeftRight, ShieldCheck, Smartphone, Building2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { triggerHaptic } from '../services/telegram';

export const P2PScreen: React.FC = () => {
  return (
    <div className="space-y-4 pb-6">
      {/* Platform Header */}
      <section className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center font-bold text-xs shrink-0">
            P2P
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight leading-none">
              Abyssinia P2P Platform
            </h2>
            <span className="text-[11px] text-gray-500 font-medium">
              Direct Peer-to-Peer Escrow Desk
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed mb-4">
          Safe peer-to-peer exchange between USDT and Ethiopian Birr (ETB). Locked in smart escrow until payment verification via Telebirr or CBE.
        </p>

        {/* Indicative Rate Reference */}
        <div className="grid grid-cols-2 gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-200/80">
          <div>
            <span className="text-[10px] font-semibold uppercase text-gray-500 block">
              Indicative Buy USDT
            </span>
            <span className="text-sm font-bold text-gray-900 font-mono">
              ~141.50 ETB
            </span>
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase text-gray-500 block">
              Indicative Sell USDT
            </span>
            <span className="text-sm font-bold text-gray-900 font-mono">
              ~140.20 ETB
            </span>
          </div>
        </div>
      </section>

      {/* Trade Options Preview */}
      <section className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5 border border-emerald-100">
              <span className="font-bold text-xs">₮</span>
            </div>
            <h3 className="text-xs font-bold text-gray-900 mb-1">Buy USDT</h3>
            <p className="text-[11px] text-gray-500 leading-snug">
              Deposit ETB via Telebirr or CBE and receive USDT to your wallet.
            </p>
          </div>
          <button
            onClick={() => triggerHaptic('light')}
            className="mt-3 w-full py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg text-center transition-colors"
          >
            Buy Desk (Preview)
          </button>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5 border border-blue-100">
              <span className="font-bold text-xs">ETB</span>
            </div>
            <h3 className="text-xs font-bold text-gray-900 mb-1">Sell USDT</h3>
            <p className="text-[11px] text-gray-500 leading-snug">
              Transfer USDT to escrow and receive ETB directly to your local bank.
            </p>
          </div>
          <button
            onClick={() => triggerHaptic('light')}
            className="mt-3 w-full py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg text-center transition-colors"
          >
            Sell Desk (Preview)
          </button>
        </div>
      </section>

      {/* Escrow Workflow & Safeguards */}
      <section className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-gray-700" />
          <span>How Escrow Protection Works</span>
        </h3>

        <div className="space-y-2.5 text-xs text-gray-600">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              1
            </div>
            <div>
              <strong className="text-gray-900">USDT Lock:</strong> The seller's crypto is frozen in ATTS escrow before the trade begins.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              2
            </div>
            <div>
              <strong className="text-gray-900">Direct ETB Transfer:</strong> Buyer sends local currency via Telebirr or CBE Birr.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              3
            </div>
            <div>
              <strong className="text-gray-900">Release:</strong> Once payment is confirmed, escrow releases USDT to the buyer's destination wallet.
            </div>
          </div>
        </div>

        {/* Phase notice */}
        <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2 pt-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Initial UI Foundation:</strong> Interactive order matching, live merchant ads, and wallet connections will be enabled in the next stage.
          </p>
        </div>
      </section>
    </div>
  );
};
