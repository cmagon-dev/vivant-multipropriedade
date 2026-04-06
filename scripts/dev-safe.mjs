import { execSync, spawn } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

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
    rmSync(nextPath, { recursive: true, force: true });
  }
}

if (process.platform === "win32") {
  killPort3000Windows();
}
cleanupNextCache();

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
