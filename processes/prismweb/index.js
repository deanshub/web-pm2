const fs = require('fs');

module.exports = {
  pm2: true,
  name: 'prismweb',
  cwd: '../prismweb/Prism.Web.Service.Console/bin/Debug',
  script: 'wrapper.js',
  args:['Prism.Web.Service.Console.exe'],
  merge_logs: true,
  log_date_format: 'YYYY-MM-DD HH:mm Z',
  error_file: 'logs/prismweb.stderr.log',
  out_file: 'logs/prismweb.stdout.log',
  pid_file: 'logs/prismweb.pid',
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
      fs.readFile('C:/git/prismweb/nginx/conf/nginx.conf', 'utf-8', (err, data) => {
        if (err) return reject(err);
        return resolve({'Whole Config': data});
      });
    });
  },
  setConfigurations:(configuration={})=>{
    return new Promise((resolve, reject)=>{
      if(configuration.hasOwnProperty('Whole Config')){
        console.log('started');
        fs.writeFile('C:/git/prismweb/nginx/conf/nginx.conf', configuration['Whole Config'], (err)=>{
          console.log('resolved');
          if (err) return reject(err);
          resolve(configuration);
        });
      }
    });
  },
};
