import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSettings } = vi.hoisted(() => ({ getSettings: vi.fn() }));

vi.mock(
  "@/features/admin-settings/data/datasources/adminSystemSettingsQueries",
  () => ({ getSettings }),
);

import { useAdminSettingsStore } from "@/features/admin-settings/presentation/stores/adminSettingsStore";

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

describe("useAdminSettingsStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    getSettings.mockReset();
  });

  it("loads operational settings", async () => {
    getSettings.mockResolvedValue({
      ops_monitoring_enabled: false,
      ops_realtime_monitoring_enabled: false,
      ops_query_mode_default: "database",
    });

    const store = useAdminSettingsStore();
    await store.fetch();

    expect(getSettings).toHaveBeenCalledOnce();
    expect(store.opsMonitoringEnabled).toBe(false);
    expect(store.opsRealtimeMonitoringEnabled).toBe(false);
    expect(store.opsQueryModeDefault).toBe("database");
    expect(store.loaded).toBe(true);
    expect(store.loading).toBe(false);
    expect(localStorage.getItem("ops_monitoring_enabled_cached")).toBe("false");
  });

  it("deduplicates concurrent loads and skips a completed load unless forced", async () => {
    const request = createDeferred<Record<string, unknown>>();
    getSettings.mockReturnValueOnce(request.promise);

    const store = useAdminSettingsStore();
    const first = store.fetch();
    const concurrent = store.fetch();
    expect(getSettings).toHaveBeenCalledOnce();

    request.resolve({});
    await Promise.all([first, concurrent]);
    await store.fetch();
    expect(getSettings).toHaveBeenCalledOnce();

    getSettings.mockResolvedValueOnce({ ops_query_mode_default: "raw" });
    await store.fetch(true);
    expect(getSettings).toHaveBeenCalledTimes(2);
    expect(store.opsQueryModeDefault).toBe("raw");
  });

  it("retains cached operational values when the request fails", async () => {
    localStorage.setItem("ops_monitoring_enabled_cached", "false");
    localStorage.setItem("ops_realtime_monitoring_enabled_cached", "false");
    localStorage.setItem("ops_query_mode_default_cached", "database");
    getSettings.mockRejectedValueOnce(new Error("settings unavailable"));
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const store = useAdminSettingsStore();
    await store.fetch();

    expect(store.opsMonitoringEnabled).toBe(false);
    expect(store.opsRealtimeMonitoringEnabled).toBe(false);
    expect(store.opsQueryModeDefault).toBe("database");
    expect(store.loaded).toBe(true);
    expect(store.loading).toBe(false);
    expect(consoleError).toHaveBeenCalledWith(
      "[adminSettings] Failed to fetch settings:",
      expect.any(Error),
    );
    consoleError.mockRestore();
  });
});
