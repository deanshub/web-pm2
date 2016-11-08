web-pm2
=======
PM2 Web interface.


![Image of web-pm2](http://image.prntscr.com/image/7e4503813c5e4d8fb119daf8cf56c76b.png)

### Usage
1) Install: ```npm install -g web-pm2```

2) Run: ```web-pm2```

3) enter: [```http://localhost:3666/```](http://localhost:3666/)

### Add processes to control (both pm2 and other)

web-pm2 controls the current running pm2 processes.

To control pm2 processes that are not running you only need to add them into processes directory.

#### How?

create a directory with the name of the process in processes directory,
create an index.js file within the new directory.

The index.js file should follow this interface:

it should export an object with the following functions and attributes (all functions should return a promise):

pm2, start, stop, restart, status, describe, getConfigurations, setConfigurations

An example:
```
module.exports = {
  pm2: false,
  start: function(){...},
  stop: function(){...},
  restart: function(){...},
  status: function(){...},
  describe: function(){...},
  getConfigurations: function(){...},
  setConfigurations: function(){...},
}
```

you can find more examples in processes directory that comes with the repo.

### Startup processes
You can add a configuration file that will start up pm2 processes at the start
of web-pm2

1) Create a directory named config on the web-pm2 root directory

2) Create a json file with the name of the environment as an example use default.json
(using the [config](https://www.npmjs.com/package/config) module)

3) The file will contain processes names as shown here, they should have the same name as the directory name:
```
{
  "processes": ["mongo",  "nginx",  "vnext",  "iis"]
}
```

### TODOS
- [ ] system actions should be on the app bar.
- [ ] hide buttons when disabled.
- [ ] process dependency handling.
- [ ] versioning of processes to show app on main screen (+its own).
- [ ] more abilities of processes through plugins.
- [x] refresh should be on the app bar.
- [x] enabling logs.
- [x] search on the right end.
- [x] left of it the system actions and the refresh.
- [x] on the left end the process actions.
- [x] uptime in general info should be fixed.
- [x] uptime in the table should be fixed.
- [x] created on in the table should be fixed.
- [x] implement search logic by app name, pm2 id, pid.
- [x] control processes out of pm2 reach.
- [x] configuration manager for processes.
