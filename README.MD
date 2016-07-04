web-pm2
=======
PM2 Web interface.


![Image of web-pm2](http://image.prntscr.com/image/7e4503813c5e4d8fb119daf8cf56c76b.png)

### Usage
1) Install: ```npm install -g web-pm2```

2) Run: ```web-pm2```

3) enter: [```http://localhost:3666/```](http://localhost:3666/)

### Startup processes
You can add a configuration file that will start up pm2 processes at the start
of web-pm2

1) Create a directory named config on the web-pm2 root directory

2) Create a json file with the name of the enviroment as an example use default.json
(using the config module)

3) The file will contain processes manifest as shown here:
```
{
  "processes": [
    {
      "name": "mongo",
      "cwd": "../vnext",
      "script": "mongoStarter.js",
      "merge_logs": true,
      "log_date_format": "YYYY-MM-DD HH:mm Z",
      "error_file": "logs/mongo.stderr.log",
      "out_file": "logs/mongo.stdout.log",
      "pid_file": "logs/mongo.pid",
      "env":{
        "NODE_ENV": "development"
      },
      "env_production" : {
         "NODE_ENV": "production"
      },
      "instances": 1
    },
    {
      "name": "nginx",
      "cwd": "../nginx",
      "script": "wrapper.js",
      "args":["nginx.exe"],
      "merge_logs": true,
      "log_date_format": "YYYY-MM-DD HH:mm Z",
      "error_file": "logs/nginx.stderr.log",
      "out_file": "logs/nginx.stdout.log",
      "pid_file": "logs/nginx.pid",
      "autorestart":false,
      "env":{
        "NODE_ENV": "development"
      },
      "env_production" : {
         "NODE_ENV": "production"
      },
      "max_memory_restart": "500M",
      "instances": 1
    }
  ]
}
```

### TODOS
- [ ] system actions should be on the app bar.
- [x] refresh should be on the app bar.
- [ ] hide buttons when disabled.
- [ ] enabling logs.
- [x] search on the right end.
- [x] left of it the system actions and the refresh.
- [x] on the left end the process actions.
- [x] uptime in general info should be fixed.
- [x] uptime in the table should be fixed.
- [x] created on in the table should be fixed.
- [x] implement search logic by app name, pm2 id, pid.
