import React, { useState } from "react";
import { targetRouter, youtubeStrategies, youtubeDomains } from "../data/guideData";
import { 
  Cpu, Terminal, Shield, Play, Sliders, Share2, Image as ImageIcon,
  AlertTriangle, ExternalLink, Copy, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

import { StepGuide } from "../components/StepGuide";
import { StrategyMatrix } from "../components/StrategyMatrix";
import { Troubleshooting } from "../components/Troubleshooting";

export default function Home() {
  const [selectedStrategy, setSelectedStrategy] = useState(youtubeStrategies[0].id);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const currentStrategyObj = youtubeStrategies.find(s => s.id === selectedStrategy) || youtubeStrategies[0];

  const copySnippet = () => {
    navigator.clipboard.writeText(currentStrategyObj.configSnippet);
    setCopiedSnippet(true);
    toast.success("JSON конфигурации скопирован");
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-cyan-500/30">
      {/* Header */}
      <header className="border-b border-border/80 bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/40 p-1 flex items-center justify-center">
              <img src="/manus-storage/b4_logo_icon_6cf9a0fc.png" alt="b4 logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-white">
                  b4 Engine <span className="text-cyan-400 font-mono text-xs px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">openwrt guide</span>
                </span>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-950/30 text-xs">
                  ● Профиль GL-MT6000
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Руководство по YouTube на OpenWrt 25.12.5 (Filogic 830 ARMv8)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href="https://github.com/DanielLavrushin/b4" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-mono px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-foreground transition-all flex items-center gap-1.5 border border-border"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              GitHub: b4
            </a>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Ссылка скопирована!");
              }}
              className="text-xs font-mono border-cyan-500/30 hover:border-cyan-400 hover:text-cyan-300"
            >
              <Share2 className="w-3.5 h-3.5 mr-1" /> Поделиться
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 py-10 bg-gradient-to-b from-card/40 to-background">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                <Shield className="w-3.5 h-3.5" /> Проверено на ядре Linux 6.12.94
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-white leading-tight">
                Установка и настройка <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">b4</span> для YouTube на OpenWrt
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                Руководство для роутера <strong className="text-white">GL.iNet GL-MT6000 (Flint 2)</strong> с прошивкой <strong className="text-white">OpenWrt 25.12.5</strong> (Firewall4 / nftables, пакетный менеджер apk).
              </p>
            </div>
            <div className="lg:col-span-5">
              <Card className="bg-card/90 border-cyan-500/30">
                <CardHeader className="py-2.5 px-4 border-b border-border/60">
                  <CardTitle className="text-xs font-mono text-cyan-300 flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Профиль целевого устройства
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between border-b border-border/30 pb-1">
                    <span className="text-muted-foreground">Модель:</span>
                    <span className="text-white font-bold">{targetRouter.model}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/30 pb-1">
                    <span className="text-muted-foreground">Платформа:</span>
                    <span className="text-cyan-300">{targetRouter.targetPlatform}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/30 pb-1">
                    <span className="text-muted-foreground">Менеджер пакетов:</span>
                    <span className="text-emerald-400">apk (OpenWrt 25.x)</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-muted-foreground">Веб-интерфейс b4:</span>
                    <span className="text-cyan-400 font-bold">http://192.168.8.1:7000</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="container py-8 flex-1 space-y-6">
        <Tabs defaultValue="install" className="space-y-6">
                      <TabsList className="bg-card border border-border p-1 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-1 max-w-3xl">

            <TabsTrigger value="install" className="text-xs font-mono">
              <Terminal className="w-3.5 h-3.5 mr-1.5" /> Установка
            </TabsTrigger>
            <TabsTrigger value="strategies" className="text-xs font-mono">
              <Sliders className="w-3.5 h-3.5 mr-1.5" /> Стратегии
            </TabsTrigger>
            <TabsTrigger value="screenshots" className="text-xs font-mono">
              <ImageIcon className="w-3.5 h-3.5 mr-1.5" /> Скриншоты
            </TabsTrigger>
            <TabsTrigger value="troubleshoot" className="text-xs font-mono">
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> Траблшутинг
            </TabsTrigger>
          </TabsList>

          <TabsContent value="install">
            <Card className="border-border/80 bg-card/60">
              <CardContent className="pt-6">
                <StepGuide />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategies">
            <Card className="mb-4 border-cyan-500/30 bg-cyan-950/15">
              <CardContent className="py-3 text-xs text-muted-foreground">
                <strong className="text-cyan-300">Справочная вкладка:</strong> Discovery сам перебирает встроенные пресеты, проверяет их и создаёт сет. Не вставляйте эти JSON-фрагменты в конфигурацию вслепую; используйте их только для понимания результата Discovery или ручной настройки после проверки.
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <StrategyMatrix selectedId={selectedStrategy} onSelect={setSelectedStrategy} />
              </div>
              <div className="lg:col-span-4">
                <Card className="border-border/80 bg-card/80 sticky top-20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-mono text-cyan-300">
                        {currentStrategyObj.name}
                      </CardTitle>
                      <Button size="sm" variant="ghost" onClick={copySnippet} className="h-6 text-xs text-cyan-400">
                        {copiedSnippet ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />} Копия
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 font-mono text-xs">
                    <pre className="bg-black/70 p-3 rounded text-[11px] text-cyan-300 overflow-x-auto">
                      {currentStrategyObj.configSnippet}
                    </pre>
                    <div className="text-[11px] text-muted-foreground">
                      Целевые домены: <code>{youtubeDomains.slice(0, 5).join(", ")}</code> + GeoSite <code>youtube</code>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="screenshots">
            <Card className="border-border/80 bg-card/60 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-sm font-display text-cyan-300 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Скриншоты интерфейса b4
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Последовательность экранов настройки целей, GeoSite/GeoIP и фильтрации доменов.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <img
                  src="https://b4ytguide-abdxntke.manus.space/manus-storage/b4-discovery-screenshots_c352a515.jpg"
                  alt="Скриншоты интерфейса b4: сеты, фильтрация доменов, категории GeoSite и GeoIP"
                  className="block w-full h-auto rounded-lg border border-border/70"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="troubleshoot">
            <Troubleshooting />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 py-6 bg-card/40 text-center text-xs text-muted-foreground font-mono">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>Инженерное руководство b4 для OpenWrt 25.12.5 (GL.iNet GL-MT6000)</span>
          <div className="flex gap-4">
            <a href="https://github.com/DanielLavrushin/b4" target="_blank" rel="noreferrer" className="hover:text-cyan-400">
              GitHub репозиторий
            </a>
            <a href="https://docs.b4core.app" target="_blank" rel="noreferrer" className="hover:text-cyan-400">
              Документация b4
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
