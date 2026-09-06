import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, CheckCircle2, Shield, Activity } from "lucide-react";
import { toast } from "sonner";

export function DiscoverySimulator() {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    "[System] Модуль Discovery готов к тестированию каналов связи.",
    "[Targets] Домены проверки: youtube.com, googlevideo.com (TLS 1.3 / TCP 443)"
  ]);

  const startTest = () => {
    setRunning(true);
    setStep(1);
    setLogs([
      "[0.2s] Инициализация очереди NFQUEUE 538 для изолированного тестирования...",
      "[0.5s] Проверка DNS (EDNS Client Subnet): резолв youtube.com -> 142.250.185.78, без отравления",
      "[0.8s] Прямой запрос без модификации (Baseline) -> TSPU RST / Throttling 16KB"
    ]);

    setTimeout(() => {
      setStep(2);
      setLogs(prev => [
        ...prev,
        "[1.5s] Перебор базовых стратегий: combo, pastseq, timestamp, disorder, md5...",
        "[2.2s] Тестирование 'combo-pastseq' (split middle SNI + STUN payload fake)...",
        "[2.8s] Ответ сервера получен за 42мс! Handshake успешен."
      ]);
    }, 1600);

    setTimeout(() => {
      setStep(3);
      setLogs(prev => [
        ...prev,
        "[3.4s] Тюнинг параметров: seg2_delay = 20-70ms, sequence offset = 10000",
        "[4.1s] Проверка стабильности потока googlevideo.com (3 контрольных запроса)...",
        "[4.6s] Все 3 запроса подтверждены! Ошибок TCP RST нет."
      ]);
    }, 3200);

    setTimeout(() => {
      setStep(4);
      setRunning(false);
      setLogs(prev => [
        ...prev,
        "[5.0s] ВЕРДИКТ: Найдена оптимальная стратегия 'combo-pastseq'!",
        "[5.2s] В веб-панели нажмите 'Apply as a set' для применения к роутеру."
      ]);
      toast.success("Оптимальная стратегия для YouTube найдена!");
    }, 5000);
  };

  const reset = () => {
    setStep(0);
    setLogs([
      "[System] Модуль Discovery готов к тестированию каналов связи.",
      "[Targets] Домены проверки: youtube.com, googlevideo.com (TLS 1.3 / TCP 443)"
    ]);
  };

  return (
    <div className="bg-card/70 border border-border/80 rounded-lg p-4 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white">Интерактивный симулятор алгоритма Discovery (b4)</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            disabled={running} 
            onClick={startTest}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs h-7"
          >
            <Play className="w-3.5 h-3.5 mr-1" /> Запустить тест
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            disabled={running || step === 0} 
            onClick={reset}
            className="h-7 text-xs border-border"
          >
            <RotateCcw className="w-3 h-3 mr-1" /> Сброс
          </Button>
        </div>
      </div>

      {/* Индикатор прогресса шагов */}
      <div className="grid grid-cols-4 gap-2 text-[11px]">
        <div className={`p-2 rounded border ${step >= 1 ? "bg-cyan-950/60 border-cyan-500/50 text-cyan-300" : "bg-muted/40 border-border text-muted-foreground"}`}>
          1. DNS & Baseline
        </div>
        <div className={`p-2 rounded border ${step >= 2 ? "bg-cyan-950/60 border-cyan-500/50 text-cyan-300" : "bg-muted/40 border-border text-muted-foreground"}`}>
          2. Перебор пресетов
        </div>
        <div className={`p-2 rounded border ${step >= 3 ? "bg-cyan-950/60 border-cyan-500/50 text-cyan-300" : "bg-muted/40 border-border text-muted-foreground"}`}>
          3. Тюнинг задержек
        </div>
        <div className={`p-2 rounded border ${step >= 4 ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300" : "bg-muted/40 border-border text-muted-foreground"}`}>
          4. Подтверждение
        </div>
      </div>

      {/* Логи симуляции */}
      <div className="bg-black/80 rounded p-3 text-[11px] h-36 overflow-y-auto space-y-1 text-slate-300 border border-border/50">
        {logs.map((log, i) => (
          <div key={i} className={log.includes("УСПЕХ") || log.includes("ВЕРДИКТ") ? "text-emerald-400 font-bold" : log.includes("Throttling") ? "text-red-400" : ""}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}

