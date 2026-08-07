import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), "../index.ts"),
  "utf8",
);

describe("single-admin route guard", () => {
  it("keeps setup and local login as the only named public entry routes", () => {
    expect(source).toContain("path: '/setup'");
    expect(source).toContain("path: '/login'");
    expect(source).not.toContain("path: '/register'");
    expect(source).not.toContain("path: '/key-usage'");
    expect(source).not.toContain("path: '/payment/result'");
  });

  it("requires administrator access for operational pages", () => {
    for (const path of [
      "/keys",
      "/usage",
      "/profile",
      "/admin/accounts",
      "/admin/groups",
      "/admin/settings",
    ]) {
      const routeStart = source.indexOf(`path: '${path}'`);
      expect(routeStart, path).toBeGreaterThanOrEqual(0);
      expect(source.slice(routeStart, routeStart + 420), path).toContain(
        "requiresAdmin: true",
      );
    }
  });

  it("redirects anonymous or non-admin sessions to local login", () => {
    expect(source).toContain(
      "if (to.meta.requiresAuth !== false && !authStore.isAuthenticated)",
    );
    expect(source).toContain(
      "if (to.meta.requiresAdmin === true && !authStore.isAdmin)",
    );
    expect(source).toContain("return '/login'");
  });

  it("does not contain registration, user OAuth, or payment callbacks", () => {
    for (const path of [
      "/auth/callback",
      "/auth/linuxdo/callback",
      "/auth/oidc/callback",
      "/auth/wechat/callback",
      "/email-verify",
      "/subscriptions",
      "/redeem",
    ]) {
      expect(source, path).not.toContain(path);
    }
  });
});
