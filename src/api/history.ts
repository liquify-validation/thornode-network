import { api } from "./client";

export interface Point {
  x: number;
  y: number;
}

/** One or more series keyed by block height, or null when the API has no data. */
export type Series = Point[][] | null;

const RUNE = 1e8;

function toPoints(raw: Record<string, number>, map: (v: number) => number): Point[] {
  return Object.entries(raw).map(([x, y]) => ({ x: Number(x), y: map(Number(y)) }));
}

const isEmpty = (raw: object | null | undefined) => !raw || Object.keys(raw).length === 0;
const toRune = (v: number) => Math.round(v / RUNE);

async function single(load: () => Promise<Record<string, number>>): Promise<Series> {
  const raw = await load();
  return isEmpty(raw) ? null : [toPoints(raw, toRune)];
}

export const loadTotalBond = () => single(api.totalBond);
export const loadMaxEffectiveStake = () => single(api.maxEffectiveStake);
export const loadBond = (node: string) => single(() => api.bond(node));

/** Divisor the original dashboard applied to grabRewardsAvg for its "Average / 100 Blocks" chart. */
const REWARDS_AVG_DIVISOR = 1e4;

/** [rewards per churn (ᚱ), the average series as the original dashboard showed it]. */
export async function loadRewards(node: string): Promise<Series> {
  const [raw, avg] = await Promise.all([api.rewards(node), api.rewardsAvg(node)]);
  if (isEmpty(raw) || isEmpty(avg)) return null;
  return [toPoints(raw, toRune), toPoints(avg, (v) => Math.round(v / REWARDS_AVG_DIVISOR))];
}

/** [slash points per churn, average slashes per 100 blocks]. */
export async function loadSlashes(node: string): Promise<Series> {
  const [raw, avg] = await Promise.all([api.slashes(node), api.slashesAvg(node)]);
  if (isEmpty(raw) || isEmpty(avg)) return null;
  return [toPoints(raw, (v) => v), toPoints(avg, (v) => Number(v.toFixed(3)))];
}

/** [max position, position] per churn. */
export async function loadPosition(node: string): Promise<Series> {
  const raw = await api.position(node);
  if (isEmpty(raw)) return null;
  const entries = Object.entries(raw);
  return [
    entries.map(([x, p]) => ({ x: Number(x), y: Number(p.max) })),
    entries.map(([x, p]) => ({ x: Number(x), y: Number(p.position) })),
  ];
}
