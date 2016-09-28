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
    const statusPromises = Object.keys(externalProcesses).map(name=>externalProcesses[name].status());
    return Promise.all([pm2wrapper.list(), ...statusPromises]).then(([list, ...statuses])=>{
      const outerProcesses = Object.keys(externalProcesses).map((name, index)=>{
        return {
          name,
          outer:true,
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
      });
      stats.processes=list.concat(outerProcesses);
      return stats;
    });
  },
  stop:(id)=>{
    const externalProcesses = utils.getExternalProcesses();
    if (externalProcesses[id]){
      return externalProcesses[id].stop();
    }else{
      return pm2wrapper.stop(id);
    }
  },
  restart:(id)=>{
    const externalProcesses = utils.getExternalProcesses();
    if (externalProcesses[id]){
      return externalProcesses[id].restart();
    }else{
      return pm2wrapper.restart(id);
    }
  },
  delete:(id)=>{
    const externalProcesses = utils.getExternalProcesses();
    if (externalProcesses[id]){
      return externalProcesses[id].delete();
    }else{
      return pm2wrapper.delete(id);
    }
  },
};
