module.exports = {
  pm2proc: true,
  name: 'anal.e',
  cwd: '../anal.e/dist',
  script: 'index.js',
  merge_logs: true,
  log_date_format: 'YYYY-MM-DD HH:mm Z',
  error_file: 'logs/anale.stderr.log',
  out_file: 'logs/anale.stdout.log',
  pid_file: 'logs/anale.pid',
  env: {
    NODE_ENV: 'development',
  },
  env_production: {
    NODE_ENV: 'production',
  },
  max_memory_restart: '500M',
  instances: 1,
  autorestart: true,
  restart_delay: 4000,
};
