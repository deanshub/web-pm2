const express = require('express');
const path = require('path');

const utils = require('./common/utils');
const processController = require('./common/processController');
const pm2wrapper = require('./common/pm2wrapper');

const app = express();
const PORT = process.env.port||3666;

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

app.use('/', express.static(path.join(__dirname,'static')));

utils.loadExtraProcesses().then(()=>{
  utils.startup();
});

app.listen(PORT);
console.log(`listening on:  http://localhost:${PORT}/`);
