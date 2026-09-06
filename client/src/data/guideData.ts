export interface RouterSpec {
  model: string;
  hostname: string;
  architecture: string;
  targetPlatform: string;
  firmware: string;
  kernel: string;
  packageManager: string;
  ram: string;
  flash: string;
  firewall: string;
}

export const targetRouter: RouterSpec = {
  model: "GL.iNet GL-MT6000 (Flint 2)",
  hostname: "OpenWrt",
  architecture: "ARMv8 Processor rev 4 (aarch64 / arm64, 4-core Cortex-A53 @ 2.0 GHz)",
  targetPlatform: "mediatek/filogic (Filogic 830)",
  firmware: "OpenWrt 25.12.5 r33051-f5dae5ece4 / LuCI openwrt-25.12 branch 26.183.16146~6aacb73",
  kernel: "Linux 6.12.94",
  packageManager: "apk (OpenWrt 25.x/24.x) / opkg (fallback)",
  ram: "1024 MB DDR4 (свободно ~850+ MB)",
  flash: "8 GB eMMC (громадный запас, extroot НЕ требуется)",
  firewall: "Firewall4 (nftables) с Flow Offloading"
};

export interface StrategyPreset {
  id: string;
  name: string;
  ispTarget: string;
  description: string;
  effectiveness: number; // 0-100%
  tcpFrag: string;
  faking: string;
  udpHandling: string;
  recommended: boolean;
  configSnippet: string;
}

export const youtubeStrategies: StrategyPreset[] = [
  {
    id: "combo-pastseq",
    name: "Combo + Pastseq (Дефолт TSPU v1.81)",
    ispTarget: "Ростелеком, МТС, Мегафон, Дом.ру, Билайн (универсальный)",
    description: "Разбиение TLS ClientHello на два сегмента (split + sni) с инъекцией поддельного пакета с отстающим номером sequence (pastseq) и рандомизированной задержкой 20-70 мс.",
    effectiveness: 94,
    tcpFrag: "combo (split2 / middle SNI + ext/pastseq)",
    faking: "pastseq, offset: 10000, payload: STUN, len: 1",
    udpHandling: "QUIC filter / refuse fallback to TCP",
    recommended: true,
    configSnippet: `{
  "tcp": { "seg2_delay": 20, "seg2_delay_max": 70 },
  "fragmentation": { "strategy": "combo" },
  "faking": { "sni": true, "strategy": "pastseq", "seq_offset": 10000, "sni_type": "stun" }
}`
  },
  {
    id: "md5-combo-pastseq",
    name: "TCP MD5 + Combo + Pastseq",
    ispTarget: "Региональные ТСПУ с глубоким reassembly TCP-стека",
    description: "Добавление опции TCP MD5 Signature (RFC 2385) в фейковые пакеты. ТСПУ признает пакет валидным и сбрасывает проверку, а конечный сервер Google отбрасывает фейк из-за несовпадения ключа.",
    effectiveness: 91,
    tcpFrag: "combo + md5sig",
    faking: "pastseq + tcp_md5=true",
    udpHandling: "drop QUIC or mute UDP 443",
    recommended: false,
    configSnippet: `{
  "tcp": { "seg2_delay": 30, "seg2_delay_max": 70 },
  "fragmentation": { "strategy": "combo" },
  "faking": { "sni": true, "strategy": "pastseq", "seq_offset": 10000, "tcp_md5": true }
}`
  },
  {
    id: "postrst-combo",
    name: "Post-ClientHello RST + Combo",
    ispTarget: "Провайдеры с таймерами десинхронизации сессий",
    description: "Отправка фиктивного TCP RST с заниженным TTL сразу после ClientHello. Промежуточный DPI ТСПУ считает сессию разорванной и перестает парсить поток, в то время как сервер YouTube продолжает отдавать 4K видео.",
    effectiveness: 89,
    tcpFrag: "combo fragmentation",
    faking: "post_rst count=3, ttl=7",
    udpHandling: "filter QUIC Initial",
    recommended: false,
    configSnippet: `{
  "tcp": { "seg2_delay": 30, "desync": { "mode": "rst", "ttl": 7, "count": 3, "post_desync": true } },
  "fragmentation": { "strategy": "combo" }
}`
  },
  {
    id: "disorder-aggressive",
    name: "Disorder Reverse + ACK Jitter",
    ispTarget: "Агрессивные DPI с блокировкой первого сегмента",
    description: "Нарушение порядка следования сегментов: второй сегмент ClientHello отправляется раньше первого. DPI буферизует трафик или падает по таймауту, видеопоток googlevideo.com не замедляется.",
    effectiveness: 86,
    tcpFrag: "disorder (reverse order)",
    faking: "fake_per_segment count=3",
    udpHandling: "refuse QUIC 443",
    recommended: false,
    configSnippet: `{
  "fragmentation": { "strategy": "disorder", "reverse_order": true, "middle_sni": true }
}`
  }
];

