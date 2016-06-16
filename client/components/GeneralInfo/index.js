import React, { Component, PropTypes } from 'react';
import {List, ListItem} from 'material-ui/List';
import AccessTime from 'material-ui/svg-icons/device/access-time';
import Title from 'material-ui/svg-icons/editor/title';
import classnames from 'classnames';
import { Pie as PieChart } from 'react-chartjs';
// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'

import style from './style.css';
import durationFilter from '../../utils/durationFilter';

class HistoryGraph extends Component {
  static propTypes = {
    system_info: PropTypes.object,
    monit: PropTypes.object,
  }

  static defaultProps={
    system_info:{},
    monit:{},
  }

  render() {
    const { system_info, monit } = this.props;
    const memData = {
      labels:['Used','Free'],
      datasets:[
        {
          data:[Math.round(monit.free_mem/1024/1024), Math.round((monit.total_mem-monit.free_mem)/1024/1024)],
          backgroundColor:['#F7464A','#46BFBD'],
          hoverBackgroundColor:['#FF5A5E','#5AD3D1'],
        },
      ],
    };
    const cpuData = {
      labels:monit.cpu?monit.cpu.map((cpu,index)=>`CPU${index+1}`).concat(['Idle']):['Used','Idle'],
      datasets:[
        {
          data: monit.cpu?monit.cpu.map((cpu)=>cpu.times.user+cpu.times.nice+cpu.times.sys+cpu.times.irq).concat([monit.cpu.reduce((totalIdle,cpu)=>totalIdle+cpu.times.idle,0)]):[0,100],
          backgroundColor:(monit.cpu?monit.cpu.map(()=>'#F7464A'):['#F7464A']).concat(['#46BFBD']),
          hoverBackgroundColor:(monit.cpu?monit.cpu.map(()=>'#FF5A5E'):['#FF5A5E']).concat(['#5AD3D1']),
        },
      ],
    };
    return (
      <div className={classnames(style.container)}>
        <List style={{flex:1}}>
          <ListItem
              leftIcon={<Title/>}
              primaryText={`Host Name: ${system_info.hostName}`}
          />
          <ListItem
              leftIcon={<AccessTime/>}
              primaryText={`Up Time: ${durationFilter(system_info.uptime,'dd \'days\', hh \'hours\', mm \'minutes\'')}`}
          />
        </List>
        <div style={{flex:2,width:'30%',margin:'25px 0'}}>
          <PieChart data={cpuData} />
        </div>
        <div style={{flex:2,width:'30%',margin:'25px 0'}}>
          <PieChart data={memData} />
        </div>
      </div>
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
export default HistoryGraph;
