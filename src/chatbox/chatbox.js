import React from 'react';
import style from './style';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Send from '@material-ui/icons/Send';

class ChatboxComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      chatText: '',
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.chatTextBoxContainer}>
        <TextField placeholder='Write a message...'
          onKeyUp={(e) => this.typing(e)}
          id='chatBox'
          className={classes.chatTextBox}
          onFocus={this.userFocused}></TextField>
        <Send onClick={this.submitMessage} className={classes.sendBtn}></Send>
      </div>
    );
  };

  typing = (e) => {
    e.keyCode === 13 ?
      this.submitMessage() :
      this.setState({ chatText: e.target.value });
  };

  messageValid = (text) => text && text.replace(/\s/g, '').length

  userFocused = () => {
    this.props.messageReadFn();
  }

  submitMessage = () => {
    if (this.messageValid(this.state.chatText)) {
      this.props.submitMessageFn(this.state.chatText);
      document.getElementById('chatBox').value = '';
    }
  }
};

export default withStyles(style)(ChatboxComponent);