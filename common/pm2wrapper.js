const pm2 = require('pm2');

module.exports={
  list:() => {
    return new Promise((resolve, reject)=>{
      pm2.connect(()=>{
        pm2.list((err,list)=>{
          pm2.disconnect();
          if(err){
            return reject(err);
          }
          return resolve(list)
        });
      });
    });
  },
  restart:(id) => {
    return new Promise((resolve, reject)=>{
      pm2.connect(()=>{
        pm2.start(id, (err, details)=>{
          pm2.disconnect();
          if(err){
            return reject(err);
          }
          return resolve(details);
        });
      });
    });
  },
  start:(id)=>{
    return new Promise((resolve, reject)=>{
      pm2.connect(()=>{
        pm2.start(id, (err, details)=>{
          pm2.disconnect();
          if(err){
            return reject(err);
          }
          return resolve(details);
        });
      });
    });
  },
  stop:(id) => {
    return new Promise((resolve, reject)=>{
      pm2.connect(()=>{
        pm2.stop(id, (err, details)=>{
          pm2.disconnect();
          if(err){
            return reject(err);
          }
          return resolve(details);
        });
      });
    });
  },
  restart:(id) => {
    return new Promise((resolve, reject)=>{
      pm2.connect(()=>{
        pm2.gracefulReload(id, (err, details)=>{
          pm2.disconnect();
          if(err){
            return reject(err);
          }
          return resolve(details);
        });
      });
    });
  },
  delete:(id) => {
    return new Promise((resolve, reject)=>{
      pm2.connect(()=>{
        pm2.delete(id, (err, details)=>{
          pm2.disconnect();
          if(err){
            return reject(err);
          }
          return resolve(details);
        });
      });
    });
  },
  kill:() => {
    return new Promise((resolve, reject)=>{
      pm2.connect(()=>{
        pm2.killDaemon((err,details)=>{
          if(err){
            return reject(err);
          }
          return resolve(details);
        });
      });
    });
  },
  describe:(id) => {
    return new Promise((resolve, reject)=>{
      pm2.connect(()=>{
        pm2.describe(id, (err, details)=>{
          pm2.disconnect();
          if(err){
            return reject(err);
          }
          return resolve(details);
        });
      });
    });
  },
};
