import React from "react";
import { DiscoverySimulator } from "./DiscoverySimulator";
import { benchmarkData } from "../data/guideData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Play, TrendingUp, CheckCircle2 } from "lucide-react";

export function BenchmarkTab() {
  return (
    <div className="space-y-6">
      <DiscoverySimulator />

      <Card className="border-border/80 bg-card/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-display font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Сравнение воспроизведения видео на GL-MT6000: Baseline vs b4 Combo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="pb-2">Разрешение / Формат</th>
                  <th className="pb-2">Без b4 (Провайдерский ТСПУ)</th>
                  <th className="pb-2">С b4 (Combo + Pastseq)</th>
                  <th className="pb-2 text-right">Скорость CDN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {benchmarkData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/20">
                    <td className="py-2.5 font-bold text-white">{row.resolution}</td>
                    <td className="py-2.5 text-red-400">{row.baseline}</td>
                    <td className="py-2.5 text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {row.b4Combo}
                    </td>
                    <td className="py-2.5 text-right text-cyan-300 font-bold">{row.speedMbps} Мбит/с</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
