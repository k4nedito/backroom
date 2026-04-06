const colors = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function timestamp() {
  return new Date().toISOString();
}

function format(level: string, color: string, msg: string, meta?: unknown) {
  const ts = `${colors.dim}${timestamp()}${colors.reset}`;
  const lvl = `${color}${level.padEnd(5)}${colors.reset}`;
  const metaStr = meta !== undefined ? ` ${JSON.stringify(meta)}` : "";
  return `${ts} ${lvl} ${msg}${metaStr}`;
}

export const log = {
  info(msg: string, meta?: unknown) {
    console.log(format("INFO", colors.green, msg, meta));
  },
  warn(msg: string, meta?: unknown) {
    console.warn(format("WARN", colors.yellow, msg, meta));
  },
  error(msg: string, meta?: unknown) {
    console.error(format("ERROR", colors.red, msg, meta));
  },
  debug(msg: string, meta?: unknown) {
    console.debug(format("DEBUG", colors.cyan, msg, meta));
  },
  request(method: string, url: string, status: number, ms: number) {
    const color = status >= 500 ? colors.red : status >= 400 ? colors.yellow : colors.green;
    console.log(format("REQ", colors.blue, `${method} ${url} ${color}${status}${colors.reset} ${colors.dim}${ms}ms${colors.reset}`));
  },
};
