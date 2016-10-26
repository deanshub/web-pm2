import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import {List, ListItem} from 'material-ui/List';
import PageView from 'material-ui/svg-icons/action/pageview';
import FlatButton from 'material-ui/FlatButton';
import classnames from 'classnames';
import style from './style.css';

export default class LogDialog extends Component {
  static propTypes={
    dialogOpen: PropTypes.bool,
    handleClose: PropTypes.func,
    logText: PropTypes.array,
    logsDetails: PropTypes.object,
    showLog: PropTypes.func,
  }
  static defaultProps={
    logText: [],
  };

  render(){
    const {dialogOpen, handleClose, showLog, logsDetails, logText} = this.props;
    const actions = [
      <FlatButton
          label="Cancel"
          onTouchTap={handleClose}
          primary
      />,
    ];

    return (
      <Dialog
          actions={actions}
          contentStyle={{width: '70vw', maxWidth:'none'}}
          modal={false}
          onRequestClose={handleClose}
          open={dialogOpen}
      >
        <div className={classnames(style.dialogRoot)}>
          <List>
            {
              logsDetails.logsPaths.map(logFile =>
                <ListItem
                    key={logFile.name}
                    leftIcon={<PageView />}
                    onTouchTap={()=>showLog(logFile.path, logsDetails.procId, logFile.name)}
                    primaryText={logFile.name}
                />
              )
            }
          </List>
          <div
              className={classnames(style.logtext, style.scroll)}
              id="logContent"
          >
            {logText.map((text,index)=><div key={index}>{text}</div>)}
          </div>
        </div>
      </Dialog>
    );
  }
}
