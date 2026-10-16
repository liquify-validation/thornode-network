import type { ReactNode } from "react";
import { themed } from "../../assets";
import { useThemed } from "../../hooks/theme";
import { formatCountdown } from "../../lib/network";
import type { GlobalData } from "../../types";
import { HistoryPopover } from "../charts/HistoryChart";
import { HistoryOutlined } from "../ui/icons";
import { DollarPopover } from "./DollarPopover";

const RUNE = 1e8;

interface StatProps {
  icon: readonly [string, string];
  title: string;
  value: ReactNode;
}

function Stat({ icon, title, value }: StatProps) {
  const pick = useThemed();
  return (
    <div className="overview-item">
      <img alt="" src={pick(...icon)} className="overview-item__icon" />
      <div className="overview-item__value">
        <div className="overview-item__value-title">{title}</div>
        <div className="overview-item__value-value">{value}</div>
      </div>
    </div>
  );
}

function churnStatus(g: GlobalData): { title: string; value: string } {
  // Kept exactly as the original dashboard: it compares `retiring` to strings, so with the
  // API's numeric 0/1 it always shows the (possibly negative) time until the next churn.
  if (g.churnTry && g.retiring === "false") return { title: "(CHURN) RETRY IN", value: formatCountdown(g.timeUntilRetry) };
  if (g.retiring === "true") return { title: "(CHURN) CURRENTLY CHURNING", value: "Churning" };
  return { title: "(CHURN) TIME UNTIL", value: formatCountdown(g.timeUntilChurn) };
}

/** The 12 network/market tiles at the top of every dashboard page. */
export function OverviewStats({ global, totalActiveBond }: { global: GlobalData; totalActiveBond: number }) {
  const pick = useThemed();
  const cg = global.coingecko;
  const price = cg?.current_price ?? 0;
  const bondedRune = Math.trunc(totalActiveBond / RUNE);
  const maxStakeRune = Math.trunc(global.maxEffectiveStake / RUNE);
  const churn = churnStatus(global);

  return (
    <div className="overview-list-wrapper">
      <div className="overview-list">
        <Stat icon={themed.block} title="CURRENT BLOCK" value={global.maxHeight.toLocaleString()} />
        <Stat icon={themed.churns} title={`${churn.title} `} value={churn.value} />

        <div className="overview-item">
          <img alt="" src={pick(...themed.bond)} className="overview-item__icon" />
          <div className="overview-item__value">
            <div className="overview-item__value-title">TOTAL BONDED VALUE</div>
            <DollarPopover title="Total Bonded Value in Dollars" usd={bondedRune * price}>
              <div className="overview-item__value-value" style={{ cursor: "pointer" }}>
                ᚱ{bondedRune.toLocaleString()}
              </div>
            </DollarPopover>
          </div>
        </div>

        <Stat icon={themed.marketcap} title="MARKET CAP" value={`$${cg?.market_cap?.toLocaleString() ?? ""}`} />
        <Stat icon={themed.time} title="24 HR VOLUME" value={`$${cg?.total_volume?.toLocaleString() ?? ""}`} />

        <DollarPopover title="Max Effective Bond in Dollars" usd={maxStakeRune * price}>
          <HistoryPopover kind="maxEffectiveStake" title="Max Effective Stake Over Time">
            <div className="overview-item" style={{ cursor: "pointer" }}>
              <img alt="" src={pick(...themed.verticalTop)} className="overview-item__icon" />
              <div className="overview-item__value">
                <div className="overview-item__value-title">MAX EFFECTIVE BOND</div>
                <div className="overview-item__value-value">
                  <HistoryOutlined style={{ marginRight: 4 }} />ᚱ{maxStakeRune.toLocaleString()}
                </div>
              </div>
            </div>
          </HistoryPopover>
        </DollarPopover>

        <HistoryPopover kind="totalBond" title="Total Bond Over Time">
          <div className="overview-item" style={{ cursor: "pointer" }}>
            <img alt="" src={pick(...themed.chartLine)} className="overview-item__icon" />
            <div className="overview-item__value">
              <div className="overview-item__value-title">TOTAL BOND OVER TIME</div>
              <div className="overview-item__value-value">CLICK HERE</div>
            </div>
          </div>
        </HistoryPopover>

        <Stat icon={themed.runeUsdt} title="PRICE" value={`$${cg?.current_price?.toLocaleString() ?? ""}`} />
        <Stat icon={themed.high} title="24 HR HIGH" value={`$${cg?.high_24h ?? ""}`} />
        <Stat icon={themed.low} title="24 HR LOW" value={`$${cg?.low_24h ?? ""}`} />
        <Stat icon={themed.mcapRank} title="MARKET CAP RANK" value={cg?.market_cap_rank ?? ""} />
        <Stat icon={themed.totalSupply} title="TOTAL SUPPLY" value={`ᚱ${cg?.total_supply?.toLocaleString() ?? ""}`} />
      </div>
    </div>
  );
}
