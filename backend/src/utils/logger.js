const colors = {
  reset: "\x1b[0m",
  info: "\x1b[36m", // Cyan
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m" // Red
};

const formatMessage = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  const color = colors[level] || colors.reset;
  const metaStr = meta && Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${color}${level.toUpperCase()}${colors.reset}]: ${message}${metaStr}`;
};

const logger = {
  info: (message, meta) => {
    console.log(formatMessage('info', message, meta));
  },
  warn: (message, meta) => {
    console.warn(formatMessage('warn', message, meta));
  },
  error: (message, meta) => {
    console.error(formatMessage('error', message, meta));
  }
};

module.exports = logger;
