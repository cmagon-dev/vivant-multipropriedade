import { execSync, spawn } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

/**
 * Dev helper: libera a porta 3000 e opcionalmente limpa `.next`.
 *
 * IMPORTANTE: não apagar `.next` em todo `npm run dev` — isso faz o HTML referenciar
 * chunks antigos enquanto o disco já tem outro build, gerando 404 em `/_next/static/*`
 * e erro de MIME type (text/html em vez de CSS/JS).
 *
 * Limpeza explícita: `npm run dev:clean` ou `FORCE_CLEAN_NEXT=1 npm run dev`
 */
const shouldCleanNext =
  process.argv.includes("--clean") || process.env.FORCE_CLEAN_NEXT === "1";

function killPort3000Windows() {
  try {
    const output = execSync("netstat -ano", { encoding: "utf8" });
    const pids = new Set();
    for (const line of output.split(/\r?\n/)) {
      if (!line.includes(":3000") || !line.includes("LISTENING")) continue;
      const cols = line.trim().split(/\s+/);
      const pid = cols[cols.length - 1];
      if (pid && /^\d+$/.test(pid)) pids.add(pid);
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
      } catch {
        // Ignore failures when process already ended.
      }
    }
  } catch {
    // Ignore if netstat is unavailable.
  }
}

function cleanupNextCache() {
  const nextPath = join(process.cwd(), ".next");
  if (existsSync(nextPath)) {
    try {
      rmSync(nextPath, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
    } catch {
      if (process.platform === "win32") {
        try {
          execSync('cmd.exe /d /s /c "rmdir /s /q .next"', { stdio: "ignore" });
        } catch {
          // Ignore cache cleanup failure; Next can still start and recreate .next.
        }
      }
    }
  }
}

if (process.platform === "win32") {
  killPort3000Windows();
}

if (shouldCleanNext) {
  console.log("[dev-safe] Limpando pasta .next (--clean ou FORCE_CLEAN_NEXT=1)…");
  cleanupNextCache();
}

const child =
  process.platform === "win32"
    ? spawn("cmd.exe", ["/d", "/s", "/c", "npm run dev:raw"], {
        stdio: "inherit",
        env: process.env,
        cwd: process.cwd(),
      })
    : spawn("npm", ["run", "dev:raw"], {
        stdio: "inherit",
        env: process.env,
        cwd: process.cwd(),
      });

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
