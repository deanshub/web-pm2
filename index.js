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

app.get('/api/operations/logs/:id',function(request,response){
  if(!request.params.id){
    request.status(400).send({
      error:'Process id not supplied',
    });
    return;
  }

  pm2wrapper.describe(request.params.id).then((procDetails) => {
    var logsPaths = [];

    logsPaths.push({
      name: 'error',
      path: procDetails[0].pm2_env.pm_err_log_path,
    });
    logsPaths.push({
      name: 'out',
      path: procDetails[0].pm2_env.pm_out_log_path,
    });

    var logsDetails = {
      procId: request.params.id,
      logsPaths,
    };

    response.send(logsDetails);
  }).catch((err)=>{
    console.error(err);
    response.status(400).send(err);
  });
});

app.post('/api/operations/showlog',function(request,response){
  var readStream = fileSystem.createReadStream(request.body.logpath);
  readStream.pipe(response);
});

app.get('/api/operations/showlog/:id/:logname',function(request,response){
  let id = request.params.id;
  let logname = request.params.logname;

  if(!id){
    request.status(400).send({
      error:'Process id not supplied',
    });
    return;
  }

  if(!logname){
    request.status(400).send({
      error:'Logname not supplied',
    });
    return;
  }

  pm2wrapper.describe(request.params.id).then((procDetails) => {
    let logFilePath = '';

    if (logname === 'out') {
      logFilePath = procDetails[0].pm2_env.pm_out_log_path;
    } else if (logname === 'error') {
      logFilePath = procDetails[0].pm2_env.pm_err_log_path;
    }

    var readStream = fileSystem.createReadStream(logFilePath);
    readStream.pipe(response);
  }).catch((err)=>{
    console.error(err);
    response.status(400).send(err);
  });
});

app.use('/', express.static(path.join(__dirname,'static')));

utils.loadExtraProcesses().then(()=>{
  utils.startup();
});

app.listen(PORT);
console.log(`listening on:  http://localhost:${PORT}/`);
