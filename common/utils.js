const config = require('config');
const Q = require('q');
const path = require('path');
const fs = require('fs');

const processController = require('./processController');

const EXTRA_PROCESSES_DIR = 'processes';
let externalProcesses = {};
Q.longStackSupport = true;

const startup = () => {
  processController.list().then((stats)=>{
    const existingProcesses = stats.processes.reduce((result, process)=>{
      // console.log(process.name, process.pm2_env.status);
      result[process.name] = process;
      return result;
    },{});
    // console.log(existingProcesses);

    let promises;
    if (config.processes!==undefined && Array.isArray(config.processes)){
      promises = config.processes.map((process)=>{
        const processName = typeof(process)==='string'?process:process.name;

        if (existingProcesses[processName]!==undefined) {
          if (existingProcesses[processName].pm2_env && existingProcesses[processName].pm2_env.status!=='online'){
            if (existingProcesses[processName].pm2!==false){
              return ()=>{
                console.log(`Reloading ${processName}`);
                return processController.start(existingProcesses[processName]);
              };
            }else{
              return ()=>{
                console.log(`Reloading ${processName}`);
                return processController.restart(processName);
              };
            }
          }
        }else{
          return ()=>{
            console.log(`Starting ${processName}`);
            return processController.start(process);
          };
        }

        return ()=>Q(undefined);
      });
    }else {
      return ()=>Q([]);
    }

    return promises.reduce(Q.when, Q(undefined));
  }).catch(console.error);
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

module.exports.startup = startup;
module.exports.loadExtraProcesses = loadExtraProcesses;
module.exports.getExternalProcesses=()=>{return externalProcesses;};
