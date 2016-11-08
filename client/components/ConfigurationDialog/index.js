import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import classnames from 'classnames';
import style from './style.css';

export default class LogDialog extends Component {
  static propTypes={
    configurationDialogOpen: PropTypes.bool,
    handleClose: PropTypes.func,
    configurationDetails: PropTypes.object,
    processId: PropTypes.string,
    setConfiguration: PropTypes.func,
  }
  static defaultProps={
    configurationDialogOpen: false,
  };

  constructor(props){
    super(props);
    this.configurationDetails={};
  }

  prepareForm(configurationDetails){
    let textFileds = [];
    if (configurationDetails){
      for (let prop in configurationDetails) {
        textFileds.push(
          <TextField
              defaultValue={configurationDetails[prop]}
              floatingLabelText={prop}
              fullWidth
              key={prop}
              multiLine
              onChange={(event)=>{
                this.configurationDetails[prop] = event.target.value;
              }}
          />
        );
      }
    }
    return textFileds;
  }

  render(){
    const {configurationDialogOpen, handleClose, configurationDetails, processId, setConfiguration} = this.props;
    const actions = [
      <FlatButton
          label="Update & Don't Restart"
          onTouchTap={()=>setConfiguration(processId, this.configurationDetails)}
      />,
      <FlatButton
          label="Cancel"
          onTouchTap={handleClose}
          primary
      />,
    ];

    return (
      <Dialog
          actions={actions}
          autoScrollBodyContent
          className={classnames(style.dialogWrapper)}
          contentStyle={{width: '70vw', maxWidth:'none'}}
          modal={false}
          onRequestClose={handleClose}
          open={configurationDialogOpen}
          title={`Configure - ${processId}`}
      >
        <div className={classnames(style.dialogRoot)}>
          {this.prepareForm(configurationDetails)}
        </div>
      </Dialog>
    );
  }
}
