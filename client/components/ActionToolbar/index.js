 import React, { Component, PropTypes } from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import { TextField, RaisedButton, MenuItem } from 'material-ui';
import { Popover, Menu, IconButton } from 'material-ui';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {GridList, GridTile} from 'material-ui/GridList';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import AvStop from 'material-ui/svg-icons/av/stop';
import AvReplay from 'material-ui/svg-icons/av/replay';
import ActionsDelete from 'material-ui/svg-icons/action/delete';
import InsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';
import PageView from 'material-ui/svg-icons/action/pageview';
import request from 'superagent';
import http from 'stream-http';
import classnames from 'classnames';
import style from './style.css';

// import ActionSearch from 'material-ui/svg-icons/action/search';


const SYSTEM_ACTIONS = {
  RESTART_ALL:'Start/Restart All',
  STOP_ALL:'Stop All',
  DELETE_ALL:'Delete All',
  KILL_PM2:'Kill PM2',
};

// import classnames from 'classnames';
// import {Line as LineChart} from 'react-chartjs';
// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'

// Chart.defaults.global.responsive = true

class ActionToolbar extends Component {
  static propTypes = {
    handleSearch: PropTypes.func,
    refreshStats: PropTypes.func,
    rowSelected: PropTypes.object,
  }

  constructor(props){
    super(props);
    this.request = null;
    this.state = {
      openMenu: false,
      dialogOpen: false,
      logsDetails: {
        procId: null,
        logsPaths: [],
      },
      logText: [],
    };
  }

  handleTouchTap(event){
    event.preventDefault();
    this.setState({
      anchorEl: event.currentTarget,
      openMenu: true,
    });
  }

  handleRequestClose(){
    this.setState({
      openMenu: false,
    });
  }

  handleOpen() {
    this.setState({dialogOpen: true});
  }

  showLog(logpath, id, logname) {
    this.setState({
      logText: [],
    });

    let path = `/api/operations/showlog/${id}/${logname}`;
    let options = {
      path,
      method: 'GET',
    };
    let req = http.request(options, (res) => {
      this.response = res;
      res.on('data', (buf) => {
        this.setState({
          logText: this.state.logText.concat([buf.toString()]),
        });
        var objDiv = document.getElementById('logContent');
        objDiv.scrollTop = objDiv.scrollHeight;
      });
      res.on('end', () => {
        this.setState({
          logText: this.state.logText.concat(['--------------------------------------']),
        });
        var objDiv = document.getElementById('logContent');
        objDiv.scrollTop = objDiv.scrollHeight;
      });
    });

    req.on('error', (error) => {
      console.log('error requesting log file: ', error);
    });

    req.end();

    this.request = req;
  }


  handleClose = () => {
    this.setState({
      dialogOpen: false,
      logText: [],
    });

    if (this.request) {
      this.request.abort();
      this.request = null;
    }
  };

  handleSystemAction(action, id){
    let url;
    if (action===SYSTEM_ACTIONS.RESTART_ALL){
      url = `/api/operations/restart/${id}`;
    }else if (action===SYSTEM_ACTIONS.STOP_ALL){
      url = `/api/operations/stop/${id}`;
    }else if (action===SYSTEM_ACTIONS.DELETE_ALL){
      url = `/api/operations/delete/${id}`;
    }else if (action===SYSTEM_ACTIONS.KILL_PM2){
      url = '/api/operations/kill';
    }else if (action==='Logs'){
      url = `/api/operations/logs/${id}`;
    }

    if (url){
      request.get(url)
      .end((err, res)=>{
        if (action === 'Logs') {
          this.setState({
            dialogOpen: true,
            logsDetails: res.body,
          });
        }
        setTimeout(this.props.refreshStats);
      });
    }
  }

  render() {
    const { rowSelected, handleSearch } = this.props;
    const { openMenu, anchorEl, logsDetails, logText } = this.state;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ];
    const styles = {

      scroll: {
        overflowY: 'scroll',
        overflowX: 'hidden',
        height: '30vh',
        whiteSpace: 'pre-wrap',
      },
    };

    const processId = rowSelected ? (rowSelected.pm_id||rowSelected.name) : undefined;

    return (
      <Toolbar>
        <ToolbarGroup>
          <IconButton
              disabled={!rowSelected}
              onTouchTap={()=>this.handleSystemAction(SYSTEM_ACTIONS.STOP_ALL, processId)}
              tooltip="Stop"
          >
            <AvStop />
          </IconButton>
          <IconButton
              disabled={!rowSelected}
              onTouchTap={()=>this.handleSystemAction(SYSTEM_ACTIONS.RESTART_ALL, processId)}
              tooltip="Restart"
          >
            <AvReplay />
          </IconButton>
          <IconButton
              disabled={!rowSelected}
              onTouchTap={()=>this.handleSystemAction(SYSTEM_ACTIONS.DELETE_ALL, processId)}
              tooltip="Delete"
          >
            <ActionsDelete />
          </IconButton>
          <IconButton
              disabled={!rowSelected}
              onTouchTap={()=>this.handleSystemAction('Logs', processId)}
              tooltip="Logs"
          >
            <InsertDriveFile />
          </IconButton>

          <ToolbarSeparator />

          <RaisedButton
              icon={<NavigationExpandMoreIcon />}
              label="System Actions"
              labelPosition="before"
              onTouchTap={::this.handleTouchTap}
          />
          <Popover
              anchorEl={anchorEl}
              autoCloseWhenOffScreen
              onRequestClose={::this.handleRequestClose}
              open={openMenu}
          >
            <Menu>
              {
                Object.keys(SYSTEM_ACTIONS).map(
                  (actionName,index)=>
                    <MenuItem
                      key={index}
                      primaryText={SYSTEM_ACTIONS[actionName]}
                      onTouchTap={()=>this.handleSystemAction(SYSTEM_ACTIONS[actionName], 'all')}
                    />
                  )
              }
            </Menu>
          </Popover>
        </ToolbarGroup>
        <ToolbarGroup>
          <TextField
              hintText="Search PM2 Processes"
              onChange={(ev, searchText)=>handleSearch(searchText)}
          />
        </ToolbarGroup>

        <Dialog
          title="Choose Log File:"
          actions={actions}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.handleClose}
        >
          <div>
            <div className={classnames(style.dialogroot)}>
              <GridList
               cellHeight={50}
               className={classnames(style.gridlist)}
              >
               {logsDetails.logsPaths.map((logFile,index) => (
                 <GridTile
                   key={index}
                   title={logFile.name}
                   actionIcon={<IconButton
                       onTouchTap={()=>this.showLog(logFile.path, logsDetails.procId, logFile.name)}
                       tooltip="Show Log"
                   >
                     <PageView />
                   </IconButton>}
                 >
                 </GridTile>
               ))}
              </GridList>
            </div>
            <div style={styles.scroll} id="logContent" className={classnames(style.logtext)}>
                {logText.map((text,index)=><div key={index}>{text}</div>)}
            </div>
          </div>
        </Dialog>
      </Toolbar>
    );
  }
}

export default ActionToolbar;
