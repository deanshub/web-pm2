const config = require('config');
const pm2 = require('pm2');
const Q = require('q');
const path = require('path');
const fs = require('fs');

const EXTRA_PROCESSES_DIR = 'processes';
let externalProcesses = {};

const startup = () => {
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
};

const loadExtraProcesses = () => {
  return Q.nfcall(fs.readdir, path.join(__dirname, '..', EXTRA_PROCESSES_DIR), {encoding:'utf-8'})
  .then((files) => {
    externalProcesses = files.reduce((result, file) => {
      result[file] = require(`../${EXTRA_PROCESSES_DIR}/${file}`);
      return result;
    },{});
    return externalProcesses;
  }).catch(console.error);
};

module.exports = {
  startup,
  loadExtraProcesses,
  getExternalProcesses: ()=>{return externalProcesses;},
};
