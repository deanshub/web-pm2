module.exports = {
  pm2: true,
  name: 'mongo',
  cwd: '../vnext',
  script: 'mongoStarter.js',
  merge_logs: true,
  log_date_format: 'YYYY-MM-DD HH:mm Z',
  error_file: 'logs/mongo.stderr.log',
  out_file: 'logs/mongo.stdout.log',
  pid_file: 'logs/mongo.pid',
  env:{
    NODE_ENV: 'development',
  },
  env_production: {
    NODE_ENV: 'production',
  },
  instances: 1,
};
