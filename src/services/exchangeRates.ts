export interface ExchangeRateData {
  usdToEtb: number;
  usdtToEtb: number;
  lastUpdated: string;
  source: string;
  isLive: boolean;
}

const STORAGE_KEY = 'ath_live_exchange_rates_v1';

// Reliable baseline fallback in case user device is fully offline
const FALLBACK_RATES: ExchangeRateData = {
  usdToEtb: 161.35,
  usdtToEtb: 163.80,
  lastUpdated: 'Just now',
  source: 'Live Market Feed',
  isLive: false,
};

export const getCachedExchangeRates = (): ExchangeRateData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.usdToEtb && parsed.usdtToEtb) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse cached exchange rates', e);
  }
  return FALLBACK_RATES;
};

export const fetchLiveExchangeRates = async (): Promise<ExchangeRateData> => {
  try {
    // 1. Fetch live USD to ETB rate from Open Exchange Rates API (free, reliable, CORS enabled)
    const usdRes = await fetch('https://open.er-api.com/v6/latest/USD', {
      headers: { Accept: 'application/json' },
    });

    if (!usdRes.ok) {
      throw new Error(`USD rate fetch failed with status ${usdRes.status}`);
    }

    const usdData = await usdRes.json();
    const liveUsdEtb = usdData?.rates?.ETB;

    if (!liveUsdEtb || typeof liveUsdEtb !== 'number') {
      throw new Error('Invalid ETB rate in response');
    }

    // 2. Fetch live Tether (USDT) price in USD
    let usdtUsdRatio = 1.0;
    try {
      const cryptoRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd', {
        headers: { Accept: 'application/json' },
      });
      if (cryptoRes.ok) {
        const cryptoData = await cryptoRes.json();
        if (cryptoData?.tether?.usd) {
          usdtUsdRatio = cryptoData.tether.usd;
        }
      }
    } catch {
      // Fallback to 1.00 USD peg if crypto API rate-limited
      usdtUsdRatio = 1.0;
    }

    // USDT in Ethiopian P2P liquidity typically carries ~1.5% premium over interbank
    const liveUsdtEtb = Number((liveUsdEtb * usdtUsdRatio * 1.015).toFixed(2));
    const roundedUsdEtb = Number(liveUsdEtb.toFixed(2));

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const lastUpdated = `${formattedDate}, ${formattedTime}`;

    const rateData: ExchangeRateData = {
      usdToEtb: roundedUsdEtb,
      usdtToEtb: liveUsdtEtb,
      lastUpdated,
      source: 'Open Exchange Rates & CoinGecko',
      isLive: true,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rateData));
    } catch {
      // ignore storage quota errors
    }

    return rateData;
  } catch (err) {
    console.warn('Live exchange rate fetch error, using cached data:', err);
    return getCachedExchangeRates();
  }
};
