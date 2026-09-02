import type {
  Account,
  AgentStatus,
  WatchlistItem,
  MarketData,
  Decision,
  Position,
  Order,
  EquityCurvePoint,
  RiskData,
  Trade,
  OptionsChain,
  BacktestResult,
} from '@/types';

import {
  mockAccount,
  mockAgentStatus,
  getEquityCurve,
  getSparkline,
} from '@/mocks/account';
import { mockWatchlist, getMockMarketData } from '@/mocks/market';
import { mockPositions, mockDecisions, mockOrders, mockTrades } from '@/mocks/positions';
import { mockRiskData, getMockChain, mockBacktestResults } from '@/mocks/risk';
import { mockAgentLog, genNewLogEntry } from '@/mocks/agentLog';
export type { AgentLogEntry } from '@/mocks/agentLog';

const USE_MOCKS = (import.meta as unknown as { env: Record<string, string | undefined> }).env?.VITE_USE_MOCKS === 'true';
const API_BASE = (import.meta as unknown as { env: Record<string, string | undefined> }).env?.VITE_API_BASE_URL || 'http://localhost:8000';

async function mockDelay<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

async function postApi<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  async getAccount(): Promise<Account> {
    if (USE_MOCKS) return mockDelay(mockAccount);
    return fetchApi('/api/account');
  },

  async getAgentStatus(): Promise<AgentStatus> {
    if (USE_MOCKS) return mockDelay(mockAgentStatus);
    return fetchApi('/api/agent/status');
  },

  async getWatchlist(): Promise<WatchlistItem[]> {
    if (USE_MOCKS) return mockDelay(mockWatchlist);
    return fetchApi('/api/watchlist');
  },

  async getMarketData(symbol: string): Promise<MarketData> {
    if (USE_MOCKS) return mockDelay(getMockMarketData(symbol));
    return fetchApi(`/api/market/${symbol}`);
  },

  async getDecisions(limit = 50): Promise<Decision[]> {
    if (USE_MOCKS) return mockDelay(mockDecisions.slice(0, limit));
    return fetchApi(`/api/decisions?limit=${limit}`);
  },

  async getPositions(): Promise<Position[]> {
    if (USE_MOCKS) return mockDelay(mockPositions);
    return fetchApi('/api/positions');
  },

  async getOrders(limit = 50): Promise<Order[]> {
    if (USE_MOCKS) return mockDelay(mockOrders.slice(0, limit));
    return fetchApi(`/api/orders?limit=${limit}`);
  },

  async getEquityCurve(range = '1m'): Promise<EquityCurvePoint[]> {
    if (USE_MOCKS) return mockDelay(getEquityCurve(range));
    return fetchApi(`/api/equity-curve?range=${range}`);
  },

  async getRisk(): Promise<RiskData> {
    if (USE_MOCKS) return mockDelay(mockRiskData);
    return fetchApi('/api/risk');
  },

  async getTrades(): Promise<Trade[]> {
    if (USE_MOCKS) return mockDelay(mockTrades);
    return fetchApi('/api/trades');
  },

  async getOptionsChain(symbol: string, expiry?: string): Promise<OptionsChain> {
    if (USE_MOCKS) return mockDelay(getMockChain(symbol));
    const query = expiry ? `?expiry=${expiry}` : '';
    return fetchApi(`/api/options/chain/${symbol}${query}`);
  },

  async getBacktest(segment = 'oos'): Promise<BacktestResult> {
    if (USE_MOCKS) return mockDelay(mockBacktestResults[segment] || mockBacktestResults.oos);
    return fetchApi(`/api/backtest?segment=${segment}`);
  },

  async toggleAgent(running: boolean): Promise<{ running: boolean }> {
    if (USE_MOCKS) return mockDelay({ running });
    return postApi('/api/agent/toggle', { running });
  },

  async closePosition(id: string): Promise<{ success: boolean }> {
    if (USE_MOCKS) return mockDelay({ success: true });
    return postApi(`/api/positions/${id}/close`, {});
  },

  getInitialAgentLog: () => mockAgentLog,
  genNewLogEntry,
};

export { getSparkline };
