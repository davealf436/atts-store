import http from 'http';
import { validateTelegramInitData, generateSignedInitData, DEFAULT_MAX_AUTH_AGE_SECONDS } from './src/server/authTelegram';
import { sessionStore } from './src/server/authRouter';
import { accountDb } from './src/server/accountDb';

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

async function request(path: string, options: { method?: string; body?: any; token?: string } = {}) {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {}

  return { status: res.status, ok: res.ok, json, text };
}

interface TestReport {
  name: string;
  category: string;
  passed: boolean;
  details: string;
}

const results: TestReport[] = [];

function record(category: string, name: string, passed: boolean, details: string) {
  results.push({ category, name, passed, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} [${category}] ${name}: ${details}`);
}

async function runAudit() {
  console.log('=====================================================');
  console.log('ATH TELEGRAM AUTHENTICATION SECURITY AUDIT SUITE');
  console.log('=====================================================\n');

  // --------------------------------------------------------------------------
  // TEST 1: First-Time Authentication
  // --------------------------------------------------------------------------
  console.log('--- Checking 1: First-Time Authentication ---');
  const freshUserId = 700000000 + Math.floor(Math.random() * 100000);
  const firstTimeUser = {
    id: freshUserId,
    first_name: 'AuditFirstName',
    last_name: 'AuditLastName',
    username: `audit_user_${freshUserId}`,
    language_code: 'en',
  };

  const validInitData1 = generateSignedInitData(firstTimeUser);
  const authRes1 = await request('/api/auth/telegram', {
    method: 'POST',
    body: { initData: validInitData1 },
  });

  const firstTimePassed =
    authRes1.status === 200 &&
    authRes1.json?.success === true &&
    authRes1.json?.isNew === true &&
    authRes1.json?.account?.telegramId === freshUserId &&
    authRes1.json?.account?.id === `ath_${freshUserId}` &&
    typeof authRes1.json?.token === 'string';

  record(
    'Account Identity',
    'First-time user receives single new account and valid session',
    firstTimePassed,
    `Status: ${authRes1.status}, isNew: ${authRes1.json?.isNew}, account.id: ${authRes1.json?.account?.id}`
  );

  const initialToken = authRes1.json?.token;

  // --------------------------------------------------------------------------
  // TEST 2: Returning-User Authentication
  // --------------------------------------------------------------------------
  console.log('\n--- Checking 2: Returning-User Authentication ---');
  const returningUserUpdated = {
    ...firstTimeUser,
    first_name: 'AuditUpdatedName',
    username: `audit_updated_${freshUserId}`,
  };
  const validInitData2 = generateSignedInitData(returningUserUpdated);
  const authRes2 = await request('/api/auth/telegram', {
    method: 'POST',
    body: { initData: validInitData2 },
  });

  const returningPassed =
    authRes2.status === 200 &&
    authRes2.json?.success === true &&
    authRes2.json?.isNew === false &&
    authRes2.json?.account?.telegramId === freshUserId &&
    authRes2.json?.account?.id === `ath_${freshUserId}` &&
    authRes2.json?.account?.firstName === 'AuditUpdatedName';

  // Check no duplicate created in DB
  const allAccounts = accountDb.getAll().filter((a) => a.telegramId === freshUserId);
  const noDuplicates = allAccounts.length === 1;

  record(
    'Account Identity',
    'Returning user loads existing account without creating duplicates',
    returningPassed && noDuplicates,
    `Status: ${authRes2.status}, isNew: ${authRes2.json?.isNew}, distinct DB accounts with id: ${allAccounts.length}`
  );

  // --------------------------------------------------------------------------
  // TEST 3: Invalid Signatures & Tampered Data
  // --------------------------------------------------------------------------
  console.log('\n--- Checking 3: Invalid Signatures & Tampered InitData ---');
  // 3a. Completely invalid/tampered hash
  const tamperedHashInitData = validInitData1.replace(/hash=[0-9a-f]+/i, 'hash=deadbeef00000000000000000000000000000000000000000000000000000000');
  const tamperedRes1 = await request('/api/auth/telegram', {
    method: 'POST',
    body: { initData: tamperedHashInitData },
  });
  const tamperedHashRejected =
    tamperedRes1.status === 401 && tamperedRes1.json?.error === 'INVALID_TELEGRAM_SIGNATURE';
  record(
    'Signature Security',
    'Rejects tampered hash signature with 401 INVALID_TELEGRAM_SIGNATURE',
    tamperedHashRejected,
    `Status: ${tamperedRes1.status}, error: ${tamperedRes1.json?.error}`
  );

  // 3b. Tampered user payload with original hash
  const tamperedPayloadInitData = validInitData1.replace(encodeURIComponent('"AuditFirstName"'), encodeURIComponent('"HackedName"'));
  const tamperedRes2 = await request('/api/auth/telegram', {
    method: 'POST',
    body: { initData: tamperedPayloadInitData },
  });
  const tamperedPayloadRejected =
    tamperedRes2.status === 401 && tamperedRes2.json?.error === 'INVALID_TELEGRAM_SIGNATURE';
  record(
    'Signature Security',
    'Rejects modified payload with original hash',
    tamperedPayloadRejected,
    `Status: ${tamperedRes2.status}, error: ${tamperedRes2.json?.error}`
  );

  // 3c. Impersonation attempt: Attempting to supply unverified user object in body
  const spoofAttemptRes = await request('/api/auth/telegram', {
    method: 'POST',
    body: { initData: validInitData1, user: { id: 1, first_name: 'SpoofedAdmin' } },
  });
  const spoofBlocked =
    spoofAttemptRes.status === 200 && spoofAttemptRes.json?.account?.telegramId === freshUserId;
  record(
    'Data Protection',
    'Ignores client-supplied body user fields and trusts ONLY validated initData',
    spoofBlocked,
    `Authenticated user ID remained: ${spoofAttemptRes.json?.account?.telegramId} (not spoofed 1)`
  );

  // --------------------------------------------------------------------------
  // TEST 4: Expired "initData" (auth_date Freshness Enforcement)
  // --------------------------------------------------------------------------
  console.log('\n--- Checking 4: Expired initData (auth_date Freshness) ---');
  // 4a. Stale initData: signed 48 hours ago
  const staleAuthDate = Math.floor(Date.now() / 1000) - 48 * 3600;
  const expiredInitData = generateSignedInitData(firstTimeUser, undefined, staleAuthDate);
  const expiredRes = await request('/api/auth/telegram', {
    method: 'POST',
    body: { initData: expiredInitData },
  });
  const expiredRejected =
    expiredRes.status === 401 && expiredRes.json?.error === 'EXPIRED_INIT_DATA';
  record(
    'Telegram Auth Security',
    'Enforces auth_date freshness; rejects stale/expired initData (48h old)',
    expiredRejected,
    `Status: ${expiredRes.status}, error: ${expiredRes.json?.error}`
  );

  // 4b. Direct unit test of validateTelegramInitData freshness boundary
  const justExpiredDate = Math.floor(Date.now() / 1000) - (DEFAULT_MAX_AUTH_AGE_SECONDS + 10);
  const boundaryExpiredData = generateSignedInitData(firstTimeUser, undefined, justExpiredDate);
  const boundaryCheck = validateTelegramInitData(boundaryExpiredData);
  const boundaryRejected = !boundaryCheck.valid && boundaryCheck.error === 'EXPIRED_INIT_DATA';
  record(
    'Telegram Auth Security',
    'Boundary verification: initData older than 86400s is rejected',
    boundaryRejected,
    `valid: ${boundaryCheck.valid}, error: ${boundaryCheck.error}`
  );

  // 4c. Future auth_date protection (clock skew beyond 5 mins)
  const futureAuthDate = Math.floor(Date.now() / 1000) + 3600;
  const futureInitData = generateSignedInitData(firstTimeUser, undefined, futureAuthDate);
  const futureCheck = validateTelegramInitData(futureInitData);
  const futureRejected = !futureCheck.valid && futureCheck.error === 'FUTURE_AUTH_DATE';
  record(
    'Telegram Auth Security',
    'Rejects initData with auth_date set far into the future (+1h)',
    futureRejected,
    `valid: ${futureCheck.valid}, error: ${futureCheck.error}`
  );

  // --------------------------------------------------------------------------
  // TEST 5: Missing Telegram Credentials
  // --------------------------------------------------------------------------
  console.log('\n--- Checking 5: Missing Telegram Credentials & Inputs ---');
  // 5a. Missing initData entirely in HTTP body
  const missingDataRes = await request('/api/auth/telegram', {
    method: 'POST',
    body: {},
  });
  const missingDataRejected =
    (missingDataRes.status === 400 || missingDataRes.status === 401) && missingDataRes.json?.error === 'MISSING_INIT_DATA';
  record(
    'Input Validation',
    'Rejects request missing initData with 400 MISSING_INIT_DATA',
    missingDataRejected,
    `Status: ${missingDataRes.status}, error: ${missingDataRes.json?.error}`
  );

  // 5b. Missing botToken in validateTelegramInitData
  const missingTokenCheck = validateTelegramInitData(validInitData1, '');
  const missingTokenRejected =
    !missingTokenCheck.valid && missingTokenCheck.error === 'MISSING_BOT_CREDENTIALS';
  record(
    'Data Protection',
    'Rejects validation when server bot credentials are missing/empty',
    missingTokenRejected,
    `valid: ${missingTokenCheck.valid}, error: ${missingTokenCheck.error}`
  );

  // 5c. Missing hash in initData
  const noHashParams = new URLSearchParams(validInitData1);
  noHashParams.delete('hash');
  const noHashCheck = validateTelegramInitData(noHashParams.toString());
  const noHashRejected = !noHashCheck.valid && noHashCheck.error === 'MISSING_HASH';
  record(
    'Input Validation',
    'Rejects initData missing hash parameter',
    noHashRejected,
    `valid: ${noHashCheck.valid}, error: ${noHashCheck.error}`
  );

  // 5d. Missing auth_date parameter
  const noDateParams = new URLSearchParams(validInitData1);
  noDateParams.delete('auth_date');
  const noDateCheck = validateTelegramInitData(noDateParams.toString());
  const noDateRejected = !noDateCheck.valid && noDateCheck.error === 'MISSING_AUTH_DATE';
  record(
    'Input Validation',
    'Rejects initData missing auth_date parameter',
    noDateRejected,
    `valid: ${noDateCheck.valid}, error: ${noDateCheck.error}`
  );

  // --------------------------------------------------------------------------
  // TEST 6: Session Security (Tokens, Expiration, Revocation/Logout)
  // --------------------------------------------------------------------------
  console.log('\n--- Checking 6: Session Security (Active, Expired, Revoked) ---');
  // 6a. Access /me with valid token
  const meRes = await request('/api/auth/me', { token: initialToken });
  const meValid =
    meRes.status === 200 &&
    meRes.json?.success === true &&
    meRes.json?.account?.telegramId === freshUserId;
  record(
    'Session Security',
    'Active session token retrieves authenticated account via /api/auth/me',
    meValid,
    `Status: ${meRes.status}, account.telegramId: ${meRes.json?.account?.telegramId}`
  );

  // 6b. Token expiration
  // Create an explicitly expired session (-10 seconds)
  const expiredSession = sessionStore.createSession(freshUserId, -10000);
  const expiredMeRes = await request('/api/auth/me', { token: expiredSession.token });
  const expiredMeBlocked =
    expiredMeRes.status === 401 && expiredMeRes.json?.error === 'SESSION_EXPIRED';
  record(
    'Session Security',
    'Expired session token rejected with 401 SESSION_EXPIRED',
    expiredMeBlocked,
    `Status: ${expiredMeRes.status}, error: ${expiredMeRes.json?.error}`
  );

  // 6c. Session revocation via /api/auth/logout
  const logoutRes = await request('/api/auth/logout', {
    method: 'POST',
    token: initialToken,
  });
  const logoutSuccess = logoutRes.status === 200 && logoutRes.json?.revoked === true;

  // Immediately try using initialToken again:
  const postLogoutMeRes = await request('/api/auth/me', { token: initialToken });
  const tokenRevokedBlocked =
    postLogoutMeRes.status === 401 && postLogoutMeRes.json?.error === 'SESSION_EXPIRED';

  record(
    'Session Security',
    'Session token cannot be used after logout / revocation',
    logoutSuccess && tokenRevokedBlocked,
    `Logout status: ${logoutRes.status}, /me after logout: ${postLogoutMeRes.status}`
  );

  // 6d. Random / fake session token rejected
  const fakeRes = await request('/api/auth/me', { token: 'ath_sess_fake_token_123456789' });
  const fakeBlocked = fakeRes.status === 401;
  record(
    'Session Security',
    'Random/forged session tokens rejected with 401',
    fakeBlocked,
    `Status: ${fakeRes.status}`
  );

  // --------------------------------------------------------------------------
  // TEST 7: Descriptive & Distinct Error Messages for Client UI
  // --------------------------------------------------------------------------
  console.log('\n--- Checking 7: Descriptive & Distinct Error Messages ---');
  // 7a. Missing launch data message
  const missingMsgRes = await request('/api/auth/telegram', {
    method: 'POST',
    body: { initData: '' },
  });
  const missingMsgOk =
    missingMsgRes.status === 400 &&
    missingMsgRes.json?.message === 'Missing Telegram launch data. Please launch ATH directly from the Telegram bot.';
  record(
    'Error Clarity',
    'Missing initData returns specific helpful message instead of generic failure',
    missingMsgOk,
    `Status: ${missingMsgRes.status}, message: "${missingMsgRes.json?.message}"`
  );

  // 7b. Invalid signature message
  const invalidSigMsgRes = await request('/api/auth/telegram', {
    method: 'POST',
    body: { initData: tamperedHashInitData },
  });
  const invalidSigMsgOk =
    invalidSigMsgRes.status === 401 &&
    invalidSigMsgRes.json?.message === 'Invalid Telegram verification signature. The launch data could not be verified.';
  record(
    'Error Clarity',
    'Invalid signature returns distinct verification failure message',
    invalidSigMsgOk,
    `Status: ${invalidSigMsgRes.status}, message: "${invalidSigMsgRes.json?.message}"`
  );

  // 7c. Expired auth data message
  const expiredMsgRes = await request('/api/auth/telegram', {
    method: 'POST',
    body: { initData: expiredInitData },
  });
  const expiredMsgOk =
    expiredMsgRes.status === 401 &&
    expiredMsgRes.json?.message === 'Telegram authentication session expired. Please reopen ATH from Telegram.';
  record(
    'Error Clarity',
    'Expired initData returns distinct session expired message',
    expiredMsgOk,
    `Status: ${expiredMsgRes.status}, message: "${expiredMsgRes.json?.message}"`
  );

  // --------------------------------------------------------------------------
  // TEST 8: URL-Encoded & Hash-Prefixed Telegram Launch Data
  // --------------------------------------------------------------------------
  console.log('\n--- Checking 8: URL-Encoded & Hash-Prefixed tgWebAppData ---');
  const encodedInitData = encodeURIComponent(validInitData1);
  const encodedValidation = validateTelegramInitData(encodedInitData);
  const encodedPassed = encodedValidation.valid && encodedValidation.user?.id === freshUserId;
  record(
    'Format Flexibility',
    'Properly validates percent-encoded initData strings from URL query/hash',
    encodedPassed,
    `valid: ${encodedValidation.valid}, user.id: ${encodedValidation.user?.id}`
  );

  const hashPrefixedInitData = `tgWebAppData=${encodeURIComponent(validInitData1)}`;
  const hashPrefixValidation = validateTelegramInitData(hashPrefixedInitData);
  const hashPrefixPassed = hashPrefixValidation.valid && hashPrefixValidation.user?.id === freshUserId;
  record(
    'Format Flexibility',
    'Properly parses tgWebAppData= parameter prefix',
    hashPrefixPassed,
    `valid: ${hashPrefixValidation.valid}, user.id: ${hashPrefixValidation.user?.id}`
  );

  // --------------------------------------------------------------------------
  // TEST 9: Telegram Destination Link Verification
  // --------------------------------------------------------------------------
  console.log('\n--- Checking 9: Telegram Destination Link & Bot Username ---');
  // Check the actual destination functions
  const { getTelegramBotUsername, getTelegramMiniAppUrl } = await import('./src/services/telegram');
  const botUsername = getTelegramBotUsername();
  const miniAppUrl = getTelegramMiniAppUrl();

  const botNotPersonalUser = botUsername !== 'abyssiniavendor';
  const urlNotSavedMessages = !miniAppUrl.includes('abyssiniavendor');
  const urlPointsToAthBot = miniAppUrl.includes('abyssiniatradingbot') || miniAppUrl.startsWith('https://t.me/');

  record(
    'Destination Link',
    'Bot username is not hardcoded to personal user @abyssiniavendor',
    botNotPersonalUser,
    `Configured bot username: "${botUsername}" (not personal user)`
  );

  record(
    'Destination Link',
    'Open in Telegram URL targets ATH bot / Mini App (not Saved Messages)',
    urlNotSavedMessages && urlPointsToAthBot,
    `Mini App destination: "${miniAppUrl}"`
  );

  // --------------------------------------------------------------------------
  // TEST 10: Vercel API & Health Endpoints
  // --------------------------------------------------------------------------
  console.log('\n--- Checking 10: API Server & Health Status ---');
  const healthRes = await request('/api/health');
  const healthOk = healthRes.status === 200 && healthRes.json?.status === 'ok';
  record(
    'API Infrastructure',
    'Health API endpoint responds ok',
    healthOk,
    `Status: ${healthRes.status}, version: ${healthRes.json?.version}`
  );

  console.log('\n=====================================================');
  console.log('AUDIT SUMMARY REPORT');
  console.log('=====================================================');
  const allPassed = results.every((r) => r.passed);
  const passCount = results.filter((r) => r.passed).length;
  console.log(`Total checks: ${results.length}`);
  console.log(`Passed: ${passCount}`);
  console.log(`Failed: ${results.length - passCount}`);
  console.log(`Verdict: ${allPassed ? 'ALL AUDIT CHECKS PASSED ✅' : 'SOME CHECKS FAILED ❌'}`);
}

runAudit().catch((err) => {
  console.error('Audit suite crashed with error:', err);
  process.exit(1);
});
