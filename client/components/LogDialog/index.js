import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import {GridList, GridTile} from 'material-ui/GridList';
import PageView from 'material-ui/svg-icons/action/pageview';
import { IconButton } from 'material-ui';
import FlatButton from 'material-ui/FlatButton';
import classnames from 'classnames';
import style from './style.css';

export default class LogDialog extends Component {
  render(){
    const {dialogOpen, handleClose, showLog, logsDetails, logText} = this.props
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={handleClose}
      />
    ];

    return (
      <Dialog
        title="Choose Log File:"
        actions={actions}
        modal={false}
        open={dialogOpen}
        onRequestClose={handleClose}
      >
        <div>
          <div className={classnames(style.dialogroot)}>
            <GridList
              cellHeight={50}
              className={classnames(style.gridlist)}
            >
            {logsDetails.logsPaths.map((logFile,index) => (
              <GridTile
                key={index}
                title={logFile.name}
                actionIcon={
                  <IconButton
                    onTouchTap={()=>showLog(logFile.path, logsDetails.procId, logFile.name)}
                    tooltip="Show Log"
                  >
                    <PageView />
                  </IconButton>
                }
              />
              ))}
            </GridList>
          </div>
          <div id="logContent" className={classnames(style.logtext, style.scroll)}>
            {logText.map((text,index)=><div key={index}>{text}</div>)}
          </div>
        </div>
      </Dialog>
    );
  }
}
