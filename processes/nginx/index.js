const fs = require('fs');

module.exports = {
  pm2proc: true,
  name: 'nginx',
  cwd: '../prismWeb/nginx',
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
      fs.readFile('C:/git/prismweb/nginx/conf/nginx.conf', 'utf-8', (err, data) => {
        if (err) return reject(err);
        return resolve({'general': data});
      });
    }).then((conf)=>{
      return new Promise((resolve, reject)=>{
        fs.readFile('C:/git/prismweb/nginx/conf/sisense.conf', 'utf-8', (err, data) => {
          if (err) return reject(err);
          return resolve(Object.assign({},conf,{'sisense': data}));
        });
      });
    }).then((conf)=>{
      return new Promise((resolve, reject)=>{
        fs.readFile('C:/git/prismweb/nginx/conf/node.conf', 'utf-8', (err, data) => {
          if (err) return reject(err);
          return resolve(Object.assign({},conf,{'node': data}));
        });
      });
    }).then((conf)=>{
      return new Promise((resolve, reject)=>{
        fs.readFile('C:/git/prismweb/nginx/conf/net.conf', 'utf-8', (err, data) => {
          if (err) return reject(err);
          return resolve(Object.assign({},conf,{'net': data}));
        });
      });
    }).then((conf)=>{
      return new Promise((resolve, reject)=>{
        fs.readFile('C:/git/prismweb/nginx/conf/ssl.conf', 'utf-8', (err, data) => {
          if (err) return reject(err);
          return resolve(Object.assign({},conf,{'ssl': data}));
        });
      });
    }).then((conf)=>{
      return new Promise((resolve, reject)=>{
        fs.readFile('C:/git/prismweb/nginx/conf/cors.conf', 'utf-8', (err, data) => {
          if (err) return reject(err);
          return resolve(Object.assign({},conf,{'cors': data}));
        });
      });
    }).then((conf)=>{
      return new Promise((resolve, reject)=>{
        fs.readFile('C:/git/prismweb/nginx/conf/static.conf', 'utf-8', (err, data) => {
          if (err) return reject(err);
          return resolve(Object.assign({},conf,{'static': data}));
        });
      });
    }).then((conf)=>{
      return new Promise((resolve, reject)=>{
        fs.readFile('C:/git/prismweb/nginx/conf/custom.conf', 'utf-8', (err, data) => {
          if (err) return reject(err);
          return resolve(Object.assign({},conf,{'custom': data}));
        });
      });
    });
  },
  setConfigurations:(config={})=>{
    return new Promise((resolve, reject)=>{
      if(config.hasOwnProperty('general')){
        fs.writeFile('C:/git/prismweb/nginx/conf/nginx.conf', config['general'], (err)=>{
          if (err) return reject(err);
          resolve(config);
        });
      }
    }).then((config)=>{
      return new Promise((resolve, reject)=>{
        if(config.hasOwnProperty('sisense')){
          fs.writeFile('C:/git/prismweb/nginx/conf/sisense.conf', config['sisense'], (err)=>{
            if (err) return reject(err);
            resolve(config);
          });
        }
      });
    }).then((config)=>{
      return new Promise((resolve, reject)=>{
        if(config.hasOwnProperty('node')){
          fs.writeFile('C:/git/prismweb/nginx/conf/node.conf', config['node'], (err)=>{
            if (err) return reject(err);
            resolve(config);
          });
        }
      });
    }).then((config)=>{
      return new Promise((resolve, reject)=>{
        if(config.hasOwnProperty('net')){
          fs.writeFile('C:/git/prismweb/nginx/conf/net.conf', config['net'], (err)=>{
            if (err) return reject(err);
            resolve(config);
          });
        }
      });
    }).then((config)=>{
      return new Promise((resolve, reject)=>{
        if(config.hasOwnProperty('ssl')){
          fs.writeFile('C:/git/prismweb/nginx/conf/ssl.conf', config['ssl'], (err)=>{
            if (err) return reject(err);
            resolve(config);
          });
        }
      });
    }).then((config)=>{
      return new Promise((resolve, reject)=>{
        if(config.hasOwnProperty('cors')){
          fs.writeFile('C:/git/prismweb/nginx/conf/cors.conf', config['cors'], (err)=>{
            if (err) return reject(err);
            resolve(config);
          });
        }
      });
    }).then((config)=>{
      return new Promise((resolve, reject)=>{
        if(config.hasOwnProperty('static')){
          fs.writeFile('C:/git/prismweb/nginx/conf/static.conf', config['static'], (err)=>{
            if (err) return reject(err);
            resolve(config);
          });
        }
      });
    }).then((config)=>{
      return new Promise((resolve, reject)=>{
        if(config.hasOwnProperty('custom')){
          fs.writeFile('C:/git/prismweb/nginx/conf/custom.conf', config['custom'], (err)=>{
            if (err) return reject(err);
            resolve(config);
          });
        }
      });
    });
  },
};
