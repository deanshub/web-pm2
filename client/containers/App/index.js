import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import request from 'superagent';

// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'

import Navbar from '../../components/Navbar';
import style from './style.css';

class App extends Component {
  static propTypes = {
    children: PropTypes.object,
    params: PropTypes.object,
  };

  constructor(props){
    super(props);
    this.state = {
      stat:{},
    };
  }

  componentDidMount(){
    this.refreshStats();
  }

  refreshStats(){
    request.get('/api/serverStat')
    .set('Accept', 'application/json')
    .end((err, res)=>{
      console.log(res.body);
      this.setState({
        stat: res.body,
      });
    });
  }
  render() {
    const { children, params } = this.props;
    const { stat } = this.state;
    // TODO: get user name by params.userId

    return (
      <div>
        <Navbar
            refreshStats={::this.refreshStats}
            title={params.userId} 
        />
        <div className={classnames([style.mainsection])}>
          {React.cloneElement(children, { refreshStats: this.refreshStats, stat })}
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
// )(App)
export default App;
