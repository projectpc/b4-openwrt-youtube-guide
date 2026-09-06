import React, { useState } from "react";
import { Terminal, Copy, Check, CheckCircle2, AlertTriangle, Shield, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export function StepGuide() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Команда скопирована!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Шаг 1: Подготовка модулей ядра */}
      <div className="relative pl-8 border-l-2 border-cyan-500/40 space-y-3">
        <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center font-mono text-xs font-bold text-cyan-300">
          1
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-display font-bold text-white">
              Подготовка окружения и модулей ядра OpenWrt 25.12
            </h3>
            <Badge className="bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px]">
              apk / opkg
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            На OpenWrt 25.12 (ядро 6.12) используется пакетный менеджер <code>apk</code> и фаервол <code>nftables</code>. 
            Для перехвата пакетов в user-space движку b4 требуются модули <code>kmod-nft-queue</code> и <code>kmod-nft-conntrack</code>.
          </p>
        </div>

        <div className="bg-black/60 rounded-lg p-3 border border-border/80 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground pb-1 border-b border-border/40">
            <span>SSH на роутере (OpenWrt 25.12 apk):</span>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 px-2 text-xs text-cyan-400 hover:text-cyan-300"
              onClick={() => copy("apk update && apk add kmod-nft-queue kmod-nft-nat kmod-nft-compat kmod-nft-conntrack curl ca-certificates jq", "cmd-1")}
            >
              {copiedId === "cmd-1" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="ml-1">Копировать</span>
            </Button>
          </div>
          <pre className="text-emerald-400 overflow-x-auto py-1">
            apk update && apk add kmod-nft-queue kmod-nft-nat kmod-nft-compat kmod-nft-conntrack curl ca-certificates jq
          </pre>
          <div className="text-[11px] text-muted-foreground pt-1">
            * Если на вашем образе используется opkg: <code>opkg update && opkg install kmod-nft-queue kmod-nft-conntrack curl ca-certificates</code>
          </div>
        </div>
      </div>

      {/* Шаг 2: Установка b4 */}
      <div className="relative pl-8 border-l-2 border-cyan-500/40 space-y-3">
        <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center font-mono text-xs font-bold text-cyan-300">
          2
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-display font-bold text-white">
              Установка официального релиза b4
            </h3>
            <Badge className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
              Автодетект ARM64
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Скрипт установки DanielLavrushin/b4 автоматически определит архитектуру <code>arm64</code>, платформу <code>openwrt</code> и настроит службу <code>procd</code> в <code>/etc/init.d/b4</code>.
          </p>
        </div>

        <div className="bg-black/60 rounded-lg p-3 border border-border/80 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground pb-1 border-b border-border/40">
            <span>Быстрая установка одной командой:</span>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 px-2 text-xs text-cyan-400 hover:text-cyan-300"
              onClick={() => copy("curl -fsSL https://raw.githubusercontent.com/DanielLavrushin/b4/main/install.sh | sh", "cmd-2")}
            >
              {copiedId === "cmd-2" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="ml-1">Копировать</span>
            </Button>
          </div>
          <pre className="text-cyan-300 overflow-x-auto py-1">
            curl -fsSL https://raw.githubusercontent.com/DanielLavrushin/b4/main/install.sh | sh
          </pre>
          <div className="text-[11px] text-muted-foreground pt-1">
            Либо в тихом режиме со всеми параметрами по умолчанию: <code>curl -fsSL https://raw.githubusercontent.com/DanielLavrushin/b4/main/install.sh | sh -s -- --quiet</code>
          </div>
        </div>
      </div>

      {/* Шаг 3: Настройка Flow Offload */}
      <div className="relative pl-8 border-l-2 border-cyan-500/40 space-y-3">
        <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-cyan-950 border-2 border-amber-400 flex items-center justify-center font-mono text-xs font-bold text-amber-300">
          3
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-display font-bold text-white">
              КРИТИЧЕСКИ ВАЖНО: Адаптация Flow Offloading в Firewall4
            </h3>
            <Badge className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px]">
              Специфика OpenWrt
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            По умолчанию Flow Offload в OpenWrt сбрасывает соединение в fast-path на 1-2 пакете, из-за чего b4 перестает видеть трафик рукопожатия TLS. Необходимо отложить оффлоад до 40-го пакета:
          </p>
        </div>

        <div className="bg-black/60 rounded-lg p-3 border border-border/80 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground pb-1 border-b border-border/40">
            <span>Патч шаблона firewall4 и перезапуск:</span>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 px-2 text-xs text-cyan-400 hover:text-cyan-300"
              onClick={() => copy("sed -i 's/meta l4proto { tcp, udp } flow offload @ft;/meta l4proto { tcp, udp } ct original packets ge 40 flow offload @ft;/g' /usr/share/firewall4/templates/ruleset.uc && fw4 restart", "cmd-3")}
            >
              {copiedId === "cmd-3" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="ml-1">Копировать</span>
            </Button>
          </div>
          <pre className="text-amber-300 overflow-x-auto py-1">
            sed -i 's/meta l4proto &#123; tcp, udp &#125; flow offload @ft;/meta l4proto &#123; tcp, udp &#125; ct original packets ge 40 flow offload @ft;/g' /usr/share/firewall4/templates/ruleset.uc && fw4 restart
          </pre>
          <div className="text-[11px] text-muted-foreground pt-1">
            Проверка диагностики: запустите <code>/usr/bin/b4 --sysinfo</code> и убедитесь, что порог оффлоада равен 40 пакетов (зеленый статус OK).
          </div>
        </div>
      </div>

      {/* Шаг 4: Настройка YouTube через веб-панель */}
      <div className="relative pl-8 space-y-3">
        <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-cyan-950 border-2 border-emerald-400 flex items-center justify-center font-mono text-xs font-bold text-emerald-300">
          4
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-display font-bold text-white">
              Запуск Discovery и создание сета для YouTube
            </h3>
            <Badge className="bg-red-950 text-red-400 border border-red-800 text-[10px]">
              YouTube & Googlevideo
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Откройте браузер по адресу <code>http://&lt;IP-роутера&gt;:7000</code> (обычно <code>http://192.168.8.1:7000</code> для GL.iNet или <code>http://192.168.1.1:7000</code>).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <Card className="bg-card/70 border-border/70 p-3 space-y-2">
            <div className="font-mono text-cyan-400 font-bold flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-red-400" /> Способ А: Discovery (Автоподбор)
            </div>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground font-mono">
              <li>Перейдите во вкладку <strong>Discovery</strong></li>
              <li>В поле введите: <code>youtube.com, googlevideo.com</code></li>
              <li>Нажмите <strong>Start</strong> (занимает 1-3 минуты)</li>
              <li>После подтверждения нажмите <strong>Apply as a set</strong></li>
              <li>Сет автоматически активируется на первом месте</li>
            </ol>
          </Card>

          <Card className="bg-card/70 border-border/70 p-3 space-y-2">
            <div className="font-mono text-cyan-400 font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Способ Б: GeoSite База категорий
            </div>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground font-mono">
              <li>Перейдите в <strong>Settings → Geodat</strong></li>
              <li>Выберите источник <strong>RUNET Freedom</strong> и нажмите <strong>Download</strong></li>
              <li>В созданном сете YouTube во вкладке <strong>Targets</strong> выберите категорию GeoSite <code>youtube</code></li>
              <li>Это автоматически защитит все CDN-сервера видео и обложек</li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}
