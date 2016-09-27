const express = require('express');
const os=require('os');
const path = require('path');

const utils = require('./common/utils');
const pm2wrapper = require('./common/pm2wrapper');

const app = express();
const PORT = process.env.port||3666;

//Information
app.get('/api/serverStat',(req,res)=>{
  let stats={
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
  pm2wrapper.list().then((list)=>{
    const externalProcesses = utils.getExternalProcesses();
    const statusPromises = Object.keys(externalProcesses).map(name=>externalProcesses[name].status());
    Promise.all(statusPromises).then((statuses)=>{
      const outerProcesses = Object.keys(externalProcesses).map((name, index)=>{
        return {
          name,
          pm_id: undefined,
          pm2_env: {
            exec_mode:undefined,
            status:statuses[index],
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
      res.json(stats);
    });
  });
});

//Operations
app.get('/api/operations/stop/:id',(req,res)=>{
  if(!req.params.id){
    res.status(400).send({
      error:'Process id not supplied',
    });
    return;
  }
  pm2wrapper.stop(req.params.id)
  .then(res.send)
  .catch((err)=>{
    res.status(400).send(err);
  });
});

app.get('/api/operations/restart/:id',(req,res)=>{
  if(!req.params.id){
    res.status(400).send({
      error:'Process id not supplied',
    });
    return;
  }
  pm2wrapper.restart(req.params.id)
  .then(res.send)
  .catch((err)=>{
    res.status(400).send(err);
  });
});

app.get('/api/operations/delete/:id',(req,res)=>{
  if(!req.params.id){
    res.status(400).send({
      error:'Process id not supplied',
    });
    return;
  }
  pm2wrapper.delete(req.params.id)
  .then(res.send)
  .catch((err)=>{
    res.status(400).send(err);
  });
});

app.get('/api/operations/kill',function(req,res){
  pm2wrapper.kill()
  .then(res.send)
  .catch((err)=>{
    res.status(400).send(err);
  });
});

app.use('/', express.static(path.join(__dirname,'static')));

utils.loadExtraProcesses().then(()=>{
  utils.startup();
});

app.listen(PORT);
console.log('listening on:  http://localhost:3666/');