export interface TroubleshootingItem {
  problem: string;
  symptom: string;
  cause: string;
  solution: string;
  command: string;
}

export const troubleshootingList: TroubleshootingItem[] = [
  {
    problem: "Flow Offloading 'съедает' перехват пакетов b4",
    symptom: "b4 запущен, правила есть, но YouTube продолжает тормозить в 144p или не открывается.",
    cause: "В OpenWrt Firewall4 аппаратный или программный оффлоадинг переводит сессию в fast-path в обход хуков NFQUEUE.",
    solution: "Задержите оффлоад до 40-го пакета в /usr/share/firewall4/templates/ruleset.uc либо временно отключите Software flow offloading в LuCI -> Network -> Firewall.",
    command: "sed -i 's/meta l4proto { tcp, udp } flow offload @ft;/meta l4proto { tcp, udp } ct original packets ge 40 flow offload @ft;/g' /usr/share/firewall4/templates/ruleset.uc && fw4 restart"
  },
  {
    problem: "Блокировка по протоколу QUIC (HTTP/3 на UDP 443)",
    symptom: "В Chrome/Edge видео бесконечно буферизуются, а в Firefox или при выключенном QUIC всё работает.",
    cause: "DPI блокирует или дропает UDP 443 для googlevideo.com, а браузер зависает в попытке соединения по QUIC.",
    solution: "Включить отсечение QUIC в сете b4 (Set -> UDP -> Reject/Refuse QUIC) или запретить UDP 443 на роутере, принуждая браузер мгновенно откатиться на защищенный TCP.",
    command: "nft add rule inet fw4 forward ip daddr { 172.217.0.0/16, 142.250.0.0/15 } udp dport 443 reject"
  },
  {
    problem: "IPv6 утекает мимо правил b4",
    symptom: "Устройства с IPv6 получают AAAA записи и идут напрямую через провайдерский DPI без модификации пакетов.",
    cause: "По умолчанию b4 работает в режиме IPv4-only, если не включен глобальный IPv6 support.",
    solution: "Убедиться, что в Settings -> Core -> DNS включен 'Force IPv4 for matched domains' (вырезает AAAA для youtube/googlevideo) либо активировать IPv6 support в Settings -> Core.",
    command: "# Проверка в b4.json: system.dns.keep_ipv6_answers = false (по умолчанию вырезает IPv6)"
  },
  {
    problem: "Браузер использует Secure DNS (DoH) в обход роутера",
    symptom: "b4 не видит DNS запросы клиентов в логах и на странице Traffic.",
    cause: "В Chrome/Яндекс/Firefox включен 'Безопасный DNS', запросы идут на 1.1.1.1 или 8.8.8.8 по TLS порт 443.",
    solution: "Отключить 'Использовать безопасный DNS-сервер' в настройках браузера клиента, чтобы DNS шел через роутер (dnsmasq / b4).",
    command: "# На клиенте: Settings -> Privacy & Security -> Security -> Use secure DNS -> Off"
  },
  {
    problem: "Конфликт старых таблиц b4_mangle при сбоях",
    symptom: "Ошибка 'Could not process rule' в logread | grep b4 при перезапуске сервиса.",
    cause: "Остаточные таблицы в nftables от аварийно завершенных процессов.",
    solution: "Удалить зависшую таблицу nftables и перезапустить демон b4.",
    command: "nft delete table inet b4_mangle 2>/dev/null; /etc/init.d/b4 restart"
  }
];

export const youtubeDomains = [
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "googlevideo.com",
  "*.googlevideo.com",
  "ytimg.com",
  "*.ytimg.com",
  "ggpht.com",
  "*.ggpht.com",
  "youtu.be",
  "youtubei.googleapis.com",
  "yt4.ggpht.com"
];

export const benchmarkData = [
  { resolution: "1080p60", baseline: "Буферизация (144p)", b4Combo: "Мгновенно (60 fps)", speedMbps: 45 },
  { resolution: "1440p (2K)", baseline: "Ошибка загрузки", b4Combo: "Плавное (без фризов)", speedMbps: 85 },
  { resolution: "2160p (4K60)", baseline: "Недоступно", b4Combo: "Стабильно (буфер 35 сек)", speedMbps: 140 },
  { resolution: "Shorts / Live", baseline: "Задержка 15-20 сек", b4Combo: "Мгновенный старт (<1 сек)", speedMbps: 60 }
];
