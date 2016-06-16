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


const sytemActions = [
  'Start/Restart All',
  'Stop All',
  'Delete All',
  'Kill PM2',
];
// import classnames from 'classnames';
// import {Line as LineChart} from 'react-chartjs';
// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'

// Chart.defaults.global.responsive = true

class ActionToolbar extends Component {
  static propTypes = {
    refreshStats: PropTypes.func,
    handleSearch: PropTypes.func,
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
    let url;
    if (action===sytemActions[0]){
      url = `/api/operations/restart/${id}`;
    }else if (action===sytemActions[1]){
      url = `/api/operations/stop/${id}`;
    }else if (action===sytemActions[2]){
      url = `/api/operations/delete/${id}`;
    }else if (action===sytemActions[3]){
      url = '/api/operations/kill';
    }

    if (url){
      request.get(url)
      .end(()=>{
        this.props.refreshStats();
      });
    }
  }

  render() {
    const { rowSelected, refreshStats, handleSearch } = this.props;
    const { openMenu, anchorEl } = this.state;

    return (
      <Toolbar>
        <ToolbarGroup>
          <IconButton
              disabled={!rowSelected}
              onTouchTap={()=>this.handleSystemAction(sytemActions[1], rowSelected.pm_id)}
              tooltip="Stop"
          >
            <AvStop />
          </IconButton>
          <IconButton
              disabled={!rowSelected}
              onTouchTap={()=>this.handleSystemAction(sytemActions[0], rowSelected.pm_id)}
              tooltip="Restart"
          >
            <AvReplay />
          </IconButton>
          <IconButton
              disabled={!rowSelected}
              onTouchTap={()=>this.handleSystemAction(sytemActions[2], rowSelected.pm_id)}
              tooltip="Delete"
          >
            <ActionsDelete />
          </IconButton>
          <IconButton
              disabled={!rowSelected}
              onTouchTap={()=>this.handleSystemAction('Logs', rowSelected.pm_id)}
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
                sytemActions.map((action,index)=><MenuItem key={index} primaryText={action} onTouchTap={()=>this.handleSystemAction(action, 'all')} />)
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
