var express = require('express');
var os=require('os');
var pm2=require('pm2');
var path = require('path');

var utils = require('./utils');

var app = express();
var PORT = process.env.port||3666;

//Information
app.get('/api/serverStat',function(req,res){
  var _stat={
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
  pm2.connect(function(){
    pm2.list(function(err,list){
      pm2.disconnect();
      _stat.processes=list;
      res.json(_stat);
    });
  });
});

//Operations
app.get('/api/operations/stop/:id',function(request,response){
  if(!request.params.id){
    response.send(400 ,{
      error:'Process id not supplied',
    });
    return;
  }
  pm2.connect(function(){
    pm2.stop(request.params.id,function(err,details){
      if(err){
        console.log(err);
        response.send(err);
      }else
        response.send(details);
      pm2.disconnect();
    });
  });
});

app.get('/api/operations/restart/:id',function(request,response){
  if(!request.params.id){
    response.send(400 ,{
      error:'Process id not supplied',
    });
    return;
  }
  pm2.connect(function(){
    pm2.restart(request.params.id,function(err,details){
      if(err){
        console.log(err);
        response.send(err);
      }else
        response.send(details);
      pm2.disconnect();
    });
  });
});

app.get('/api/operations/delete/:id',function(request,response){
  if(!request.params.id){
    response.send(400 ,{
      error:'Process id not supplied',
    });
    return;
  }
  pm2.connect(function(){
    pm2.delete(request.params.id,function(err,status){
      if(err){
        console.log(err);
        response.send(err);
      }else
        response.send(status);
      pm2.disconnect();
    });
  });
});

app.get('/api/operations/kill',function(request,response){
  pm2.connect(function(){
    pm2.killDaemon(function(err,status){
      if(err){
        console.log(err);
        response.send(err);
      }else
        response.send(status);
    });
  });
});

app.use('/', express.static(path.join(__dirname,'static')));
utils.startup();
app.listen(PORT);
console.log('listening on:  http://localhost:3666/');
