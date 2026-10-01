import React, { useState } from 'react';
import { Product } from '../types';
import { ProductBrandVisual } from './ProductBrandVisual';
import {
  ArrowLeft,
  Check,
  ShoppingBag,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  Award,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
import { triggerHaptic, triggerNotificationHaptic } from '../services/telegram';
import { formatETB } from '../services/wallet';
import { toast } from '../services/toast';

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onOpenCart?: () => void;
}

interface PlanOption {
  id: '1m' | '3m' | 'annual';
  name: string;
  durationLabel: string;
  priceETB: number;
  priceUSD: number;
  savingsBadge?: string;
  isPopular?: boolean;
  billingText: string;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  onBack,
  onAddToCart,
  onOpenCart,
}) => {
  // Generate pricing plans based on the product base price
  const baseETB = product.priceETB || 2500;
  const baseUSD = Math.round((baseETB / 140) * 100) / 100;

  const price1mETB = baseETB;
  const price1mUSD = baseUSD;

  const price3mETB = Math.round(baseETB * 3 * 0.90);
  const price3mUSD = Math.round((price3mETB / 140) * 100) / 100;

  const priceAnnualETB = Math.round(baseETB * 12 * 0.75);
  const priceAnnualUSD = Math.round((priceAnnualETB / 140) * 100) / 100;

  const plans: PlanOption[] = [
    {
      id: '1m',
      name: '1 Month',
      durationLabel: 'Monthly Access',
      priceETB: price1mETB,
      priceUSD: price1mUSD,
      billingText: 'Billed once • 30 days full validity',
    },
    {
      id: '3m',
      name: '3 Months',
      durationLabel: 'Quarterly Pass',
      priceETB: price3mETB,
      priceUSD: price3mUSD,
      savingsBadge: 'Save 10%',
      billingText: 'Billed once • 90 days full validity',
    },
    {
      id: 'annual',
      name: 'Annual',
      durationLabel: '12 Months Access',
      priceETB: priceAnnualETB,
      priceUSD: priceAnnualUSD,
      savingsBadge: 'Save 25% · Best Value',
      isPopular: true,
      billingText: 'Billed once • 365 days full validity',
    },
  ];

  const [selectedPlanId, setSelectedPlanId] = useState<'1m' | '3m' | 'annual'>('1m');
  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const handleSelectPlan = (planId: '1m' | '3m' | 'annual') => {
    triggerHaptic('light');
    setSelectedPlanId(planId);
  };

  const handleAddToCartClick = () => {
    triggerNotificationHaptic('success');
    const configuredProduct: Product = {
      ...product,
      id: `${product.id}-${selectedPlan.id}`,
      name: `${product.name} (${selectedPlan.name})`,
      priceETB: selectedPlan.priceETB,
    };
    onAddToCart(configuredProduct);
    toast.success(
      'Added to Cart',
      `${product.name} (${selectedPlan.name}) has been added to your cart.`
    );
  };

  return (
    <div className="space-y-4 pb-28 select-none animate-in fade-in duration-200">
      {/* 1. Top Header with Simple Back Button */}
      <div className="flex items-center justify-between pb-1">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onBack();
          }}
          className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition-all cursor-pointer text-xs font-bold shadow-2xs active:scale-[0.98]"
          aria-label="Go back to store"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-[10.5px] font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg uppercase tracking-wider">
            {product.brand}
          </span>
        </div>
      </div>

      {/* 2. Premium Dark Product Hero with Real Brand Logo */}
      <div className="rounded-2xl overflow-hidden border border-stone-200/90 shadow-2xs bg-stone-900">
        <ProductBrandVisual product={product} className="h-44 sm:h-52 w-full" />
      </div>

      {/* 3. Product Title, Tier Badge, and Short Description */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs space-y-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700">
            {product.brand}
          </span>
          {product.badge && (
            <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA]">
              {product.badge}
            </span>
          )}
          {product.tier && product.tier !== product.badge && (
            <span className="text-[10px] font-semibold text-stone-500 bg-stone-50 px-2 py-0.5 rounded border border-stone-200">
              {product.tier} Tier
            </span>
          )}
        </div>

        <h1 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight leading-tight">
          {product.name}
        </h1>

        <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed">
          {product.shortDescription}
        </p>

        {/* Value Highlights */}
        <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px] text-stone-600 font-medium">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Instant Telegram Delivery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>100% Genuine License</span>
          </div>
        </div>
      </div>

      {/* 4. Choose Your Plan Section */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900 tracking-tight flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#721428]" />
            <span>Choose Your Plan</span>
          </h3>
          <span className="text-[11px] font-medium text-stone-500">
            Select billing cycle
          </span>
        </div>

        <div className="space-y-2">
          {plans.map((plan) => {
            const isSelected = plan.id === selectedPlanId;
            return (
              <div
                key={plan.id}
                onClick={() => handleSelectPlan(plan.id)}
                className={`relative rounded-xl p-3.5 border transition-all cursor-pointer flex items-center justify-between select-none ${
                  isSelected
                    ? 'border-[#721428] bg-[#FAF0F2]/50 shadow-xs'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                }`}
              >
                {/* Plan Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Radio Check Circle */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#721428] text-white'
                        : 'border border-stone-300 bg-white text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
                        {plan.name}
                      </span>
                      {plan.savingsBadge && (
                        <span
                          className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full ${
                            plan.isPopular
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {plan.savingsBadge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10.5px] text-stone-500 block mt-0.5">
                      {plan.durationLabel}
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="text-right shrink-0 pl-2">
                  <div className="text-xs sm:text-sm font-extrabold text-[#721428] tabular-nums">
                    {formatETB(plan.priceETB)}
                  </div>
                  <div className="text-[10.5px] font-medium text-stone-500">
                    ~${plan.priceUSD.toFixed(2)} USD
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Plan Summary Banner */}
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block">
              Selected Duration
            </span>
            <span className="font-semibold text-stone-900">
              {selectedPlan.name} ({selectedPlan.durationLabel})
            </span>
            <span className="text-[10px] text-stone-500 block mt-0.5">
              {selectedPlan.billingText}
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm font-extrabold text-[#721428] tabular-nums">
              {formatETB(selectedPlan.priceETB)}
            </div>
            <div className="text-[10.5px] font-medium text-stone-500">
              ~${selectedPlan.priceUSD.toFixed(2)} USD
            </div>
          </div>
        </div>
      </div>

      {/* 5. Overview (Compact and Premium) */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs space-y-2">
        <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider text-stone-500">
          Overview
        </h3>
        <p className="text-xs text-stone-700 leading-relaxed font-normal">
          {product.fullDescription}
        </p>
      </div>

      {/* 6. Included Specifications (Compact and Premium) */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs space-y-2.5">
        <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider text-stone-500">
          Included Specifications
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {product.features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200/60 text-xs text-stone-800"
            >
              <div className="w-4 h-4 rounded-full bg-[#FAF0F2] text-[#721428] flex items-center justify-center shrink-0 mt-0.5 border border-[#F0D5DA]">
                <Check className="w-2.5 h-2.5 stroke-[2.5]" />
              </div>
              <span className="leading-snug text-xs font-medium text-stone-700">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Sticky Burgundy Add to Cart Bar at Bottom */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 p-3 sm:p-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto">
          <button
            type="button"
            onClick={handleAddToCartClick}
            className="w-full h-12 rounded-xl bg-[#721428] hover:bg-[#5A0E1E] active:bg-[#470A17] text-white font-bold text-xs sm:text-sm flex items-center justify-between px-4 transition-all active:scale-[0.98] shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4.5 h-4.5" />
              <span>Add to Cart • {selectedPlan.name}</span>
            </div>
            <div className="flex items-center gap-1.5 font-extrabold tabular-nums">
              <span>{formatETB(selectedPlan.priceETB)}</span>
              <span className="text-white/70 text-[11px] font-normal">
                (~${selectedPlan.priceUSD.toFixed(2)})
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
