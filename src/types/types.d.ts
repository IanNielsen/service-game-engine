type SymbolId = string;

type Paytable = Record<SymbolId, number>;

interface Reels {
  lengths: number[];
  reelIndexes: number[][];
};

interface GameConfig {
  reels: Reels;
  symbols: SymbolId[];
  paytable: Paytable;
  winlines: number[][];
};

interface InitParams {
  token: string;
  gameId: string;
  currency: string;
}

interface InitResponse {
  sessionId: string,
  currency: string,
  balance: number,
  stakes: number[],
  gameConfig: GameConfig,
  roundDetails: RoundDetails | undefined
}

interface AbstractResult {
  payout: number;
}

interface WinlineResult extends AbstractResult {
  index: number;
  winline: number[];
  symbols: string[];
  payout: number;
}

interface WinlineAward {
  name: "winlines";
  payout: number;
  lines: WinlineResult[];
}

interface FullHouseDoubleAward {
  name: "fullHouseDouble";
  payout: number;
}

type Award = WinlineAward | FullHouseDoubleAward;

interface AnalysisRunResult {
  win: number;
  awards: Award[];
}

interface WinAnalysisResult {
  awards: Award[];
  win: number;
}

interface PlayParams {
  stake: number;
  sessionId: string;
}

interface PlayResponse {
  sessionId: string,
  balance: number,
  roundDetails: RoundDetails
}

interface RoundDetails {
  resolved: boolean;
  gameState: SlotGameState,
  payout: PayoutContext
}

interface SlotGameState {
  reelPositions: number[];
  reelWindow: string[][];
  awards: Award[];
  totalWin: number;
}

interface PayoutContext {
  stake: number;
  payout: number;
}

interface Session {
  sessionId: string;
  playerId: string;
  gameId: string;
  sessionStart: number;
  gameState?: any;
  currency: string;
}

interface ErrorResponse {
  error: string;
  message: string;
}

interface GameProfile {
  game: string;
  winAnalysis: string[];
  defaultReelPositions: number[];
  defaultStakeIndex: number;
  stakes: number[];
  reels: {
    lengths: number[];
    reelIndexes: number[][];
  };
  symbols: string[];
  paytable: Record<string, number>;
  winlines: number[][];
}

type GameResultWindow = string[][];

type WinAnalysisConstructor = new () => AbstractWinAnalysis;
