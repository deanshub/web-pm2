module.exports = {
  pm2: true,
  name: 'vnext',
  cwd: '../vnext',
  script: 'app.js',
  merge_logs: true,
  log_date_format: 'YYYY-MM-DD HH:mm Z',
  error_file: 'logs/vnext.stderr.log',
  out_file: 'logs/vnext.stdout.log',
  pid_file: 'logs/vnext.pid',
  env:{
    NODE_ENV: 'development',
  },
  env_production : {
    NODE_ENV: 'production',
  },
  max_memory_restart: '500M',
  instances: 1,
  autorestart : true,
  restart_delay: 4000,
};
