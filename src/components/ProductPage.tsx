import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { ProductPhotoLogo } from './ProductPhotoLogo';
import { ProductPreviewGallery } from './ProductPreviewGallery';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShoppingCart,
  ShieldCheck,
  Zap,
  Clock,
  Share2,
  HelpCircle,
  LayoutGrid,
  History,
  LineChart,
  Radio,
  ChevronDown,
} from 'lucide-react';
import { triggerHaptic, triggerNotificationHaptic } from '../services/telegram';
import { formatETB } from '../services/wallet';
import { toast } from '../services/toast';
import { PinButton } from './PinButton';
import { getPlanStockInfo, canAddToCartPlan, subscribeToStock } from '../services/stock';

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
  const isDeepCharts = product.id === 'deepcharts';
  const isEssentialFX = product.id === 'fxreplay-pro';
  const isPremiumFX = product.id === 'fxreplay-premium';
  const isFXReplay = product.brand === 'FXReplay' || product.brand === 'FX Replay' || isEssentialFX || isPremiumFX;

  // State for optional bundle with Backtesting Lab on Essential Plan
  const [bundleJournal, setBundleJournal] = useState<boolean>(false);

  // Live Available Stock State subscription
  const [, setStockVersion] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = subscribeToStock(() => {
      setStockVersion((v) => v + 1);
    });
    return unsubscribe;
  }, []);

  // FAQs state: open item index and collapse/compact toggle (collapsed by default on first visit)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isFaqsCollapsed, setIsFaqsCollapsed] = useState<boolean>(true);

  const productFaqs = isDeepCharts
    ? [
        {
          q: 'How do I receive my DeepCharts license?',
          a: 'Your license key and official DeepCharts installer package are generated and delivered directly to your Telegram bot within 5 minutes of verification.',
        },
        {
          q: 'What data feeds are supported?',
          a: 'DeepCharts natively ingests Market-By-Order (MBO) feeds from Optimus Futures, Rithmic, CQG, dxFeed, and supported prop firm connections.',
        },
        {
          q: 'What is Deep Prints® footprint charting?',
          a: 'Deep Prints® renders tick-by-tick bid/ask volume clusters directly on each bar, exposing aggressive buyer/seller delta, imbalances, and Value Areas in real time.',
        },
        {
          q: 'Does it include Deep Replay tick backtesting?',
          a: 'Yes, full tick-by-tick market replay with order book depth and DOM ladder simulation is fully unlocked in all DeepCharts licenses.',
        },
        {
          q: 'Can I use DeepCharts on multiple screens?',
          a: 'Yes, multi-monitor workspace layouts with fully decoupled footprint charts, DOM ladders, and volume profiles are completely supported.',
        },
        {
          q: 'What warranty is included?',
          a: 'Every license comes with a 100% full-duration validity warranty, replacement guarantee, and dedicated priority Telegram support.',
        },
      ]
    : isFXReplay
    ? [
        {
          q: 'How do I receive my license?',
          a: 'Your license key and login credentials are automatically generated and sent directly to your Telegram bot within 5 minutes of payment verification.',
        },
        {
          q: 'What markets are supported?',
          a: 'FX Replay supports all major and minor Forex pairs, Crypto, global Indices (US30, NAS100, SPX500), and Commodities with deep historical tick data.',
        },
        {
          q: 'How long does access last?',
          a: 'Access remains fully unlocked for the entire length of your chosen pass (7 days, 2 weeks, 1 month, or 3 months) backed by our full duration warranty.',
        },
        {
          q: 'Can I add Backtesting Lab later?',
          a: 'Yes, you can easily add or bundle the Backtesting Lab add-on at any time from your orders dashboard or by contacting ATH support.',
        },
        {
          q: 'Do I need a trading account?',
          a: 'No broker or funded trading account is needed. FX Replay is a self-contained web simulator with built-in TradingView charting and execution.',
        },
        {
          q: 'Can I get a refund?',
          a: 'We provide an instant free replacement or store credit guarantee if you experience any technical activation issue that our team cannot resolve.',
        },
      ]
    : [
        {
          q: 'How do I receive my license?',
          a: 'Your official credentials or access links are automatically dispatched directly to your Telegram account within 5 minutes of order completion.',
        },
        {
          q: 'Is this an official subscription?',
          a: 'Yes, all accounts and software licenses provided through ATH Store are genuine and backed by our full validity guarantee.',
        },
        {
          q: 'What devices are supported?',
          a: 'Access works seamlessly across desktop, browser, tablet, and mobile applications with cloud synchronization.',
        },
        {
          q: 'How does activation support work?',
          a: 'Our dedicated Telegram assistance team is available 7 days a week to ensure smooth setup and answer any technical questions.',
        },
      ];

  // Generate pricing plans based on product (converted to USDT at 198.5 birr)
  let plans: PlanOption[] = [];
  if (isDeepCharts) {
    plans = [
      {
        id: '1m',
        name: '1 Month',
        durationLabel: 'Monthly Pro MBO Pass',
        priceETB: 1850,
        priceUSD: 9.32,
        isPopular: true,
        billingText: 'Billed once • 30 days full MBO & Deep Prints access',
      },
      {
        id: '3m',
        name: '3 Months',
        durationLabel: 'Quarterly Pro Pass',
        priceETB: 4995,
        priceUSD: 25.16,
        savingsBadge: 'Save 10%',
        billingText: 'Billed once • 90 days full MBO & Deep Prints access',
      },
      {
        id: 'annual',
        name: 'Annual',
        durationLabel: '12 Months Institutional Pass',
        priceETB: 16650,
        priceUSD: 83.88,
        savingsBadge: 'Save 25% · Best Value',
        billingText: 'Billed once • 365 days full MBO & Deep Prints access',
      },
    ];
  } else if (isEssentialFX) {
    plans = [
      {
        id: '3m',
        name: '3 Months',
        durationLabel: '3 Months to Prove & Refine Your System',
        priceETB: 2100,
        priceUSD: 10.58,
        savingsBadge: 'Build Your Edge',
        billingText: '90 days full access to prove & refine your system',
      },
      {
        id: '1m',
        name: '1 Month',
        durationLabel: '30 + 7 Days Complete Pass',
        priceETB: 800,
        priceUSD: 4.03,
        savingsBadge: 'Popular Choice',
        isPopular: true,
        billingText: '37 days full backtesting access',
      },
      {
        id: '2w',
        name: '2 Weeks',
        durationLabel: '14-Day Strategy Pass',
        priceETB: 500,
        priceUSD: 2.52,
        savingsBadge: 'Best Value',
        billingText: '14 days full backtesting access',
      },
      {
        id: '6d',
        name: '7 Days',
        durationLabel: 'Sprint Replay Pass',
        priceETB: 250,
        priceUSD: 1.26,
        savingsBadge: 'Strategy Sprint',
        billingText: '7 days full backtesting access',
      },
    ];
  } else if (isPremiumFX) {
    plans = [
      {
        id: '1m',
        name: '1 Month',
        durationLabel: 'Monthly Access',
        priceETB: 2100,
        priceUSD: 10.58,
        savingsBadge: 'Know Your Edge',
        isPopular: true,
        billingText: '30+7 Days dedicated access',
      },
      {
        id: 'annual',
        name: 'Annual',
        durationLabel: '12 Months Access',
        priceETB: 18600,
        priceUSD: 93.70,
        savingsBadge: 'Master Forex Trading',
        billingText: '365 days dedicated access',
      },
    ];
  } else {
    const baseETB = product.priceETB || 2500;
    const baseUSD = Math.round((baseETB / 198.5) * 100) / 100;

    const price1mETB = baseETB;
    const price1mUSD = baseUSD;

    const price3mETB = Math.round(baseETB * 3 * 0.9);
    const price3mUSD = Math.round((price3mETB / 198.5) * 100) / 100;

    const priceAnnualETB = Math.round(baseETB * 12 * 0.75);
    const priceAnnualUSD = Math.round((priceAnnualETB / 198.5) * 100) / 100;

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
  const bundleAddonUSD = 1.76;

  const hasBundle = (isEssentialFX || isPremiumFX) && bundleJournal;
  // Free bundle on Flagship / Premium plan (+350 ETB value included for free)
  const bundleCostETB = isPremiumFX ? 0 : bundleAddonETB;
  const bundleCostUSD = isPremiumFX ? 0 : bundleAddonUSD;

  const currentPriceETB =
    selectedPlan.priceETB + (hasBundle ? bundleCostETB : 0);
  const currentPriceUSD =
    selectedPlan.priceUSD + (hasBundle ? bundleCostUSD : 0);

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

  const deepChartsBenefits = [
    {
      title: 'Deep Prints® Footprint',
      description: 'Tick-by-tick bid/ask volume clusters with delta imbalances and absorption markers.',
      icon: LineChart,
    },
    {
      title: 'Market-By-Order (MBO)',
      description: 'Institutional L3 queue tracking with iceberg order execution analytics.',
      icon: LayoutGrid,
    },
    {
      title: 'Multi-Layer Volume Profile',
      description: 'Composite, session, and periodic profiles with automatic POC and Value Area.',
      icon: Radio,
    },
    {
      title: 'Deep Replay Simulator',
      description: 'True historical tick simulation with variable speed order book replay.',
      icon: History,
    },
    {
      title: 'Ultra-Low Latency Feeds',
      description: 'Direct high-speed connection to Rithmic, CQG, dxFeed, and supported prop accounts.',
      icon: Zap,
    },
  ];

  const activeBenefits = isDeepCharts ? deepChartsBenefits : fxReplayBenefits;

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
      name: 'Upto 5 Device',
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

  const handleShareProduct = async () => {
    triggerHaptic('light');
    const shareUrl = window.location.href;
    const shareTitle = `${product.name} | Abyssinia Trading Hub`;
    const shareText = `Check out ${product.name} on Abyssinia Trading Hub (${product.startingPricePlaceholder || formatETB(product.priceETB)})`;

    // 1. Try native Web Share API
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast.success('Shared', `${product.name} link shared.`);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    // 2. Direct Telegram Share Fallback for Telegram contacts
    const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    const tgWebApp = (window as any).Telegram?.WebApp;

    if (tgWebApp?.openTelegramLink) {
      tgWebApp.openTelegramLink(tgShareUrl);
      toast.success('Opening Telegram', 'Select a contact to share with.');
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link Copied', 'Product link copied to clipboard.');
      } catch {
        const a = document.createElement('a');
        a.href = tgShareUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } else {
      const a = document.createElement('a');
      a.href = tgShareUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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

  const selectedPlanStock = getPlanStockInfo(product.id, selectedPlan.id);
  const isCurrentPlanOut = selectedPlanStock.isOut;

  const handleAddToCartClick = () => {
    if (isCurrentPlanOut) {
      triggerNotificationHaptic('error');
      toast.error('Out of Stock', `${selectedPlan.name} is currently out of stock. Please select another duration.`);
      return;
    }
    const check = canAddToCartPlan(product.id, selectedPlan.id, 0, 1);
    if (!check.allowed) {
      triggerNotificationHaptic('error');
      toast.error('Insufficient Stock', check.message || 'Cannot add to cart.');
      return;
    }
    triggerNotificationHaptic('success');
    const bundleSuffix = hasBundle
      ? isPremiumFX
        ? ' + Backtesting Lab (Free)'
        : ' + Backtesting Lab'
      : '';
    const itemTitle = `${product.name} — ${product.tier || selectedPlan.name} (${selectedPlan.name})${bundleSuffix}`;

    const configuredProduct: Product = {
      ...product,
      id: `${product.id}-${selectedPlan.id}${hasBundle ? '-bundle' : ''}`,
      name: itemTitle,
      priceETB: currentPriceETB,
      parentProductId: product.id,
      selectedPlanId: selectedPlan.id,
      stock: selectedPlanStock.stock,
      maxStock: selectedPlanStock.stock,
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

          {/* Share Button (Web Share API with Telegram contacts fallback) */}
          <button
            type="button"
            onClick={handleShareProduct}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-2xs border bg-white border-stone-200 text-stone-600 hover:text-stone-950 hover:bg-stone-50 cursor-pointer active:scale-90"
            aria-label="Share product"
            title="Share with Telegram contacts"
          >
            <Share2 className="w-4 h-4 stroke-[1.8]" />
          </button>

          {/* Clean Pin Button */}
          <PinButton productId={product.id} size="default" variant="header" />
        </div>
      </div>

      {/* 2. Unified Hero Card & Product Preview Gallery for ALL Products */}
      <div className="space-y-3">
        {/* Clean White Product Identity Card (Matching Photo 2 with Burgundy Action) */}
        <div className="bg-white rounded-2xl border border-stone-200/90 hover:border-[#721428]/30 shadow-2xs p-3.5 sm:p-4 select-none transition-colors">
          <div className="flex items-center justify-between gap-3">
            {/* Left & Middle: Product Logo + Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Product Logo / Visual (Left) */}
              <div className={`shrink-0 w-12 h-12 sm:w-13 sm:h-13 rounded-xl p-1 flex items-center justify-center overflow-hidden shadow-2xs ${
                isDeepCharts || product.id === 'abyssinia-journal' || product.id === 'notion-template-journal' || product.id === 'google-ai'
                  ? 'bg-white border border-stone-200 ring-1 ring-stone-200/80'
                  : 'bg-black border border-stone-800 ring-1 ring-[#721428]/25'
              }`}>
                <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center">
                  <ProductPhotoLogo
                    productId={product.id}
                    size="banner"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Product Info (Middle) */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5 leading-none flex-wrap">
                  {product.badge && (
                    <span className="inline-flex items-center px-1.5 py-[2px] rounded text-[9.5px] font-bold tracking-tight bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA]">
                      {product.badge}
                    </span>
                  )}
                </div>
                <h1 className="text-base sm:text-lg font-black text-stone-950 tracking-tight leading-snug truncate uppercase">
                  {product.name}
                </h1>
                <div className="text-[11.5px] font-semibold text-stone-600 truncate mt-0.5">
                  Starting at{' '}
                  <span className="text-[#721428] font-bold">
                    {formatETB(product.priceETB)}
                  </span>
                  {product.priceETB > 0 && (
                    <span className="text-stone-400 font-normal ml-1">
                      (~{(product.priceETB / 198.5).toFixed(2)} USDT)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Bold Burgundy Action Button */}
            <div className="shrink-0 pl-1">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  const el = document.getElementById('choose-plan-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#721428] hover:bg-[#5A0E1E] active:scale-95 text-white text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer select-none"
                aria-label="Choose plan options"
              >
                <span>Choose Plan</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Preview Gallery — Horizontal Swipeable Google Play Style Carousel for ALL Products */}
        <ProductPreviewGallery product={product} />
      </div>

      {/* 5. Why FX Replay Pro? / Why DeepCharts? (Horizontal Minimal & Compact Benefit Cards) */}
      {(isEssentialFX || isDeepCharts) && (
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 tracking-tight">
              {isDeepCharts ? 'Why DeepCharts?' : 'Why FX Replay Pro?'}
            </h3>

            {/* Dots indicator for swipe awareness */}
            <div className="flex items-center gap-1.5" title="Swipe to view all highlights">
              {activeBenefits.map((_, i) => (
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
              {activeBenefits.map((benefit, idx) => {
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
            {activeHighlightIndex < activeBenefits.length - 1 && (
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
              {isEssentialFX ? 'Tap any column to select that pass' : 'Everything included with your license'}
            </p>
          </div>
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
                    { id: '6d', labelShort: '7D', labelLong: '7 Days' },
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
                          toast.info('Plan Selected', 'Switched to 7 Days');
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
              Your Own Email and Password
            </div>
            <div className="text-amber-800 text-[11px] leading-snug">
              Dedicated credentials registered to your personal email and password. Upto 5 devices supported with shareable access.
            </div>
          </div>
        </div>
      )}

      {/* 7. Choose Your Plan Section */}
      <div id="choose-plan-section" className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs space-y-3 scroll-mt-4">
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
            const planStock = getPlanStockInfo(product.id, plan.id);

            return (
              <div
                key={plan.id}
                onClick={() => handleSelectPlan(plan.id)}
                className={`relative rounded-xl p-3.5 border transition-all cursor-pointer flex items-center justify-between select-none ${
                  isSelected
                    ? planStock.isOut
                      ? 'border-stone-400 bg-stone-100/70 shadow-xs'
                      : 'border-[#721428] bg-[#FAF0F2]/50 shadow-xs'
                    : planStock.isOut
                    ? 'border-stone-200 bg-stone-50/60 hover:bg-stone-100/50 opacity-85'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                }`}
              >
                {/* Plan Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Radio Check Circle */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? planStock.isOut
                          ? 'bg-stone-500 text-white'
                          : 'bg-[#721428] text-white'
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

                      {/* Real current availability indicator for each purchasable plan */}
                      {planStock.isOut ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-stone-200 text-stone-700 border border-stone-300">
                          Out of Stock
                        </span>
                      ) : planStock.isLow ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/90 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>{planStock.stock} available</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200/80">
                          {planStock.stock} available
                        </span>
                      )}

                      {plan.savingsBadge && (
                        <span
                          className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full ${
                            plan.savingsBadge === 'Know Your Edge' ||
                            plan.savingsBadge === 'Master Forex Trading' ||
                            plan.savingsBadge.includes('Flagship')
                              ? 'bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA]'
                              : plan.isPopular
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
                    ~${plan.priceUSD.toFixed(2)} USDT
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Bundle with Backtesting Lab for Essential & Flagship Plans */}
        {(isEssentialFX || isPremiumFX) && (
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
                    {isPremiumFX ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Free
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA]">
                        +{formatETB(bundleAddonETB)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1 leading-snug">
                    Includes official Backtesting Lab with historical trade analytics and metrics tracking alongside your FX Replay sessions.
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
              {hasBundle ? (isPremiumFX ? ' + Backtesting Lab (Free)' : ' + Backtesting Lab') : ''}
            </span>
            <span className="text-[10px] text-stone-500 block mt-0.5">
              {selectedPlan.billingText.replace(/Every Week\s*•?\s*/gi, '').replace(/Billed once\s*•?\s*/gi, '')}
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm font-extrabold text-[#721428] tabular-nums">
              {formatETB(currentPriceETB)}
            </div>
            <div className="text-[10.5px] font-medium text-stone-500">
              ~${currentPriceUSD.toFixed(2)} USDT
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

      {/* 9. FAQs (Premium Minimalist Card Accordion) */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.025)] overflow-hidden select-none">
        {/* Header: Clean & Minimal with Icon & Compact/Expand Control */}
        <div
          onClick={() => {
            triggerHaptic('light');
            setIsFaqsCollapsed(!isFaqsCollapsed);
          }}
          className={`px-4 py-3 sm:px-4.5 sm:py-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer bg-stone-50/40 hover:bg-stone-50/70 select-none ${
            !isFaqsCollapsed ? 'border-b border-stone-100' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-5.5 h-5.5 rounded-lg bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA]/80 flex items-center justify-center shrink-0 shadow-2xs">
              <HelpCircle className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <h4 className="text-xs sm:text-[13px] font-bold text-stone-900 tracking-tight">
              FAQs
            </h4>
          </div>

          {/* Minimal Ghost Toggle Control */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic('light');
              setIsFaqsCollapsed(!isFaqsCollapsed);
            }}
            className="group/toggle inline-flex items-center gap-1.5 text-[11px] font-medium text-stone-500 hover:text-stone-900 active:text-stone-950 transition-colors cursor-pointer select-none"
            aria-label={isFaqsCollapsed ? 'Expand FAQs' : 'Collapse FAQs'}
          >
            <span>{isFaqsCollapsed ? 'Expand' : 'Collapse'}</span>
            <motion.div
              animate={{ rotate: isFaqsCollapsed ? 0 : 180 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-3 h-3 text-stone-400 group-hover/toggle:text-stone-700 transition-colors" />
            </motion.div>
          </button>
        </div>

        {/* Collapsible Card Body */}
        <AnimatePresence initial={false}>
          {!isFaqsCollapsed && (
            <motion.div
              key="faq-card-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden divide-y divide-stone-100"
            >
              {productFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="group px-4 sm:px-4.5 py-3 hover:bg-stone-50/50 transition-colors">
                    {/* Question Row */}
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setOpenFaqIndex(isOpen ? null : idx);
                      }}
                      className="w-full flex items-center justify-between text-left gap-3.5 cursor-pointer group/q"
                    >
                      <span
                        className={`text-[12.5px] sm:text-[13px] font-semibold leading-snug tracking-tight transition-colors ${
                          isOpen ? 'text-stone-950' : 'text-stone-800 group-hover/q:text-stone-950'
                        }`}
                      >
                        {faq.q}
                      </span>
                      {/* Subtle, Thin Animated Chevron Icon */}
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className={`shrink-0 flex items-center justify-center transition-colors ${
                          isOpen ? 'text-stone-800' : 'text-stone-400 group-hover/q:text-stone-600'
                        }`}
                        aria-hidden="true"
                      >
                        <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.25]" />
                      </motion.div>
                    </button>

                    {/* Answer Row */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pt-2 text-[11.5px] sm:text-xs text-stone-600 leading-relaxed font-normal pr-3 sm:pr-4">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 7. Floating Burgundy Add to Cart Button */}
      <div className="fixed bottom-3 sm:bottom-4 inset-x-0 z-40 px-3.5 sm:px-4 pointer-events-none pb-safe">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button
            type="button"
            onClick={isCurrentPlanOut ? undefined : handleAddToCartClick}
            disabled={isCurrentPlanOut}
            className={`w-full h-12 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-between px-4 transition-all select-none ${
              isCurrentPlanOut
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                : 'bg-[#721428] hover:bg-[#5A0E1E] active:bg-[#470A17] text-white shadow-[0_8px_24px_rgba(114,20,40,0.35)] cursor-pointer active:scale-[0.98]'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4.5 h-4.5" strokeWidth={2} />
              <span>
                {isCurrentPlanOut ? (
                  `Out of Stock • ${selectedPlan.name}`
                ) : (
                  <>
                    Add to Cart • {selectedPlan.name}
                    {hasBundle ? ' + Bundle' : ''}
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-extrabold tabular-nums">
              <span>{formatETB(currentPriceETB)}</span>
              <span className={isCurrentPlanOut ? 'text-stone-400 text-[11px] font-normal' : 'text-white/70 text-[11px] font-normal'}>
                (~${currentPriceUSD.toFixed(2)} USDT)
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
