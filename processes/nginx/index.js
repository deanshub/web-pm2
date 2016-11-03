module.exports = {
  pm2: true,
  name: 'nginx',
  cwd: '../nginx',
  script: 'wrapper.js',
  args:['nginx.exe'],
  merge_logs: true,
  log_date_format: 'YYYY-MM-DD HH:mm Z',
  error_file: 'logs/nginx.stderr.log',
  out_file: 'logs/nginx.stdout.log',
  pid_file: 'logs/nginx.pid',
  autorestart:false,
  env:{
    NODE_ENV: 'development',
  },
  'env_production' : {
    NODE_ENV: 'production',
  },
  max_memory_restart: '500M',
  instances: 1,
};
