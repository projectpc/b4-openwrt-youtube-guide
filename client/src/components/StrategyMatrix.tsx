import React from "react";
import { youtubeStrategies } from "../data/guideData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap } from "lucide-react";

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function StrategyMatrix({ selectedId, onSelect }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {youtubeStrategies.map((s) => {
          const isSelected = s.id === selectedId;
          return (
            <Card 
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`cursor-pointer transition-all border text-left ${
                isSelected 
                  ? "border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400/50" 
                  : "border-border/80 bg-card/60 hover:border-cyan-500/40 hover:bg-card/90"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-display font-bold text-white flex items-center gap-1.5">
                    {s.name}
                  </CardTitle>
                  {s.recommended && (
                    <Badge className="bg-emerald-950 text-emerald-400 border border-emerald-700/50 text-[10px]">
                      Рекомендовано
                    </Badge>
                  )}
                </div>
                <p className="text-xs font-mono text-cyan-300/80 mt-1">
                  Цель: {s.ispTarget}
                </p>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <p className="text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
                
                <div className="space-y-1.5 pt-1 font-mono text-[11px] bg-black/40 p-2 rounded border border-border/40">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TCP Фрагментация:</span>
                    <span className="text-white">{s.tcpFrag}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Инъекция фейков:</span>
                    <span className="text-cyan-400">{s.faking}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">UDP / QUIC:</span>
                    <span className="text-amber-400">{s.udpHandling}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-muted-foreground">Эффективность на ТСПУ РФ:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-teal-400 to-cyan-400 h-1.5 rounded-full" 
                        style={{ width: `${s.effectiveness}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-cyan-400">{s.effectiveness}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
