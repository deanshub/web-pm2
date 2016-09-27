const child_process = require('child_process');

module.exports = {
  start: ()=>{
    return new Promise((resolve, reject) => {
      child_process.exec('iisreset /start', (err, stdOut, stdErr) => {
        if(err) return reject(err);
        return resolve({stdOut, stdErr});
      });
    });
  },
  stop: ()=>{
    return new Promise((resolve, reject) => {
      child_process.exec('iisreset /stop', (err, stdOut, stdErr) => {
        if(err) return reject(err);
        return resolve({stdOut, stdErr});
      });
    });
  },
  restart: ()=>{
    return new Promise((resolve, reject) => {
      child_process.exec('iisreset', (err, stdOut, stdErr) => {
        if(err) return reject(err);
        return resolve({stdOut, stdErr});
      });
    });
  },
  status: ()=>{
    return new Promise((resolve, reject) => {
      child_process.exec('iisreset /status', (err, stdOut, stdErr) => {
        if(err) return reject(err);
        if (/World Wide Web Publishing[^:]*: Running/i.test(stdOut)){
          return resolve('online');
        }else if (/World Wide Web Publishing[^:]*: Stopped/i.test(stdOut)){
          return resolve('stopped');
        }else{
          return reject({stdOut, stdErr});
        }
      });
    });
  },
};
