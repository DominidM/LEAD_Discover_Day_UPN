// Dev harness: levanta el servidor de Next (UI, :3000) y la Cloudflare
// Pages Function local (wrangler, :8788) en paralelo. Con el rewrite de
// next.config.ts, /api/mentor en :3000 se proxea a :8788 y la IA funciona
// en modo desarrollo. Cero dependencias extra.

const { spawn } = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

// Ejecutamos los entry points JS con Node directamente. Así evitamos el bug de
// Node.js >=24 en Windows (spawn EINVAL al ejecutar archivos .cmd) y también
// evitamos shells anidados.
const wranglerEntry = path.join(root, "node_modules", "wrangler", "bin", "wrangler.js");
const nextEntry = path.join(root, "node_modules", "next", "dist", "bin", "next");

const children = [];

function run(label, args, port) {
  const url = `http://localhost:${port}`;
  console.log(`[dev:${label}] levantando… (${url})`);
  const child = spawn(process.execPath, args, {
    cwd: root,
    shell: false,
    stdio: ["ignore", "inherit", "inherit"],
  });
  children.push(child);
  child.on("exit", (code) => {
    console.log(`[dev:${label}] terminó con código ${code}.`);
    shutdown(code ?? 0);
  });
  child.on("error", (err) => {
    console.error(`[dev:${label}] error al iniciar: ${err.message}`);
    shutdown(1);
  });
  return child;
}

function shutdown(code) {
  for (const c of children) {
    try {
      c.kill("SIGTERM");
    } catch {
      /* noop */
    }
  }
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

run("api", [wranglerEntry, "pages", "dev", "out", "--port", "8788"], 8788);
run("ui", [nextEntry, "dev", "-p", "3000"], 3000);