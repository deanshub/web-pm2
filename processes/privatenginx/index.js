const fs = require('fs');

module.exports = {
  pm2: true,
  name: 'privatenginx',
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
  getConfigurations:()=>{
    return new Promise((resolve, reject)=>{
      fs.readFile('C:/git/nginx/sisense.nconfig', 'utf-8', (err, data) => {
        if (err) return reject(err);
        return resolve({'Whole Config': data});
      });
    });
  },
  setConfigurations:(configuration={})=>{
    return new Promise((resolve, reject)=>{
      if(configuration.hasOwnProperty('Whole Config')){
        console.log('started');
        fs.writeFile('C:/git/nginx/sisense.nconfig', configuration['Whole Config'], (err)=>{
          console.log('resolved');
          if (err) return reject(err);
          resolve(configuration);
        });
      }
    });
  },
};
