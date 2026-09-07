import React, { useState } from "react";
import { Terminal, Copy, Check, CheckCircle2, AlertTriangle, Shield } from "lucide-react";
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
            Для перехвата пакетов в user-space движку b4 нужен <code>kmod-nft-queue</code>; для conntrack на OpenWrt 25.12 пакет называется <code>kmod-nf-conntrack</code>.
          </p>
        </div>

        <div className="bg-black/60 rounded-lg p-3 border border-border/80 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground pb-1 border-b border-border/40">
            <span>SSH на роутере (OpenWrt 25.12 apk):</span>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 px-2 text-xs text-cyan-400 hover:text-cyan-300"
              onClick={() => copy("apk update && apk add kmod-nft-queue kmod-nft-nat kmod-nft-compat kmod-nf-conntrack curl ca-certificates jq", "cmd-1")}
            >
              {copiedId === "cmd-1" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="ml-1">Копировать</span>
            </Button>
          </div>
          <pre className="text-emerald-400 overflow-x-auto py-1">
            apk update && apk add kmod-nft-queue kmod-nft-nat kmod-nft-compat kmod-nf-conntrack curl ca-certificates jq
          </pre>
          <div className="text-[11px] text-muted-foreground pt-1">
            * Для старых образов с <code>opkg</code> установите минимум: <code>opkg update && opkg install curl ca-certificates</code>. Имена kernel-модулей сверяйте с репозиторием конкретной версии.
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

      {/* Управление службой и пути установки */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card/70 border-cyan-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display text-cyan-300 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Управление службой b4
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-muted-foreground">Команды выполняются по SSH от имени <code>root</code>.</p>
            <div className="flex justify-end">
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-cyan-400 hover:text-cyan-300" onClick={() => copy("/etc/init.d/b4 enable     # автозапуск при загрузке\n/etc/init.d/b4 start\n/etc/init.d/b4 stop\n/etc/init.d/b4 restart\n/etc/init.d/b4 status\nlogread -e b4 | tail -50", "service-commands")}>
                {copiedId === "service-commands" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}<span className="ml-1">Копировать</span>
              </Button>
            </div>
            <div className="bg-black/60 rounded-lg p-3 border border-border/80 font-mono text-[11px]">
              <pre className="text-cyan-300 leading-6 overflow-x-auto">{`/etc/init.d/b4 enable     # автозапуск при загрузке
/etc/init.d/b4 start
/etc/init.d/b4 stop
/etc/init.d/b4 restart
/etc/init.d/b4 status
logread -e b4 | tail -50`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-cyan-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display text-cyan-300 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Пути установки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto text-xs font-mono">
              <table className="w-full">
                <thead className="text-muted-foreground border-b border-border/60">
                  <tr><th className="text-left py-2 pr-3">Хранилище</th><th className="text-left py-2 pr-3">Бинарник</th><th className="text-left py-2">Конфигурация</th></tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  <tr><td className="py-2 pr-3 text-emerald-300">/opt (extroot/USB)</td><td className="py-2 pr-3 text-cyan-300">/opt/bin/b4</td><td className="py-2 text-cyan-300">/opt/etc/b4/b4.json</td></tr>
                  <tr><td className="py-2 pr-3 text-amber-300">Без /opt (fallback)</td><td className="py-2 pr-3 text-cyan-300">/usr/bin/b4</td><td className="py-2 text-cyan-300">/etc/b4/b4.json</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">Проверить фактический путь можно командами <code>command -v b4</code> и <code>ls -l /opt/bin/b4 /usr/bin/b4 2&gt;/dev/null</code>.</p>
          </CardContent>
        </Card>
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
            Если в активном Firewall4 есть правило <code>flow offload @ft</code>, поток может уйти в fast-path до того, как b4 закончит обработку первых пакетов. Для совместной работы оставьте software offloading включённым, но отложите его до 40-го пакета. Если flowtable не используется, этот патч не нужен.
          </p>
        </div>

        <div className="bg-black/60 rounded-lg p-3 border border-border/80 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground pb-1 border-b border-border/40">
            <span>Патч шаблона firewall4 и перезапуск:</span>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 px-2 text-xs text-cyan-400 hover:text-cyan-300"
              onClick={() => copy("sysctl -w net.netfilter.nf_conntrack_acct=1 && cp -a /usr/share/firewall4/templates/ruleset.uc /root/ruleset.uc.before-b4 && sed -i 's/meta l4proto { tcp, udp } flow offload @ft;/meta l4proto { tcp, udp } ct original packets ge 40 flow offload @ft;/g' /usr/share/firewall4/templates/ruleset.uc && fw4 check && /etc/init.d/firewall restart", "cmd-3")}
            >
              {copiedId === "cmd-3" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="ml-1">Копировать</span>
            </Button>
          </div>
          <pre className="text-amber-300 overflow-x-auto py-1">
            sysctl -w net.netfilter.nf_conntrack_acct=1 && cp -a /usr/share/firewall4/templates/ruleset.uc /root/ruleset.uc.before-b4 && sed -i 's/meta l4proto &#123; tcp, udp &#125; flow offload @ft;/meta l4proto &#123; tcp, udp &#125; ct original packets ge 40 flow offload @ft;/g' /usr/share/firewall4/templates/ruleset.uc && fw4 check && /etc/init.d/firewall restart
          </pre>
          <div className="text-[11px] text-muted-foreground pt-1">
            Перед запуском проверьте <code>fw4 print | grep -E 'flowtable|flow offload|original packets'</code>. Патч включает conntrack accounting, сохраняет резервную копию, проверяет синтаксис и перезапускает firewall. После применения проверьте <code>nft list chain inet fw4 forward | grep -E 'flow offload|original packets'</code>.
          </div>

          <div className="mt-3 rounded-lg border-2 border-red-500/70 bg-red-950/35 p-3 shadow-lg shadow-red-950/20">
            <div className="flex items-center gap-2 text-red-300 font-bold text-xs uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4" /> Откат — сохранить этот блок
            </div>
            <p className="text-[11px] text-red-100/80 mt-1">Если после патча пропал интернет, выросла нагрузка или b4 работает хуже, восстановите резервную копию и перезапустите firewall:</p>
            <div className="mt-2 flex justify-end">
              <Button size="sm" variant="ghost" className="h-6 px-2 text-[11px] text-red-300 hover:text-red-200" onClick={() => copy("cp -a /root/ruleset.uc.before-b4 /usr/share/firewall4/templates/ruleset.uc && fw4 check && /etc/init.d/firewall restart", "rollback")}>
                {copiedId === "rollback" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}<span className="ml-1">Копировать откат</span>
              </Button>
            </div>
            <div className="mt-1 bg-black/70 rounded border border-red-500/40 p-2">
              <pre className="text-red-200 text-[11px] leading-5 overflow-x-auto">cp -a /root/ruleset.uc.before-b4 /usr/share/firewall4/templates/ruleset.uc && fw4 check && /etc/init.d/firewall restart</pre>
            </div>
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
        </div>

        <Card className="bg-card/70 border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display text-cyan-300">YouTube</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <p className="font-bold text-cyan-300 mb-2">Откройте браузер по адресу:</p>
              <p className="font-mono text-muted-foreground">http://&lt;IP-роутера&gt;:7000</p>
              <p className="text-muted-foreground mt-1">Обычно:</p>
              <p className="font-mono text-muted-foreground">http://192.168.8.1:7000 — для GL.iNet</p>
              <p className="font-mono text-muted-foreground">или http://192.168.1.1:7000</p>
            </div>

            <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-3 space-y-3">
              <h4 className="font-bold text-cyan-300">База данных Geosite и GeoIP</h4>
              <p className="text-muted-foreground">Если при установке выбрать все рекомендуемые компоненты, RUNET Freedom и b4geoip будут скачаны автоматически.</p>
              <p className="text-muted-foreground">Если базы не были скачаны во время установки:</p>
              <ol start={3} className="list-decimal list-inside space-y-1 text-muted-foreground font-mono">
                <li>Перейдите в <strong>Settings → База данных Geosite</strong>.</li>
                <li>Выберите источник <strong>RUNET Freedom</strong>.</li>
                <li>Нажмите <strong>«Скачать»</strong>.</li>
                <li>Перейдите в <strong>Settings → База данных GeoIP</strong>.</li>
                <li>Выберите источник <strong>b4geoip</strong>.</li>
                <li>Нажмите <strong>«Скачать»</strong>.</li>
              </ol>
            </div>

            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3">
              <h4 className="font-bold text-emerald-300 mb-2">Discovery и сет YouTube</h4>
              <ol start={9} className="list-decimal list-inside space-y-1 text-muted-foreground font-mono">
                <li>Перейдите во вкладку <strong>Discovery</strong>.</li>
                <li>В поле Discovery введите: <code>googlevideo.com</code>.</li>
                <li>Нажмите <strong>Start</strong> и дождитесь завершения Discovery.</li>
                <li>После завершения нажмите <strong>Apply as a set</strong>.</li>
                <li>В левом меню перейдите в раздел <strong>«Сеты»</strong> и откройте созданный сет для редактирования.</li>
                <li>Во вкладке <strong>«Цели»</strong>, в разделе <strong>«Категории GeoSite обхода»</strong>, выберите категорию <code>youtube</code>.</li>
                <li>Сохраните изменения.</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-red-500/70 bg-red-950/25 shadow-lg shadow-red-950/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-red-300 flex items-center gap-2 uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4" /> Полное удаление b4 после установки
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-red-100/85">Полное удаление останавливает и отключает службу, удаляет бинарники, конфигурацию и geodata. Перед выполнением убедитесь, что b4 больше не нужен.</p>
          <div className="rounded-lg border border-red-500/40 bg-black/40 p-3">
            <div className="flex items-center justify-between gap-3 text-red-200 font-bold text-xs">
              <span>Способ 1 — официальный установщик</span>
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-red-300 hover:text-red-200" onClick={() => copy("./install.sh --remove --quiet", "remove-script")}>
                {copiedId === "remove-script" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}<span className="ml-1">Копировать</span>
              </Button>
            </div>
            <p className="text-[11px] text-red-100/75 mt-1">Запустите из каталога, где находится <code>install.sh</code>. Ключи <code>--remove --quiet</code> удаляют каталог конфигурации и geodata без дополнительных вопросов.</p>
            <pre className="text-red-200 text-[11px] leading-5 mt-2 overflow-x-auto">./install.sh --remove --quiet</pre>
          </div>
          <div className="mt-3 text-xs text-red-200 font-bold">Способ 2 — ручное удаление</div>
          <div className="flex justify-end mt-2">
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-red-300 hover:text-red-200" onClick={() => copy("/etc/init.d/b4 stop 2>/dev/null || true; /etc/init.d/b4 disable 2>/dev/null || true; rm -f /etc/init.d/b4 /usr/bin/b4 /opt/bin/b4; rm -rf /etc/b4 /opt/etc/b4; nft delete table inet b4_mangle 2>/dev/null || true; if [ -f /root/ruleset.uc.before-b4 ]; then cp -a /root/ruleset.uc.before-b4 /usr/share/firewall4/templates/ruleset.uc; fi; fw4 check && /etc/init.d/firewall restart", "uninstall")}>
              {copiedId === "uninstall" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}<span className="ml-1">Копировать ручное удаление</span>
            </Button>
          </div>
          <div className="bg-black/70 rounded-lg p-3 border border-red-500/40 font-mono text-[11px]">
            <pre className="text-red-200 leading-5 overflow-x-auto">/etc/init.d/b4 stop 2&gt;/dev/null || true; /etc/init.d/b4 disable 2&gt;/dev/null || true; rm -f /etc/init.d/b4 /usr/bin/b4 /opt/bin/b4; rm -rf /etc/b4 /opt/etc/b4; nft delete table inet b4_mangle 2&gt;/dev/null || true; if [ -f /root/ruleset.uc.before-b4 ]; then cp -a /root/ruleset.uc.before-b4 /usr/share/firewall4/templates/ruleset.uc; fi; fw4 check &amp;&amp; /etc/init.d/firewall restart</pre>
          </div>
          <p className="text-[11px] text-red-100/75"><strong>Внимание:</strong> команда удаляет конфигурации b4. Если нужно сохранить настройки, заранее скопируйте <code>/etc/b4</code> и <code>/opt/etc/b4</code> на компьютер. Удаление b4 само по себе не откатывает patch flow offloading, если файла <code>/root/ruleset.uc.before-b4</code> нет.</p>

          <div className="mt-3 rounded-lg border-2 border-amber-500/70 bg-amber-950/30 p-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4" /> Отдельный откат flow offloading
            </div>
            <p className="text-[11px] text-amber-100/80 mt-1">Сначала используйте backup, если он существует. Ручной fallback ниже применяйте только если вы точно знаете, что заменяли именно стандартную строку firewall4 и других изменений в шаблоне нет.</p>
            <div className="mt-2 bg-black/70 rounded border border-amber-500/40 p-2 font-mono text-[11px] text-amber-200 overflow-x-auto">
              <div>if [ -f /root/ruleset.uc.before-b4 ]; then cp -a /root/ruleset.uc.before-b4 /usr/share/firewall4/templates/ruleset.uc; else sed -i 's/meta l4proto &#123; tcp, udp &#125; ct original packets ge 40 flow offload @ft;/meta l4proto &#123; tcp, udp &#125; flow offload @ft;/g' /usr/share/firewall4/templates/ruleset.uc; fi</div>
              <div className="mt-1">fw4 check &amp;&amp; /etc/init.d/firewall restart</div>
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-slate-500/60 bg-slate-950/40 p-3">
            <div className="text-slate-200 font-bold text-xs uppercase tracking-wide">Очистка только таблицы b4</div>
            <p className="text-[11px] text-slate-300/80 mt-1">Удаляйте только таблицу <code>inet b4_mangle</code>, если она осталась после остановки b4. Не используйте wildcard и не удаляйте другие таблицы nftables.</p>
            <code className="block mt-2 text-[11px] text-slate-200 font-mono">nft delete table inet b4_mangle 2&gt;/dev/null || true</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
