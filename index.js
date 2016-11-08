const express = require('express');
const path = require('path');
var fileSystem = require('fs');
var bodyParser = require('body-parser');

const utils = require('./common/utils');
const processController = require('./common/processController');
const pm2wrapper = require('./common/pm2wrapper');

const app = express();
const PORT = process.env.port||3666;
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true,
}));

//Information
app.get('/api/serverStat',(req,res)=>{
  processController.list()
  .then((stats)=>{
    res.json(stats);
  })
  .catch((err)=>{
    console.log(2);
    console.error(err);
    res.status(400).send(err);
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
  processController.stop(req.params.id)
  .then((stats)=>{
    res.json(stats);
  })
  .catch((err)=>{
    console.error(err);
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
  processController.restart(req.params.id)
  .then((stats)=>{
    res.json(stats);
  })
  .catch((err)=>{
    console.error(err);
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
  processController.delete(req.params.id)
  .then((stats)=>{
    res.json(stats);
  })
  .catch((err)=>{
    console.error(err);
    res.status(400).send(err);
  });
});

app.get('/api/operations/kill', (req,res)=>{
  pm2wrapper.kill()
  .then((stats)=>{
    res.json(stats);
  })
  .catch((err)=>{
    console.error(err);
    res.status(400).send(err);
  });
});

app.get('/api/operations/logs/:id', (req,res) => {
  if(!req.params.id){
    res.status(400).send({
      error:'Process id not supplied',
    });
    return;
  }

  processController.describe(req.params.id).then(logsDetails=>{
    console.log(logsDetails);
    res.json(logsDetails);
  }).catch((err)=>{
    console.error(err);
    res.status(400).send(err);
  });
});

app.post('/api/operations/showlog', (req,res)=>{
  try{
    var readStream = fileSystem.createReadStream(req.body.logpath);
    readStream.pipe(res);
  }catch(e){
    console.error(`log "${req.body.logpath}" not found`);
  }
});

app.get('/api/operations/showlog/:id/:logname', (req,res)=>{
  let id = req.params.id;
  let logname = req.params.logname;

  if(!id){
    res.status(400).send({
      error:'Process id not supplied',
    });
    return;
  }

  if(!logname){
    res.status(400).send({
      error:'Logname not supplied',
    });
    return;
  }

  processController.describe(req.params.id).then(procsDetails=>{
    const logs = procsDetails.logsPaths.filter(proc=>proc.name===logname);
    if (logs.length>0){
      const readStream = fileSystem.createReadStream(logs[0].path);
      readStream.pipe(res);
    }else{
      console.error(`No log "${logname}" found on process "${id}"`);
      throw `No log "${logname}" found on process "${id}"`;
    }
  // pm2wrapper.describe(req.params.id).then((procDetails) => {
  //   let logFilePath = '';
  //
  //   if (logname === 'out') {
  //     logFilePath = procDetails[0].pm2_env.pm_out_log_path;
  //   } else if (logname === 'error') {
  //     logFilePath = procDetails[0].pm2_env.pm_err_log_path;
  //   }
  //
  //   var readStream = fileSystem.createReadStream(logFilePath);
  //   readStream.pipe(res);
  }).catch((err)=>{
    console.error(err);
    res.status(400).send(err);
  });
});

app.get('/api/operations/configuration/:id', (req,res)=>{
  if(!req.params.id){
    res.status(400).send({
      error:'Process id not supplied',
    });
    return;
  }

  processController.getConfigurations(req.params.id).then(configurationDetails=>{
    res.json(configurationDetails);
  }).catch((err)=>{
    console.error(err);
    res.status(400).send(err);
  });
});

app.post('/api/operations/configuration/:id', (req,res)=>{
  if(!req.params.id || !req.body.configurations){
    res.status(400).send({
      error:'Process id not supplied',
    });
    return;
  }

  processController.setConfigurations(req.params.id, req.body.configurations).then(configurationDetails=>{
    res.json(configurationDetails);
  }).catch((err)=>{
    console.error(err);
    res.status(400).send(err);
  });
});

app.use('/', express.static(path.join(__dirname,'static')));

utils.loadExtraProcesses().then(()=>{
  utils.startup();
});

app.listen(PORT);
console.log(`listening on:  http://localhost:${PORT}/`);
