import { TrendingUp, TrendingDown, Leaf, AlertCircle } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { Tooltip } from "@/components/ui/Tooltip";
import type { PortfolioAssetPanel } from "@/types/api";

interface TopologyTableProps {
  assets: PortfolioAssetPanel[];
}

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function TopologyTable({ assets }: TopologyTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-2 text-muted font-medium">ISIN</th>
            <th className="text-left py-2 px-2 text-muted font-medium">Company</th>
            <th className="text-left py-2 px-2 text-muted font-medium">Sector</th>
            <th className="text-right py-2 px-2 text-muted font-medium">Weight</th>
            <th className="text-right py-2 px-2 text-muted font-medium">Allocation</th>
            <th className="text-right py-2 px-2 text-muted font-medium">Return</th>
            <th className="text-right py-2 px-2 text-muted font-medium">Risk</th>
            <th className="text-right py-2 px-2 text-muted font-medium">Sharpe</th>
            <th className="text-right py-2 px-2 text-muted font-medium">μESG</th>
            <th className="text-right py-2 px-2 text-muted font-medium">ΔESG</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((a) => (
            <tr key={a.isin} className="border-b border-border hover:bg-surface-raised/50">
              <td className="py-2 px-2">
                <code className="font-mono text-xs text-foreground">{a.isin}</code>
              </td>
              <td className="py-2 px-2 text-foreground">{a.company ?? "—"}</td>
              <td className="py-2 px-2">
                {a.sector ? <Chip label={a.sector} /> : "—"}
              </td>
              <td className="py-2 px-2 text-right text-foreground">
                {(a.weight * 100).toFixed(1)}%
              </td>
              <td className="py-2 px-2 text-right text-foreground">
                {fmt.format(a.allocation)}
              </td>
              <td className="py-2 px-2 text-right">
                <span
                  className={
                    (a.return_ann ?? 0) >= 0 ? "text-positive" : "text-negative"
                  }
                >
                  <span className="inline-flex items-center gap-0.5">
                    {(a.return_ann ?? 0) >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {a.return_ann !== null
                      ? `${(a.return_ann * 100).toFixed(1)}%`
                      : "—"}
                  </span>
                </span>
              </td>
              <td className="py-2 px-2 text-right text-foreground">
                {a.risk !== null ? `${(a.risk * 100).toFixed(1)}%` : "—"}
              </td>
              <td className="py-2 px-2 text-right text-foreground">
                {a.sharpe !== null ? a.sharpe.toFixed(2) : "—"}
              </td>
              <td className="py-2 px-2 text-right">
                <Tooltip content="ESG consensus score (0–1)">
                  <span className="inline-flex items-center gap-0.5 text-esg">
                    <Leaf className="w-3 h-3" />
                    {a.mu_esg !== null ? a.mu_esg.toFixed(2) : "—"}
                  </span>
                </Tooltip>
              </td>
              <td className="py-2 px-2 text-right">
                <Tooltip content="ESG disagreement — higher = less consensus">
                  <span className="inline-flex items-center gap-0.5 text-muted">
                    <AlertCircle className="w-3 h-3" />
                    {a.delta_esg !== null ? a.delta_esg.toFixed(2) : "—"}
                  </span>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
