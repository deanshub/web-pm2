import React, { Component, PropTypes } from 'react';
import {List, ListItem} from 'material-ui/List';
import AccessTime from 'material-ui/svg-icons/device/access-time';
import Title from 'material-ui/svg-icons/editor/title';
import classnames from 'classnames';
import { Line as LineChart } from 'react-chartjs';
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

  constructor(props){
    super(props);
    this.state = {
      memData:{
        labels:[],
        datasets:[{
          label: 'Used Memory',
          data: [],
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          pointBackgroundColor: 'rgb(67, 160, 71)',
          pointHoverBackgroundColor: 'rgb(229, 57, 53)',
          pointHoverBorderColor: 'rgb(67, 160, 71)',
          pointStrokeColor: 'rgb(229, 57, 53)',
          pointBorderColor: 'rgb(67, 160, 71)',
        }],
      },
      cpuData:  {
        labels: [],
        datasets: [],
      },
    };
  }

  render() {
    const { system_info, monit } = this.props;
    let {memData, cpuData} = this.state;

    memData.labels.push((new Date()).toLocaleString());
    memData.datasets[0].data.push(Math.round((monit.total_mem - monit.free_mem)/1024/1024));

    cpuData.labels.push((new Date()).toLocaleString());
    if (monit.cpu){
      let totalCpuCapacity = monit.cpu.reduce((total, cpu)=>
        total + cpu.times.user + cpu.times.nice + cpu.times.sys +
        cpu.times.irq + cpu.times.idle, 0);
      monit.cpu.forEach((cpu, index)=>{
        if (!cpuData.datasets[index]){
          cpuData.datasets[index]={data:[], label:`CPU${index+1}`};
        }

        let cpuUsage = cpu.times.idle;
        cpuData.datasets[index].data.push(cpuUsage / totalCpuCapacity * 100);
      });
    }

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
          <LineChart
              data={cpuData}
              options={{scales:{yAxes:[{stacked:true}]}}}
          />
        </div>
        <div style={{flex:2,width:'30%',margin:'25px 0'}}>
          <LineChart data={memData} />
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
