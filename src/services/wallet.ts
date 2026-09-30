import { WalletState, WalletTransaction, TelegramUser } from '../types';

export const ETB_TO_USDT_RATE = 140; // 1 USDT = 140 ETB

const WALLET_STORAGE_KEY = 'ath_wallet_storage_v2';

const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-seed-1',
    type: 'deposit',
    amountETB: 1500,
    amountUSDT: 10.71,
    method: 'Telebirr',
    description: 'Wallet Deposit',
    date: 'Sep 29, 2026 • 14:20',
    status: 'completed',
    reference: 'TLB948201948',
    adminCommand: '/send 984572019 1500 ETB approved TLB948201948',
  },
  {
    id: 'tx-seed-2',
    type: 'purchase',
    amountETB: 700,
    amountUSDT: 5.0,
    method: 'Wallet Balance',
    description: 'TradingView Premium',
    date: 'Sep 29, 2026 • 15:10',
    status: 'completed',
    reference: 'ATH-ORD-TV-849',
  },
  {
    id: 'tx-seed-3',
    type: 'purchase',
    amountETB: 300,
    amountUSDT: 2.14,
    method: 'Wallet Balance',
    description: 'Telegram Premium',
    date: 'Sep 29, 2026 • 16:30',
    status: 'completed',
    reference: 'ATH-ORD-TG-301',
  },
];

const INITIAL_WALLET: WalletState = {
  balanceETB: 500,
  totalDepositedETB: 1500,
  totalSpentETB: 1000,
  transactions: INITIAL_TRANSACTIONS,
};

export const getWalletState = (): WalletState => {
  if (typeof window === 'undefined') return INITIAL_WALLET;
  try {
    const raw = localStorage.getItem(WALLET_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.balanceETB === 'number' && Array.isArray(parsed.transactions)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse wallet state:', e);
  }
  return INITIAL_WALLET;
};

export const saveWalletState = (state: WalletState): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(state));
    // Dispatch custom event so all listeners/components update reactively
    window.dispatchEvent(new CustomEvent('ath_wallet_updated', { detail: state }));
  } catch (e) {
    console.warn('Failed to save wallet state:', e);
  }
};

export const formatETB = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount) + ' ETB';
};

export const etbToUsdt = (amountETB: number): string => {
  const usdt = amountETB / ETB_TO_USDT_RATE;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdt) + ' USDT';
};

export const formatAdminNotification = (
  user: TelegramUser,
  amountETB: number,
  method: string,
  reference: string
): string => {
  const usdtVal = (amountETB / ETB_TO_USDT_RATE).toFixed(2);
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  const usernameDisplay = user.username ? `@${user.username}` : user.first_name;

  return `🔔 <b>New ATH Wallet Top-Up Submitted</b>

👤 <b>User:</b> ${usernameDisplay} (ID: <code>${user.id}</code>)
💰 <b>Amount:</b> ${formatETB(amountETB)} (≈ ${usdtVal} USDT)
🏦 <b>Payment Method:</b> ${method}
🔖 <b>Txn Reference:</b> <code>${reference}</code>
📅 <b>Timestamp:</b> ${now}
⚡️ <b>Status:</b> Pending Review

<b>Admin Approval Command:</b>
<code>/send ${user.id} ${amountETB} ETB approved ${reference}</code>`;
};

export const submitDeposit = (
  amountETB: number,
  method: string,
  reference: string,
  screenshotUrl: string | undefined,
  user: TelegramUser
): { transaction: WalletTransaction; adminNotification: string } => {
  const currentState = getWalletState();
  const txId = `tx-dep-${Date.now().toString().slice(-6)}`;
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
    ' • ' + 
    now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const adminCmd = `/send ${user.id} ${amountETB} ETB approved ${reference}`;
  const adminNotification = formatAdminNotification(user, amountETB, method, reference);

  const newTx: WalletTransaction = {
    id: txId,
    type: 'deposit',
    amountETB,
    amountUSDT: Number((amountETB / ETB_TO_USDT_RATE).toFixed(2)),
    method,
    description: `Deposit via ${method}`,
    date: dateFormatted,
    status: 'pending',
    reference: reference.trim().toUpperCase(),
    screenshotUrl,
    adminCommand: adminCmd,
  };

  const updatedState: WalletState = {
    ...currentState,
    transactions: [newTx, ...currentState.transactions],
  };

  saveWalletState(updatedState);
  return { transaction: newTx, adminNotification };
};

export const approvePendingDeposit = (transactionId: string): WalletState => {
  const currentState = getWalletState();
  let depositAmount = 0;

  const updatedTransactions = currentState.transactions.map((tx) => {
    if (tx.id === transactionId && tx.status === 'pending') {
      depositAmount = tx.amountETB;
      return { ...tx, status: 'completed' as const };
    }
    return tx;
  });

  const updatedState: WalletState = {
    balanceETB: currentState.balanceETB + depositAmount,
    totalDepositedETB: currentState.totalDepositedETB + depositAmount,
    totalSpentETB: currentState.totalSpentETB,
    transactions: updatedTransactions,
  };

  saveWalletState(updatedState);
  return updatedState;
};

export const instantWalletPurchase = (
  items: { name: string; priceETB: number; quantity: number }[]
): { success: boolean; message: string; orderId: string; totalCost: number } => {
  const currentState = getWalletState();
  const totalCost = items.reduce((sum, item) => sum + item.priceETB * item.quantity, 0);

  if (currentState.balanceETB < totalCost) {
    return {
      success: false,
      message: `Insufficient balance: You have ${formatETB(currentState.balanceETB)}, but need ${formatETB(totalCost)}.`,
      orderId: '',
      totalCost,
    };
  }

  const orderId = `ATH-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
    ' • ' + 
    now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const itemNames = items.map((i) => (i.quantity > 1 ? `${i.name} (x${i.quantity})` : i.name)).join(', ');

  const purchaseTx: WalletTransaction = {
    id: `tx-pur-${Date.now().toString().slice(-6)}`,
    type: 'purchase',
    amountETB: totalCost,
    amountUSDT: Number((totalCost / ETB_TO_USDT_RATE).toFixed(2)),
    method: 'Wallet Balance',
    description: `Instant Checkout • ${itemNames}`,
    date: dateFormatted,
    status: 'completed',
    reference: orderId,
  };

  const updatedState: WalletState = {
    balanceETB: currentState.balanceETB - totalCost,
    totalDepositedETB: currentState.totalDepositedETB,
    totalSpentETB: currentState.totalSpentETB + totalCost,
    transactions: [purchaseTx, ...currentState.transactions],
  };

  saveWalletState(updatedState);

  return {
    success: true,
    message: 'Order placed instantly with Wallet Balance!',
    orderId,
    totalCost,
  };
};
