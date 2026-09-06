import { describe, expect, it } from "vitest";
import { benchmarkData, targetRouter, troubleshootingList, youtubeDomains, youtubeStrategies } from "./guideData";

describe("b4 OpenWrt YouTube guide data", () => {
  it("matches the target GL-MT6000 profile", () => {
    expect(targetRouter.model).toContain("GL-MT6000");
    expect(targetRouter.targetPlatform).toContain("mediatek/filogic");
    expect(targetRouter.packageManager).toContain("apk");
  });

  it("keeps YouTube targets and Discovery-first strategy guidance", () => {
    expect(youtubeDomains).toContain("*.googlevideo.com");
    expect(youtubeStrategies.length).toBeGreaterThan(0);
    expect(youtubeStrategies.every(strategy => !("effectiveness" in strategy))).toBe(true);
  });

  it("uses validation criteria instead of fabricated throughput benchmarks", () => {
    expect(benchmarkData.every(row => "metric" in row)).toBe(true);
    expect(benchmarkData.some(row => row.metric.includes("Фактическая скорость"))).toBe(true);
  });

  it("keeps QUIC and IPv6 troubleshooting guidance available", () => {
    expect(troubleshootingList.some(item => item.problem.includes("QUIC"))).toBe(true);
    expect(troubleshootingList.some(item => item.problem.includes("IPv6"))).toBe(true);
  });
});
