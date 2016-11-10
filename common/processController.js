const os=require('os');
const pm2wrapper = require('./pm2wrapper');
const utils = require('./utils');

function getOsStats() {
  return {
    system_info:{
      hostName:os.hostname(),
      uptime:os.uptime(),
    },
    monit:{
      loadavg:os.loadavg(),
      total_mem:os.totalmem(),
      free_mem:os.freemem(),
      cpu:os.cpus(),
      interfaces:os.networkInterfaces(),
    },
    os:{
      type:os.type(),
      platform:os.platform(),
      release:os.release(),
    },
    cpu_arch:os.arch(),
    loadAvg:os.loadavg(),
  };
}

module.exports={
  list:()=>{
    let stats = getOsStats();
    const externalProcesses = utils.getExternalProcesses();
    const statusPromises = Object.keys(externalProcesses).map(name=>{
      if (externalProcesses[name].pm2!==false){
        return new Promise(resolve=>{
          return resolve({status:'offline'});
        });
      }else{
        return externalProcesses[name].status().catch(err=>{
          console.error(`error getting status of external process "${name}":`, err);
          return {status:'unknown'};
        });
      }
    });
    return Promise.all([pm2wrapper.list(), ...statusPromises]).then(([list, ...statuses])=>{
      const pm2ProcesesNames = list.map(proc=>proc.name);

      const outerProcesses = Object.keys(externalProcesses)
      .filter(name=>!pm2ProcesesNames.includes(name))
      .map((name, index)=>{
        const procStatus = {
          name,
          pm2:false,
          pm_id: undefined,
          pm2_env: {
            exec_mode:'External Process',
            status:statuses[index].status,
            pm_uptime:undefined,
            created_at:undefined,
            restart_time:undefined,
            unstable_restarts:undefined,
          },
          pid: undefined,
          monit: {
            memory:undefined,
            cpu: undefined,
          },
        };

        if (externalProcesses[name].pm2!==false){
          return Object.assign({}, procStatus, externalProcesses[name]);
        }else{
          return procStatus;
        }
      });

      stats.processes=list.concat(outerProcesses);
      return stats;
    });
  },
  start:id=>{
    const externalProcesses = utils.getExternalProcesses();
    if (externalProcesses[id].pm2===false){
      return externalProcesses[id].start();
    }else{
      return pm2wrapper.start(externalProcesses[id]);
    }
  },
  stop:id=>{
    const externalProcesses = utils.getExternalProcesses();
    if (externalProcesses[id].pm2===false){
      return externalProcesses[id].stop();
    }else{
      return pm2wrapper.stop(id);
    }
  },
  restart:id=>{
    const externalProcesses = utils.getExternalProcesses();
    if (externalProcesses[id].pm2===false){
      return externalProcesses[id].restart();
    }else{
      return pm2wrapper.restart(id);
    }
  },
  delete:id=>{
    const externalProcesses = utils.getExternalProcesses();
    if (externalProcesses[id].pm2===false){
      return externalProcesses[id].delete();
    }else{
      return pm2wrapper.delete(id);
    }
  },
  describe:id=>{
    const externalProcesses = utils.getExternalProcesses();
    if (externalProcesses[id].pm2===false){
      return externalProcesses[id].describe().catch(err=>{
        console.error(`error getting described details of external process "${id}":`, err);
        return [];
      }).then(details=>{
        return {
          procId: id,
          logsPaths: details,
        };
      });
    }else{
      return pm2wrapper.describe(id).then(procDetails => {
        let logsPaths = [{
          name: 'error',
          path: procDetails[0].pm2_env.pm_err_log_path,
        },{
          name: 'out',
          path: procDetails[0].pm2_env.pm_out_log_path,
        }];

        let logsDetails = {
          procId: id,
          logsPaths,
        };

        return logsDetails;
      });
    }
  },
  getConfigurations:id=>{
    const externalProcesses = utils.getExternalProcesses();
    if (externalProcesses[id] && externalProcesses[id].getConfigurations){
      return externalProcesses[id].getConfigurations();
    }
    // else{
    //   return pm2wrapper.getConfigurations(id);
    // }
  },
  setConfigurations:(id, configuration)=>{
    const externalProcesses = utils.getExternalProcesses();
    if (externalProcesses[id] && externalProcesses[id].setConfigurations){
      return externalProcesses[id].setConfigurations(configuration);
    }
    // else{
    //   return pm2wrapper.setConfigurations(id, configuration);
    // }
  },
};
