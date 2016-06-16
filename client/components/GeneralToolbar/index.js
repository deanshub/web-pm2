import React, { Component, PropTypes } from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import { TextField, IconMenu, RaisedButton, MenuItem } from 'material-ui';
import { IconButton } from 'material-ui';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import AvStop from 'material-ui/svg-icons/av/stop';
import AvPlay from 'material-ui/svg-icons/av/play-arrow';
import AvReplay from 'material-ui/svg-icons/av/replay';
import ActionsDelete from 'material-ui/svg-icons/action/delete';
import FormatAlignJustify from 'material-ui/svg-icons/editor/format-align-justify';

// import classnames from 'classnames';
// import {Line as LineChart} from 'react-chartjs';
// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'

// Chart.defaults.global.responsive = true

class GeneralToolbar extends Component {
  static propTypes = {
    rowSelected: PropTypes.bool,
  }

  static defaultProps={
    rowSelected: false,
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
    const { rowSelected } = this.props;

    return (
      <Toolbar>
        <ToolbarGroup>
          <ToolbarTitle text="Search" />
          <TextField hintText="Search Pattern" />
        </ToolbarGroup>
        <ToolbarGroup >
          <IconButton
              disabled={!rowSelected}
              tooltip="Stop"
          >
            <AvStop />
          </IconButton>
          <IconButton
              disabled={!rowSelected}
              tooltip="Restart"
          >
            <AvReplay />
          </IconButton>
          <IconButton
              disabled={!rowSelected}
              tooltip="Delete"
          >
            <ActionsDelete />
          </IconButton>
          <IconButton
              disabled={!rowSelected}
              tooltip="Logs"
          >
            <FormatAlignJustify />
          </IconButton>
          <ToolbarSeparator />
          <IconMenu
              iconButtonElement={
                <RaisedButton
                    icon={<NavigationExpandMoreIcon />}
                    label="Actions"
                    labelPosition="before"
                    onTouchTap={this.handleOpenMenu}
                    primary
                />
              }
              open={this.state.openMenu}
          >
            <MenuItem primaryText="Start/Restart All" />
            <MenuItem primaryText="Stop All" />
            <MenuItem primaryText="Delete All" />
            <MenuItem primaryText="Devider" />
            <MenuItem primaryText="Kill PM2" />
          </IconMenu>
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
export default GeneralToolbar;
