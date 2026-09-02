import { create } from 'zustand';
import { api, type AgentLogEntry } from '@/api';
import type {
  Account,
  AgentStatus,
  WatchlistItem,
  Decision,
  Position,
  Order,
  EquityCurvePoint,
  RiskData,
  Trade,
  OptionsChain,
  BacktestResult,
} from '@/types';

export type Page =
  | 'overview'
  | 'positions'
  | 'options-chain'
  | 'agent-log'
  | 'risk'
  | 'backtest'
  | 'settings';

interface AppState {
  // Navigation
  currentPage: Page;
  sidebarCollapsed: boolean;
  setPage: (page: Page) => void;
  toggleSidebar: () => void;

  // Data
  account: Account | null;
  agentStatus: AgentStatus | null;
  watchlist: WatchlistItem[];
  decisions: Decision[];
  positions: Position[];
  orders: Order[];
  equityCurve: EquityCurvePoint[];
  risk: RiskData | null;
  trades: Trade[];
  backtest: BacktestResult | null;
  agentLog: AgentLogEntry[];

  // Loading states
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;

  // Actions
  fetchAll: () => Promise<void>;
  fetchAccount: () => Promise<void>;
  fetchAgentStatus: () => Promise<void>;
  fetchWatchlist: () => Promise<void>;
  fetchDecisions: () => Promise<void>;
  fetchPositions: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchEquityCurve: (range: string) => Promise<void>;
  fetchRisk: () => Promise<void>;
  fetchTrades: () => Promise<void>;
  fetchBacktest: (segment: string) => Promise<void>;
  toggleAgent: (running: boolean) => Promise<void>;
  closePosition: (id: string) => Promise<void>;
  addLogEntry: (entry: AgentLogEntry) => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentPage: 'overview',
  sidebarCollapsed: false,
  setPage: (page) => set({ currentPage: page }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  account: null,
  agentStatus: null,
  watchlist: [],
  decisions: [],
  positions: [],
  orders: [],
  equityCurve: [],
  risk: null,
  trades: [],
  backtest: null,
  agentLog: api.getInitialAgentLog(),

  loading: {},
  errors: {},

  fetchAll: async () => {
    await Promise.all([
      get().fetchAccount(),
      get().fetchAgentStatus(),
      get().fetchWatchlist(),
      get().fetchDecisions(),
      get().fetchPositions(),
      get().fetchOrders(),
      get().fetchEquityCurve('1m'),
      get().fetchRisk(),
      get().fetchTrades(),
      get().fetchBacktest('oos'),
    ]);
  },

  fetchAccount: async () => {
    set((s) => ({ loading: { ...s.loading, account: true }, errors: { ...s.errors, account: null } }));
    try {
      const account = await api.getAccount();
      set((s) => ({ account, loading: { ...s.loading, account: false } }));
    } catch (e) {
      set((s) => ({ errors: { ...s.errors, account: (e as Error).message }, loading: { ...s.loading, account: false } }));
    }
  },

  fetchAgentStatus: async () => {
    set((s) => ({ loading: { ...s.loading, agentStatus: true }, errors: { ...s.errors, agentStatus: null } }));
    try {
      const agentStatus = await api.getAgentStatus();
      set((s) => ({ agentStatus, loading: { ...s.loading, agentStatus: false } }));
    } catch (e) {
      set((s) => ({ errors: { ...s.errors, agentStatus: (e as Error).message }, loading: { ...s.loading, agentStatus: false } }));
    }
  },

  fetchWatchlist: async () => {
    set((s) => ({ loading: { ...s.loading, watchlist: true }, errors: { ...s.errors, watchlist: null } }));
    try {
      const watchlist = await api.getWatchlist();
      set((s) => ({ watchlist, loading: { ...s.loading, watchlist: false } }));
    } catch (e) {
      set((s) => ({ errors: { ...s.errors, watchlist: (e as Error).message }, loading: { ...s.loading, watchlist: false } }));
    }
  },

  fetchDecisions: async () => {
    set((s) => ({ loading: { ...s.loading, decisions: true }, errors: { ...s.errors, decisions: null } }));
    try {
      const decisions = await api.getDecisions();
      set((s) => ({ decisions, loading: { ...s.loading, decisions: false } }));
    } catch (e) {
      set((s) => ({ errors: { ...s.errors, decisions: (e as Error).message }, loading: { ...s.loading, decisions: false } }));
    }
  },

  fetchPositions: async () => {
    set((s) => ({ loading: { ...s.loading, positions: true }, errors: { ...s.errors, positions: null } }));
    try {
      const positions = await api.getPositions();
      set((s) => ({ positions, loading: { ...s.loading, positions: false } }));
    } catch (e) {
      set((s) => ({ errors: { ...s.errors, positions: (e as Error).message }, loading: { ...s.loading, positions: false } }));
    }
  },

  fetchOrders: async () => {
    set((s) => ({ loading: { ...s.loading, orders: true }, errors: { ...s.errors, orders: null } }));
    try {
      const orders = await api.getOrders();
      set((s) => ({ orders, loading: { ...s.loading, orders: false } }));
    } catch (e) {
      set((s) => ({ errors: { ...s.errors, orders: (e as Error).message }, loading: { ...s.loading, orders: false } }));
    }
  },

  fetchEquityCurve: async (range: string) => {
    set((s) => ({ loading: { ...s.loading, equityCurve: true }, errors: { ...s.errors, equityCurve: null } }));
    try {
      const equityCurve = await api.getEquityCurve(range);
      set((s) => ({ equityCurve, loading: { ...s.loading, equityCurve: false } }));
    } catch (e) {
      set((s) => ({ errors: { ...s.errors, equityCurve: (e as Error).message }, loading: { ...s.loading, equityCurve: false } }));
    }
  },

  fetchRisk: async () => {
    set((s) => ({ loading: { ...s.loading, risk: true }, errors: { ...s.errors, risk: null } }));
    try {
      const risk = await api.getRisk();
      set((s) => ({ risk, loading: { ...s.loading, risk: false } }));
    } catch (e) {
      set((s) => ({ errors: { ...s.errors, risk: (e as Error).message }, loading: { ...s.loading, risk: false } }));
    }
  },

  fetchTrades: async () => {
    set((s) => ({ loading: { ...s.loading, trades: true }, errors: { ...s.errors, trades: null } }));
    try {
      const trades = await api.getTrades();
      set((s) => ({ trades, loading: { ...s.loading, trades: false } }));
    } catch (e) {
      set((s) => ({ errors: { ...s.errors, trades: (e as Error).message }, loading: { ...s.loading, trades: false } }));
    }
  },

  fetchBacktest: async (segment: string) => {
    set((s) => ({ loading: { ...s.loading, backtest: true }, errors: { ...s.errors, backtest: null } }));
    try {
      const backtest = await api.getBacktest(segment);
      set((s) => ({ backtest, loading: { ...s.loading, backtest: false } }));
    } catch (e) {
      set((s) => ({ errors: { ...s.errors, backtest: (e as Error).message }, loading: { ...s.loading, backtest: false } }));
    }
  },

  toggleAgent: async (running: boolean) => {
    try {
      await api.toggleAgent(running);
      set((s) => ({ agentStatus: s.agentStatus ? { ...s.agentStatus, running, mode: running ? 'AUTO' : 'PAUSED' } : null }));
    } catch (e) {
      set((s) => ({ errors: { ...s.errors, agent: (e as Error).message } }));
    }
  },

  closePosition: async (id: string) => {
    try {
      await api.closePosition(id);
      set((s) => ({ positions: s.positions.filter((p) => p.id !== id) }));
    } catch (e) {
      set((s) => ({ errors: { ...s.errors, positions: (e as Error).message } }));
    }
  },

  addLogEntry: (entry: AgentLogEntry) => {
    set((s) => ({ agentLog: [entry, ...s.agentLog].slice(0, 200) }));
  },
}));
