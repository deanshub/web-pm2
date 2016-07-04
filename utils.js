var config = require('config');
var pm2 = require('pm2');
var Q = require('q');

function startup() {
  pm2.connect(()=>{
    Q.nfcall(pm2.list).then((list)=>{
      let existingProcesses = list.reduce((result, process)=>{
        result[process.name] = process.pm2_env.status;
        return result;
      },{});

      let promises;
      if (config.processes!==undefined && Array.isArray(config.processes)){
        promises = config.processes.map((process)=>{
          if (existingProcesses[process.name]!==undefined) {
            if (existingProcesses[process.name]!=='online'){
              return ()=>{
                console.log(`Reloading ${process.name}`);
                return Q.nfcall(pm2.reload, process.name);
              };
            }
          }else{
            return ()=>{
              console.log(`Starting ${process.name}`);
              return Q.nfcall(pm2.start, process);
            };
          }
          return ()=>Q(undefined);
        });
      }else {
        return ()=>Q([]);
      }

      return promises.reduce(Q.when, Q(undefined));
    }).catch(console.log);
  });
}

module.exports = {
  startup,
};
