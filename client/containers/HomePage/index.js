import React, { Component, PropTypes } from 'react';
import { Paper } from 'material-ui';
import { MuiThemeProvider, getMuiTheme, colors } from 'material-ui/styles';
import classnames from 'classnames';

import GeneralInfo from '../../components/GeneralInfo';
import ActionToolbar from '../../components/ActionToolbar';
import ProcessTable from '../../components/ProcessTable';

import style from './style.css';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: colors.amber500,
    canvasColor: colors.white,
    textColor: colors.fullBlack,
    alternateTextColor: colors.amberA200,
  },
});

class HomePage extends Component {
  static propTypes = {
    refreshStats: PropTypes.func,
    stat: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleRowSelection(selectedRows) {
    this.setState({
      rowSelected: selectedRows,
    });
  }

  handleSearch(searchText) {
    this.setState({
      searchText,
    });
  }

  render() {
    const { rowSelected, searchText } = this.state;
    const { stat, refreshStats } = this.props;

    return (
      <div>
        <MuiThemeProvider muiTheme={muiTheme}>
          <Paper className={classnames(style.details)}>
            <GeneralInfo {...stat} />
          </Paper>
        </MuiThemeProvider>
        <MuiThemeProvider muiTheme={muiTheme}>
          <Paper className={classnames(style.chartItem)}>
            <ActionToolbar
              handleSearch={::this.handleSearch}
              refreshStats={refreshStats}
              rowSelected={rowSelected}
            />
            <ProcessTable
              onRowSelection={::this.handleRowSelection}
              selectedRow={rowSelected}
              searchText={searchText}
              {...stat}
            />
          </Paper>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default HomePage;
