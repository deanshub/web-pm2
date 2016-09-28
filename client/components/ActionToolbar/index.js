import React, { Component, PropTypes } from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import { TextField, RaisedButton, MenuItem } from 'material-ui';
import { Popover, Menu, IconButton } from 'material-ui';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import AvStop from 'material-ui/svg-icons/av/stop';
import AvReplay from 'material-ui/svg-icons/av/replay';
import ActionsDelete from 'material-ui/svg-icons/action/delete';
import InsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';
import request from 'superagent';
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
    this.state = {
      openMenu: false,
    };
  }

  handleTouchTap(event){
    event.preventDefault();
    this.setState({
      anchorEl:event.currentTarget,
      openMenu: true,
    });
  }

  handleRequestClose(){
    this.setState({
      openMenu: false,
    });
  }

  handleSystemAction(action, id){
    console.log('id',id);
    let url;
    if (action===SYSTEM_ACTIONS.RESTART_ALL){
      url = `/api/operations/restart/${id}`;
    }else if (action===SYSTEM_ACTIONS.STOP_ALL){
      url = `/api/operations/stop/${id}`;
    }else if (action===SYSTEM_ACTIONS.DELETE_ALL){
      url = `/api/operations/delete/${id}`;
    }else if (action===SYSTEM_ACTIONS.KILL_PM2){
      url = '/api/operations/kill';
    }

    if (url){
      request.get(url)
      .end(()=>{
        setTimeout(this.props.refreshStats);
      });
    }
  }

  render() {
    const { rowSelected, handleSearch } = this.props;
    const { openMenu, anchorEl } = this.state;

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
      </Toolbar>
    );
  }
}


// function mapStateToProps(state) {
//   return {
//     ...state.routing.locationBeforeTransitions.state,
//   }
// }
//
// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators(TodoActions, dispatch),
//   }
// }
//
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(HistoryGraph)
export default ActionToolbar;
