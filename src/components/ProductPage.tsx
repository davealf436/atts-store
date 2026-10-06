import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { ProductBrandVisual } from './ProductBrandVisual';
import { ProductPhotoLogo } from './ProductPhotoLogo';
import {
  ArrowLeft,
  Check,
  ShoppingCart,
  ShieldCheck,
  Zap,
  Clock,
  Star,
  LayoutGrid,
  History,
  LineChart,
  Radio,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { triggerHaptic, triggerNotificationHaptic } from '../services/telegram';
import { formatETB } from '../services/wallet';
import { toast } from '../services/toast';
import { isFavorite, toggleFavorite, subscribeToFavorites } from '../services/favorites';

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onOpenCart?: () => void;
}

interface PlanOption {
  id: string;
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
}) => {
  const isEssentialFX = product.id === 'fxreplay-pro';
  const isPremiumFX = product.id === 'fxreplay-premium';
  const isFXReplay = product.brand === 'FXReplay' || isEssentialFX || isPremiumFX;

  // State for optional bundle with Backtesting Lab on Essential Plan
  const [bundleJournal, setBundleJournal] = useState<boolean>(false);

  // FAQs state: open item index and collapse/compact toggle
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isFaqsCollapsed, setIsFaqsCollapsed] = useState<boolean>(false);

  const productFaqs = [
    {
      q: 'How do I receive my license?',
      a: 'Your license key and login credentials are automatically generated and sent directly to your Telegram bot within 5 minutes of payment verification.',
    },
    {
      q: 'What markets are supported?',
      a: 'FXReplay supports all major and minor Forex pairs, Crypto, global Indices (US30, NAS100, SPX500), and Commodities with deep historical tick data.',
    },
    {
      q: 'How long does access last?',
      a: 'Access remains fully unlocked for the entire length of your chosen pass (6 days, 2 weeks, 1 month, or 3 months) backed by our full duration warranty.',
    },
    {
      q: 'Can I add Backtesting Lab later?',
      a: 'Yes, you can easily add or bundle the Backtesting Lab add-on at any time from your orders dashboard or by contacting ATH support.',
    },
    {
      q: 'Do I need a trading account?',
      a: 'No broker or funded trading account is needed. FXReplay is a self-contained web simulator with built-in TradingView charting and execution.',
    },
    {
      q: 'Can I get a refund?',
      a: 'We provide an instant free replacement or store credit guarantee if you experience any technical activation issue that our team cannot resolve.',
    },
  ];

  // Generate pricing plans based on product
  let plans: PlanOption[] = [];
  if (isEssentialFX) {
    plans = [
      {
        id: '3m',
        name: '3 Months',
        durationLabel: '3 Months to Prove & Refine Your System',
        priceETB: 2100,
        priceUSD: 15.0,
        savingsBadge: 'Build Your Edge',
        billingText: 'Every Week • 90 days full access to prove & refine your system',
      },
      {
        id: '1m',
        name: '1 Month',
        durationLabel: '30 + 6 Days Complete Pass',
        priceETB: 800,
        priceUSD: 5.7,
        savingsBadge: 'Popular Choice',
        isPopular: true,
        billingText: 'Every Week • 36 days full backtesting access',
      },
      {
        id: '2w',
        name: '2 Weeks',
        durationLabel: '14-Day Strategy Pass',
        priceETB: 500,
        priceUSD: 3.6,
        savingsBadge: 'Best Value',
        billingText: 'Every Week • 14 days full backtesting access',
      },
      {
        id: '6d',
        name: '6 Days',
        durationLabel: 'Sprint Replay Pass',
        priceETB: 250,
        priceUSD: 1.8,
        savingsBadge: 'Strategy Sprint',
        billingText: 'Every Week • 6 days full backtesting access',
      },
    ];
  } else if (isPremiumFX) {
    plans = [
      {
        id: '1m',
        name: '1 Month',
        durationLabel: 'Private Monthly Access',
        priceETB: 2700,
        priceUSD: 19.3,
        isPopular: true,
        billingText: 'One email, private and non-shareable access',
      },
      {
        id: '3m',
        name: '3 Months',
        durationLabel: 'Private Quarterly Pass',
        priceETB: 7290,
        priceUSD: 52.0,
        savingsBadge: 'Save 10%',
        billingText: 'Billed once • 90 days private dedicated access',
      },
      {
        id: 'annual',
        name: 'Annual',
        durationLabel: 'Private 12 Months Access',
        priceETB: 24300,
        priceUSD: 173.5,
        savingsBadge: 'Save 25% · Best Value',
        billingText: 'Billed once • 365 days private dedicated access',
      },
    ];
  } else {
    const baseETB = product.priceETB || 2500;
    const baseUSD = Math.round((baseETB / 140) * 100) / 100;

    const price1mETB = baseETB;
    const price1mUSD = baseUSD;

    const price3mETB = Math.round(baseETB * 3 * 0.9);
    const price3mUSD = Math.round((price3mETB / 140) * 100) / 100;

    const priceAnnualETB = Math.round(baseETB * 12 * 0.75);
    const priceAnnualUSD = Math.round((priceAnnualETB / 140) * 100) / 100;

    plans = [
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
  }

  const defaultPlanId = isEssentialFX ? '3m' : '1m';
  const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultPlanId);

  useEffect(() => {
    setSelectedPlanId(isEssentialFX ? '3m' : '1m');
    setBundleJournal(false);
  }, [product.id, isEssentialFX]);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const bundleAddonETB = 350;
  const bundleAddonUSD = 2.5;

  const currentPriceETB =
    selectedPlan.priceETB + (isEssentialFX && bundleJournal ? bundleAddonETB : 0);
  const currentPriceUSD =
    selectedPlan.priceUSD + (isEssentialFX && bundleJournal ? bundleAddonUSD : 0);

  const fxReplayBenefits = [
    {
      title: 'Flexible Chart Layouts',
      description: 'Customize your chart layout for your backtesting workflow.',
      icon: LayoutGrid,
    },
    {
      title: 'Historical Data Since 2003',
      description: 'Backtest historical market data from 2003 to the latest available date.',
      icon: History,
    },
    {
      title: '1-Minute & Second Timeframes',
      description: 'Analyze price movements with fine-grained timeframes.',
      icon: Clock,
    },
    {
      title: 'TradingView Premium Charting',
      description: 'Enjoy a familiar, powerful TradingView charting experience.',
      icon: LineChart,
    },
    {
      title: 'Real-Time CME Data',
      description: 'Access real-time CME market data for supported instruments.',
      icon: Radio,
    },
  ];

  const fxComparisonFeatures = [
    {
      name: 'Tick-by-tick replay',
      d6: true,
      w2: true,
      m1: true,
      m3: true,
    },
    {
      name: 'Multi-timeframe charts',
      d6: true,
      w2: true,
      m1: true,
      m3: true,
    },
    {
      name: 'Spread simulation',
      d6: true,
      w2: true,
      m1: true,
      m3: true,
    },
    {
      name: 'Slippage simulation',
      d6: false,
      w2: true,
      m1: true,
      m3: true,
    },
    {
      name: 'Automated journaling',
      d6: false,
      w2: false,
      m1: true,
      m3: true,
    },
    {
      name: 'Backtesting Lab',
      d6: false,
      w2: false,
      m1: 'Add-on',
      m3: true,
    },
    {
      name: 'Priority support',
      d6: false,
      w2: false,
      m1: true,
      m3: true,
    },
  ];

  const [isLiked, setIsLiked] = useState<boolean>(() => isFavorite(product.id));

  useEffect(() => {
    const unsubscribe = subscribeToFavorites((favIds) => {
      setIsLiked(favIds.includes(product.id));
    });
    return unsubscribe;
  }, [product.id]);

  const handleToggleFavorite = () => {
    triggerHaptic('medium');
    const nowSaved = toggleFavorite(product.id);
    if (nowSaved) {
      toast.success('Added to Saved', `${product.name} added to your saved list.`);
    } else {
      toast.info('Removed from Saved', `${product.name} removed from your saved list.`);
    }
  };

  const [activeHighlightIndex, setActiveHighlightIndex] = useState(0);
  const highlightsRef = useRef<HTMLDivElement>(null);

  const handleHighlightsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const scrollPos = el.scrollLeft;
    const cardWidth = 230;
    const index = Math.round(scrollPos / cardWidth);
    setActiveHighlightIndex(Math.min(Math.max(index, 0), fxReplayBenefits.length - 1));
  };

  const scrollToHighlight = (idx: number) => {
    triggerHaptic('light');
    if (highlightsRef.current) {
      highlightsRef.current.scrollTo({
        left: idx * 230,
        behavior: 'smooth',
      });
      setActiveHighlightIndex(idx);
    }
  };

  const handleSelectPlan = (planId: string) => {
    triggerHaptic('light');
    setSelectedPlanId(planId);
  };

  const handleAddToCartClick = () => {
    triggerNotificationHaptic('success');
    const bundleSuffix = isEssentialFX && bundleJournal ? ' + Backtesting Lab' : '';
    const itemTitle = `${product.name} — ${product.tier || selectedPlan.name} (${selectedPlan.name})${bundleSuffix}`;

    const configuredProduct: Product = {
      ...product,
      id: `${product.id}-${selectedPlan.id}${isEssentialFX && bundleJournal ? '-bundle' : ''}`,
      name: itemTitle,
      priceETB: currentPriceETB,
    };
    onAddToCart(configuredProduct);
    toast.success('Added to Cart', `${itemTitle} has been added to your cart.`);
  };

  return (
    <div className="space-y-4 pb-1 select-none animate-in fade-in duration-200">
      {/* 1. Top Header with Simple Back Button and Favorite action */}
      <div className="flex items-center justify-between pb-1">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onBack();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-950 py-1.5 px-2.5 -ml-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Badge indicator (for non-hero products) */}
          {!isFXReplay && product.badge && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA]"
            >
              {product.badge}
            </span>
          )}

          {/* Star Bookmark Button */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-2xs border cursor-pointer active:scale-90 ${
              isLiked
                ? 'bg-amber-50 border-amber-200 text-amber-500'
                : 'bg-white border-stone-200 text-stone-400 hover:text-amber-500'
            }`}
            aria-label={isLiked ? 'Remove from Saved' : 'Save to Favorites'}
            title={isLiked ? 'Remove from Saved' : 'Save to Favorites'}
          >
            <Star
              className={`w-4 h-4 transition-transform ${
                isLiked ? 'fill-amber-400 text-amber-500 scale-110' : 'stroke-[2]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Hero Card & Spec Strip — Clean, Premium, White Aesthetic (Matching Photo 2) */}
      {isFXReplay ? (
        <div className="space-y-3">
          {/* Clean White Product Identity Card (Matching Photo 2) */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-3.5 sm:p-4 select-none">
            <div className="flex items-center gap-3">
              {/* Product Logo / Visual (Left) */}
              <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-black border border-stone-800 p-1 flex items-center justify-center overflow-hidden shadow-2xs">
                <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center">
                  <ProductPhotoLogo
                    productId={product.id}
                    size="banner"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Product Info (Middle) */}
              <div className="flex-1 min-w-0">
                {product.badge && (
                  <div className="mb-0.5 leading-none">
                    <span className="inline-flex items-center px-1.5 py-[2px] rounded text-[9.5px] font-bold tracking-tight bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA]/80">
                      {product.badge}
                    </span>
                  </div>
                )}
                <h1 className="text-[15px] sm:text-[17px] font-bold text-gray-900 leading-snug truncate">
                  {product.name}
                </h1>
                <div className="text-[11.5px] font-semibold text-stone-500 truncate mt-0.5">
                  Starting at {formatETB(product.priceETB)}
                  <span className="text-stone-400 font-normal ml-1">
                    (~${(product.priceETB / 140).toFixed(1)} USD)
                  </span>
                </div>
              </div>

              {/* Starting Price Pill (Right) */}
              <div className="shrink-0 text-right pl-1">
                <span className="text-[9.5px] uppercase font-bold tracking-wider text-stone-400 block leading-tight">
                  From
                </span>
                <span className="text-sm sm:text-base font-extrabold text-[#721428] tabular-nums leading-tight">
                  {formatETB(product.priceETB)}
                </span>
              </div>
            </div>

            {/* Subtitle / Description */}
            <div className="pt-2.5 mt-2.5 border-t border-stone-100 flex items-center justify-between gap-2 text-xs text-stone-600">
              <span className="font-medium text-stone-700">
                {product.subtitle || 'Professional Market Replay for Serious Traders'}
              </span>
              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Official Simulator
              </span>
            </div>

            {/* Delivery & Warranty Trust Strip */}
            <div className="flex items-center gap-3.5 pt-2 mt-2 text-[11px] text-stone-500 border-t border-stone-100/80 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>5-Min Telegram Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% Genuine License</span>
              </div>
            </div>
          </div>

          {/* Compact "At a Glance" Spec Strip */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-3.5 sm:p-4 select-none">
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2.5 px-0.5 flex items-center justify-between">
              <span>At a Glance Specifications</span>
              <span className="text-[9.5px] font-semibold text-[#721428]">Pro Edition</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-2 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
              {/* Spec 1: Data Depth */}
              <div className="pt-1.5 sm:pt-0 sm:px-2.5 first:pt-0 first:pl-0">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Data Depth
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-stone-900 block mt-0.5">
                  2003 – Present
                </span>
                <span className="text-[10px] text-stone-500 font-medium">Tick-by-tick history</span>
              </div>

              {/* Spec 2: Timeframes */}
              <div className="pt-2 sm:pt-0 sm:px-2.5">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Timeframes
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-stone-900 block mt-0.5">
                  Down to 1-Sec
                </span>
                <span className="text-[10px] text-stone-500 font-medium">Multi-chart sync</span>
              </div>

              {/* Spec 3: Feeds */}
              <div className="pt-2 sm:pt-0 sm:px-2.5">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Feeds
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-stone-900 block mt-0.5 truncate">
                  Forex · Crypto · CME
                </span>
                <span className="text-[10px] text-stone-500 font-medium">Real-time data feeds</span>
              </div>

              {/* Spec 4: Delivery */}
              <div className="pt-2 sm:pt-0 sm:px-2.5">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Delivery
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-600 block mt-0.5">
                  &lt; 5 min Telegram
                </span>
                <span className="text-[10px] text-stone-500 font-medium">Instant credentials</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-stone-200/90 shadow-2xs">
            <ProductBrandVisual product={product} />
          </div>
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  {product.brand}
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight leading-tight mt-0.5">
                  {product.name}
                </h1>
                {product.subtitle && (
                  <p className="text-xs sm:text-sm font-semibold text-[#721428] mt-1">
                    {product.subtitle}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase tracking-wide text-stone-600 block">
                  Starting from
                </span>
                <span className="text-base sm:text-lg font-extrabold text-[#721428] tabular-nums">
                  {formatETB(product.priceETB)}
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-normal pt-1">
              {product.shortDescription}
            </p>
            <div className="flex items-center gap-3 pt-2 text-[11px] text-stone-600 border-t border-stone-100 flex-wrap">
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
        </div>
      )}

      {/* 5. Why FXReplay Pro? (Horizontal Minimal & Compact Benefit Cards with Swipe Hint & Dots) */}
      {isEssentialFX && (
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 tracking-tight">
              Why FXReplay Pro?
            </h3>

            {/* Dots indicator for swipe awareness */}
            <div className="flex items-center gap-1.5" title="Swipe to view all highlights">
              {fxReplayBenefits.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToHighlight(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeHighlightIndex === i
                      ? 'w-4 bg-[#721428]'
                      : 'w-1.5 bg-stone-200 hover:bg-stone-300'
                  }`}
                  aria-label={`Highlight card ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Cards Track with discrete edge fade */}
          <div className="relative">
            <div
              ref={highlightsRef}
              onScroll={handleHighlightsScroll}
              className="flex items-stretch gap-2.5 overflow-x-auto -mx-1 px-1 snap-x snap-mandatory scroll-smooth no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {fxReplayBenefits.map((benefit, idx) => {
                const IconComponent = benefit.icon;
                return (
                  <div
                    key={idx}
                    className="w-[220px] sm:w-[240px] shrink-0 snap-start p-3 rounded-xl bg-stone-50/70 border border-stone-200/80 hover:border-stone-300 transition-colors flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA] flex items-center justify-center shrink-0 mt-0.5">
                        <IconComponent className="w-3.5 h-3.5 stroke-[1.75]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-stone-900 leading-snug">
                          {benefit.title}
                        </h4>
                        <p className="text-[11px] text-stone-600 leading-snug mt-1 font-normal">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtle right gradient fade hint for swipeability on mobile */}
            {activeHighlightIndex < fxReplayBenefits.length - 1 && (
              <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white via-white/70 to-transparent sm:hidden" />
            )}
          </div>
        </div>
      )}

      {/* 6. What's Included (Interactive Comparison Table) */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 tracking-tight">
              What's Included
            </h3>
            <p className="text-[10px] text-stone-500 mt-0.5">
              Tap any column to select that pass
            </p>
          </div>
          <span className="text-[10px] font-semibold text-[#721428] bg-[#FAF0F2] border border-[#F0D5DA] px-2 py-0.5 rounded-full">
            Plan Comparison
          </span>
        </div>

        {isEssentialFX ? (
          <div className="overflow-x-auto -mx-1 px-1">
            <table className="w-full text-left border-collapse min-w-[340px]">
              <thead>
                <tr className="border-b border-stone-200/80">
                  <th className="pb-2.5 text-[11px] font-bold uppercase tracking-wider text-stone-400 w-[36%]">
                    Features
                  </th>
                  {[
                    { id: '6d', labelShort: '6D', labelLong: '6 Days' },
                    { id: '2w', labelShort: '2W', labelLong: '2 Weeks' },
                    { id: '1m', labelShort: '1M', labelLong: '1 Month' },
                    { id: '3m', labelShort: '3M', labelLong: '3 Months' },
                  ].map((col) => {
                    const isColSelected = selectedPlanId === col.id;
                    return (
                      <th
                        key={col.id}
                        onClick={() => {
                          handleSelectPlan(col.id);
                          toast.info('Plan Selected', `Switched to ${col.labelLong}`);
                        }}
                        className={`pb-2.5 text-center text-xs font-bold w-[16%] cursor-pointer transition-all select-none p-1 rounded-t-xl ${
                          isColSelected
                            ? 'text-[#721428] bg-[#FAF0F2] ring-1 ring-[#F0D5DA]'
                            : 'text-stone-700 hover:text-stone-900 hover:bg-stone-50'
                        }`}
                        title={`Select ${col.labelLong}`}
                      >
                        <div className="flex flex-col items-center">
                          <span className="hidden sm:inline">{col.labelLong}</span>
                          <span className="sm:hidden">{col.labelShort}</span>
                          {isColSelected && (
                            <span className="text-[8.5px] uppercase font-bold text-[#721428] mt-0.5 leading-none">
                              Active
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {fxComparisonFeatures.map((row, idx) => {
                  const renderCell = (val: boolean | string) => {
                    if (val === true) {
                      return (
                        <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA]">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                      );
                    }
                    if (typeof val === 'string') {
                      return (
                        <span className="inline-block text-[9.5px] font-bold text-[#721428] bg-[#FAF0F2] border border-[#F0D5DA] px-1.5 py-0.5 rounded leading-none">
                          {val}
                        </span>
                      );
                    }
                    return <span className="text-stone-300 font-bold text-sm select-none">—</span>;
                  };

                  return (
                    <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-2.5 pr-2 text-xs font-medium text-stone-800">
                        {row.name}
                      </td>
                      <td
                        onClick={() => {
                          handleSelectPlan('6d');
                          toast.info('Plan Selected', 'Switched to 6 Days');
                        }}
                        className={`py-2.5 text-center cursor-pointer transition-colors ${
                          selectedPlanId === '6d' ? 'bg-[#FAF0F2]/50' : ''
                        }`}
                      >
                        {renderCell(row.d6)}
                      </td>
                      <td
                        onClick={() => {
                          handleSelectPlan('2w');
                          toast.info('Plan Selected', 'Switched to 2 Weeks');
                        }}
                        className={`py-2.5 text-center cursor-pointer transition-colors ${
                          selectedPlanId === '2w' ? 'bg-[#FAF0F2]/50' : ''
                        }`}
                      >
                        {renderCell(row.w2)}
                      </td>
                      <td
                        onClick={() => {
                          handleSelectPlan('1m');
                          toast.info('Plan Selected', 'Switched to 1 Month');
                        }}
                        className={`py-2.5 text-center cursor-pointer transition-colors ${
                          selectedPlanId === '1m' ? 'bg-[#FAF0F2]/50' : ''
                        }`}
                      >
                        {renderCell(row.m1)}
                      </td>
                      <td
                        onClick={() => {
                          handleSelectPlan('3m');
                          toast.info('Plan Selected', 'Switched to 3 Months');
                        }}
                        className={`py-2.5 text-center cursor-pointer transition-colors ${
                          selectedPlanId === '3m' ? 'bg-[#FAF0F2]/50' : ''
                        }`}
                      >
                        {renderCell(row.m3)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
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
        )}
      </div>

      {/* Special Highlights for Premium Plan */}
      {isPremiumFX && (
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-950 flex items-start gap-2.5 shadow-2xs">
          <ShieldCheck className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <div className="font-extrabold text-amber-900">
              One Email, Private &amp; Non-Shareable Access
            </div>
            <div className="text-amber-800 text-[11px] leading-snug">
              Guaranteed 100% private session. Dedicated account assigned exclusively to your single designated email address.
            </div>
          </div>
        </div>
      )}

      {/* 7. Choose Your Plan Section */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900 tracking-tight flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#721428]" />
            <span>Choose Your Plan</span>
          </h3>
          <span className="text-[11px] font-medium text-stone-500">
            {isEssentialFX ? 'Choose your duration' : 'Select billing cycle'}
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

        {/* Optional Bundle with Backtesting Lab for Essential Plan */}
        {isEssentialFX && (
          <div className="p-3.5 rounded-xl border border-[#721428]/25 bg-[#FCFAF7] transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="journal-bundle"
                  checked={bundleJournal}
                  onChange={(e) => {
                    triggerHaptic('light');
                    setBundleJournal(e.target.checked);
                  }}
                  className="mt-0.5 w-4 h-4 rounded text-[#721428] border-stone-300 focus:ring-[#721428] cursor-pointer"
                />
                <label htmlFor="journal-bundle" className="cursor-pointer">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-stone-900">
                      Bundle with Backtesting Lab
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA]">
                      +{formatETB(bundleAddonETB)}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1 leading-snug">
                    Includes official Backtesting Lab with historical trade analytics and metrics tracking alongside your FXReplay sessions.
                  </p>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Selected Plan Summary Banner */}
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10.5px] font-semibold text-stone-500 block">
              Selected Duration
            </span>
            <span className="font-semibold text-stone-900">
              {selectedPlan.name} ({selectedPlan.durationLabel})
              {isEssentialFX && bundleJournal ? ' + Backtesting Lab' : ''}
            </span>
            <span className="text-[10px] text-stone-500 block mt-0.5">
              {selectedPlan.billingText.replace(/Billed once/gi, 'Every Week')}
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm font-extrabold text-[#721428] tabular-nums">
              {formatETB(currentPriceETB)}
            </div>
            <div className="text-[10.5px] font-medium text-stone-500">
              ~${currentPriceUSD.toFixed(2)} USD
            </div>
          </div>
        </div>
      </div>

      {/* 8. Buyer Protection & Delivery Transparency */}
      <div className="bg-gradient-to-br from-stone-50 to-stone-100/70 rounded-2xl border border-stone-200/90 p-3 sm:p-3.5 shadow-2xs space-y-2 select-none">
        {/* Header: Buyer Protection with authentic and secure subtitle */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900 leading-tight">
              Buyer Protection
            </h4>
            <p className="text-[10px] text-stone-500 leading-none mt-0.5">
              Your order is authentic, secure, and backed by ATH Store
            </p>
          </div>
        </div>

        {/* 3 Vertically Stacked Minimized Cards */}
        <div className="space-y-1.5">
          {/* Card 1: Telegram Delivery */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
            <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-stone-900 block leading-tight">
                Instant Telegram Delivery
              </span>
              <span className="text-[10.5px] text-stone-500 leading-tight block mt-0.5 font-normal">
                Credentials sent to your bot within 5 Minutes.
              </span>
            </div>
          </div>

          {/* Card 2: Full Duration Warranty */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-stone-900 block leading-tight">
                Full Duration Warranty
              </span>
              <span className="text-[10.5px] text-stone-500 leading-tight block mt-0.5 font-normal">
                100% Guaranteed.
              </span>
            </div>
          </div>

          {/* Card 3: Direct Local Support */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
            <Radio className="w-4 h-4 text-[#721428] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-stone-900 block leading-tight">
                Direct Local Support
              </span>
              <span className="text-[10.5px] text-stone-500 leading-tight block mt-0.5 font-normal">
                Dedicated Telegram assistance 7 days/wk
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 9. Frequently Asked Questions (Clean Framer Motion Accordion) */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden select-none">
        {/* FAQ Header with Hide/Compact Toggle (No subtitle) */}
        <div className="p-3 sm:p-3.5 flex items-center justify-between gap-2.5 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA] flex items-center justify-center shrink-0">
              <HelpCircle className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <h4 className="text-xs font-bold text-stone-900 leading-tight">
              Frequently Asked Questions
            </h4>
          </div>

          {/* Hide / Expand Compact Toggle Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setIsFaqsCollapsed(!isFaqsCollapsed);
            }}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-100/90 hover:bg-stone-200/70 active:bg-stone-200 text-stone-700 text-[11px] font-bold transition-colors cursor-pointer"
            aria-label={isFaqsCollapsed ? 'Show FAQs' : 'Hide FAQs'}
          >
            <span>{isFaqsCollapsed ? 'Show FAQs' : 'Hide / Compact'}</span>
            <motion.div
              animate={{ rotate: isFaqsCollapsed ? -90 : 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-3 h-3" />
            </motion.div>
          </button>
        </div>

        {/* Collapsible FAQ Content with Framer Motion */}
        <AnimatePresence initial={false}>
          {!isFaqsCollapsed ? (
            <motion.div
              key="faq-list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden divide-y divide-stone-100 p-1.5 sm:p-2"
            >
              {productFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="rounded-xl transition-colors overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setOpenFaqIndex(isOpen ? null : idx);
                      }}
                      className="w-full py-2 px-2.5 flex items-center justify-between text-left gap-2 hover:bg-stone-50/70 rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-semibold text-stone-900 leading-snug">
                        {faq.q}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="w-4.5 h-4.5 rounded-md bg-stone-100 text-stone-500 flex items-center justify-center shrink-0"
                      >
                        <ChevronDown className={`w-3 h-3 ${isOpen ? 'text-[#721428]' : ''}`} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-2.5 pb-2.5 pt-0.5 text-[11px] text-stone-600 leading-relaxed font-normal">
                            <div className="p-2 rounded-lg bg-[#FAF0F2]/45 border border-[#F0D5DA]/70 text-stone-700">
                              {faq.a}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="faq-collapsed-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => {
                triggerHaptic('light');
                setIsFaqsCollapsed(false);
              }}
              className="p-2.5 text-center text-[11px] text-stone-500 bg-stone-50/60 hover:bg-stone-50 cursor-pointer transition-colors"
            >
              <span>FAQs are compacted. Tap to reveal answers.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 7. Floating Burgundy Add to Cart Button */}
      <div className="fixed bottom-3 sm:bottom-4 inset-x-0 z-40 px-3.5 sm:px-4 pointer-events-none pb-safe">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button
            type="button"
            onClick={handleAddToCartClick}
            className="w-full h-12 rounded-xl bg-[#721428] hover:bg-[#5A0E1E] active:bg-[#470A17] text-white font-bold text-xs sm:text-sm flex items-center justify-between px-4 transition-all active:scale-[0.98] shadow-[0_8px_24px_rgba(114,20,40,0.35)] cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4.5 h-4.5" strokeWidth={2} />
              <span>
                Add to Cart • {selectedPlan.name}
                {isEssentialFX && bundleJournal ? ' + Bundle' : ''}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-extrabold tabular-nums">
              <span>{formatETB(currentPriceETB)}</span>
              <span className="text-white/70 text-[11px] font-normal">
                (~${currentPriceUSD.toFixed(2)})
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
