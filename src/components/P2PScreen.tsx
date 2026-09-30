import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { triggerHaptic } from '../services/telegram';

export const P2PScreen: React.FC = () => {
  return (
    <div className="space-y-3.5 pb-4">
      {/* Platform Header */}
      <section className="bg-white border border-gray-200/90 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7.5 h-7.5 rounded-lg bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA] flex items-center justify-center font-bold text-xs shrink-0">
            ATH
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 tracking-tight leading-none">
              ATH P2P Platform
            </h2>
            <span className="text-[10px] text-gray-500 font-medium">
              Direct Peer-to-Peer Desk
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed mb-3.5">
          Safe peer-to-peer exchange between USDT and Ethiopian Birr (ETB). Verified transfers with Telebirr and CBE verification.
        </p>

        {/* Indicative Rate Reference */}
        <div className="grid grid-cols-2 gap-2.5 p-3 bg-gray-50 rounded-lg border border-gray-200/80">
          <div>
            <span className="text-[10.5px] font-semibold text-gray-500 block">
              Indicative Buy USDT
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 block">
              ~141.50 ETB
            </span>
          </div>
          <div>
            <span className="text-[10.5px] font-semibold text-gray-500 block">
              Indicative Sell USDT
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 block">
              ~140.20 ETB
            </span>
          </div>
        </div>
      </section>

      {/* Trade Options Preview */}
      <section className="grid grid-cols-2 gap-2.5">
        <div className="bg-white border border-gray-200/90 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="w-6.5 h-6.5 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 border border-emerald-100">
              <span className="font-bold text-xs">₮</span>
            </div>
            <h3 className="text-xs font-bold text-gray-900 mb-0.5">Buy USDT</h3>
            <p className="text-[10.5px] text-gray-500 leading-snug">
              Deposit ETB via Telebirr or CBE and receive USDT to your wallet.
            </p>
          </div>
          <button
            onClick={() => triggerHaptic('light')}
            className="mt-3 w-full py-1.5 px-2 bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA] hover:bg-[#F3E2E6] text-xs font-bold rounded-lg text-center transition-colors"
          >
            Buy Desk (Preview)
          </button>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="w-6.5 h-6.5 rounded-md bg-[#FAF0F2] text-[#721428] flex items-center justify-center mb-2 border border-[#F0D5DA]">
              <span className="font-bold text-xs">ETB</span>
            </div>
            <h3 className="text-xs font-bold text-gray-900 mb-0.5">Sell USDT</h3>
            <p className="text-[10.5px] text-gray-500 leading-snug">
              Transfer USDT and receive ETB directly to your local bank.
            </p>
          </div>
          <button
            onClick={() => triggerHaptic('light')}
            className="mt-3 w-full py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg text-center transition-colors"
          >
            Sell Desk (Preview)
          </button>
        </div>
      </section>

      {/* P2P Workflow & Safeguards */}
      <section className="bg-white border border-gray-200/90 rounded-xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#721428]" />
          <span>How P2P Trading Works</span>
        </h3>

        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-start gap-2.5">
            <div className="w-4.5 h-4.5 rounded-full bg-[#FAF0F2] text-[#721428] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border border-[#F0D5DA]">
              1
            </div>
            <div className="leading-snug">
              <strong className="text-gray-900 font-bold">USDT Order:</strong> The seller's crypto order is placed and verified before the trade begins.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-4.5 h-4.5 rounded-full bg-[#FAF0F2] text-[#721428] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border border-[#F0D5DA]">
              2
            </div>
            <div className="leading-snug">
              <strong className="text-gray-900 font-bold">Direct ETB Transfer:</strong> Buyer sends local currency via Telebirr or CBE Birr.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-4.5 h-4.5 rounded-full bg-[#FAF0F2] text-[#721428] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border border-[#F0D5DA]">
              3
            </div>
            <div className="leading-snug">
              <strong className="text-gray-900 font-bold">Release:</strong> Once payment is confirmed, USDT is released directly to the buyer's destination wallet.
            </div>
          </div>
        </div>

        {/* Phase notice */}
        <div className="p-2.5 bg-[#FAF0F2]/70 border border-[#F0D5DA] rounded-lg text-xs text-[#721428] flex items-start gap-2 pt-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#721428] mt-0.5" />
          <p className="text-[10.5px] leading-relaxed">
            <strong>Initial UI Foundation:</strong> Interactive order matching, live merchant ads, and wallet connections will be enabled in the next stage.
          </p>
        </div>
      </section>
    </div>
  );
};
