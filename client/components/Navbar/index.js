import React, { Component, PropTypes } from 'react';
import { AppBar, IconButton } from 'material-ui';
import { MuiThemeProvider, getMuiTheme, colors } from 'material-ui/styles';
import Refresh from 'material-ui/svg-icons/navigation/refresh';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: colors.amberA200,
    canvasColor: colors.darkBlack,
    textColor: colors.white,
    alternateTextColor: colors.fullBlack,
  },
});

class Navbar extends Component {
  static propTypes = {
    refreshStats: PropTypes.func,
    title: PropTypes.string,
  };
  static defaultProps = {
    title: 'Sisense Process Monitor',
  };

  render() {
    const { title, refreshStats } = this.props;
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <AppBar
            iconElementRight={
              <IconButton
                  onTouchTap={refreshStats}
                  tooltip="Refresh"
              >
                <Refresh/>
              </IconButton>
            }
            title={title}
        />
      </MuiThemeProvider>
    );
  }
}

export default Navbar;
