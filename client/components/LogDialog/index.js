import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import { List, ListItem } from 'material-ui/List';
import InsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';
import FlatButton from 'material-ui/FlatButton';
import classnames from 'classnames';
import style from './style.css';

export default class LogDialog extends Component {
  static propTypes = {
    logDialogOpen: PropTypes.bool,
    handleClose: PropTypes.func,
    logName: PropTypes.string,
    logText: PropTypes.array,
    logsDetails: PropTypes.object,
    processId: PropTypes.string,
    showLog: PropTypes.func,
  };
  static defaultProps = {
    logText: [],
    logName: '',
    processId: '',
    logsDetails: {
      logsPaths: [],
    },
  };

  render() {
    const {
      logDialogOpen,
      handleClose,
      showLog,
      logsDetails,
      logText,
      logName,
      processId,
    } = this.props;
    const actions = [
      <FlatButton label="Cancel" onTouchTap={handleClose} primary />,
    ];

    return (
      <Dialog
        title={
          logName != '' ? `Logs - Process:"${processId}" Log:"${logName}"` : ''
        }
        actions={actions}
        contentStyle={{ width: '70vw', maxWidth: 'none' }}
        modal={false}
        onRequestClose={handleClose}
        open={logDialogOpen}
      >
        <div className={classnames(style.dialogRoot)}>
          <List>
            {logsDetails.logsPaths.map((logFile) => (
              <ListItem
                style={
                  logName === logFile.name
                    ? { color: '#fff', backgroundColor: '#000' }
                    : {}
                }
                key={logFile.name}
                leftIcon={<InsertDriveFile />}
                onTouchTap={() =>
                  showLog(logFile.path, logsDetails.procId, logFile.name)
                }
                primaryText={logFile.name}
              />
            ))}
          </List>
          <div
            className={classnames(style.logtext, style.scroll)}
            id="logContent"
          >
            {logText.map((text, index) => (
              <div key={index}>{text}</div>
            ))}
          </div>
        </div>
      </Dialog>
    );
  }
}
