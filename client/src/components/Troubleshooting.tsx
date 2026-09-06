import React from "react";
import { troubleshootingList } from "../data/guideData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, Wrench, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Troubleshooting() {
  const [copiedCmd, setCopiedCmd] = React.useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    toast.success("Команда скопирована!");
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-4">
      {troubleshootingList.map((item, idx) => (
        <Card key={idx} className="border-border/80 bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              {item.problem}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-muted-foreground">
              <div>
                <strong className="text-red-400 font-mono">Симптом:</strong> {item.symptom}
              </div>
              <div>
                <strong className="text-cyan-300 font-mono">Причина:</strong> {item.cause}
              </div>
            </div>
            <div className="pt-1">
              <strong className="text-emerald-400 font-mono">Решение:</strong> {item.solution}
            </div>
            {item.command && (
              <div className="bg-black/60 rounded p-2.5 border border-border/80 font-mono text-[11px] flex items-center justify-between gap-3">
                <code className="text-cyan-300 break-all">{item.command}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-cyan-400 hover:text-cyan-300 shrink-0"
                  onClick={() => copy(item.command, `trouble-${idx}`)}
                >
                  {copiedCmd === `trouble-${idx}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
