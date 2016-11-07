import React, { Component, PropTypes } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import classnames from 'classnames';

import dateFilter from '../../utils/dateFilter';
import style from './style.css';

class ProcessTable extends Component {
  static propTypes = {
    onRowSelection: PropTypes.func,
    processes: PropTypes.array,
    searchText: PropTypes.string,
    selectedRow: PropTypes.object,
  }

  static defaultProps={
    processes:[],
    searchText:'',
  }

  constructor(props){
    super(props);
    this.state = {
      openMenu: false,
    };
  }

  handleOpenMenu = () => {
    this.setState({
      openMenu: true,
    });
  }

  render() {
    const { processes, searchText, selectedRow, onRowSelection } = this.props;

    return (
      <Table onRowSelection={(rowIndex)=>{onRowSelection(processes[rowIndex]);}}>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>PM2 ID</TableHeaderColumn>
            <TableHeaderColumn>App Name</TableHeaderColumn>
            <TableHeaderColumn>Mode</TableHeaderColumn>
            <TableHeaderColumn>pid</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
            <TableHeaderColumn>Uptime</TableHeaderColumn>
            <TableHeaderColumn>Restarts</TableHeaderColumn>
            <TableHeaderColumn>Unstable Restarts</TableHeaderColumn>
            <TableHeaderColumn>Created On</TableHeaderColumn>
            <TableHeaderColumn>Memory</TableHeaderColumn>
            <TableHeaderColumn>CPU</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody showRowHover>
          {
            processes
            .filter((process)=>process.name.includes(searchText)||process.pm_id.toString().includes(searchText))
            .map(process=>{
              const statusClass = classnames({
                [style.online]:process.pm2_env.status==='online',
                [style.notonline]:process.pm2_env.status!=='online',
                [style.capitalize]:true,
              });
              return (
                <TableRow
                    key={process.name}
                    selected={process===selectedRow}
                >
                  <TableRowColumn>{process.pm_id}</TableRowColumn>
                  <TableRowColumn>{process.name}</TableRowColumn>
                  <TableRowColumn>{process.pm2_env.exec_mode}</TableRowColumn>
                  <TableRowColumn>{process.pid}</TableRowColumn>
                  <TableRowColumn className={statusClass}>{process.pm2_env.status}</TableRowColumn>
                  <TableRowColumn>{dateFilter(process.pm2_env.pm_uptime - process.pm2_env.created_at,'HH:mm:ss')}</TableRowColumn>
                  <TableRowColumn>{process.pm2_env.restart_time}</TableRowColumn>
                  <TableRowColumn>{process.pm2_env.unstable_restarts}</TableRowColumn>
                  <TableRowColumn>{dateFilter(process.pm2_env.created_at, 'YYYY-MM-D HH:mm:ss')}</TableRowColumn>
                  <TableRowColumn>{process.monit.memory}</TableRowColumn>
                  <TableRowColumn>{process.monit.cpu}</TableRowColumn>
                </TableRow>
              );
            })
          }
        </TableBody>
      </Table>
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
export default ProcessTable;
