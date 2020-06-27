import React from 'react';
import firebase from 'firebase';
import { FormControl, InputLabel, Input, Button, Paper, withStyles, CssBaseline, Typography } from '@material-ui/core';
import style from './style';

class NewChatComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null,
      message: null
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline></CssBaseline>
        <Paper className={classes.paper}>
          <Typography component='h1' variant='h5'>Send a message</Typography>
          <form className={classes.form} onSubmit={(e) => this.submitNewChat(e)}>
            <FormControl fullWidth>
              <InputLabel htmlFor='new-chat-user'>
                Enter your friend's email
              </InputLabel>
              <Input required
                className={classes.input}
                autoFocus
                onChange={(e) => this.typing('user', e)}
                id='new-chat-user'></Input>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor='new-chat-message'>Enter your message</InputLabel>
              <Input required
                className={classes.input}
                onChange={(e) => this.typing('message', e)}
                id='new-chat-message'></Input>
            </FormControl>
            <Button fullWidth className={classes.submit} variant='contained' color='primary' type='submit'>Submit</Button>
          </form>
        </Paper>
      </main>
    );
  };

  typing = (type, e) => {
    switch (type) {
      case 'user':
        this.setState({ user: e.target.value });
        break;
      case 'message':
        this.setState({ message: e.target.value });
        break;
      default:
        break;
    }
  }

  submitNewChat = async (e) => {
    e.preventDefault();
    const userExists = await this.userExists();
    if (userExists) {
      const chatExists = await this.chatExists();
      console.log(chatExists)
      chatExists ? this.goToChat() : this.createChat()
    } else {
      console.log('not returning')
    }
  }

  createChat = () => {
    this.props.newChatSubmitFn({
      sendTo: this.state.user,
      message: this.state.message
    });
  }

  goToChat = () => this.props.goToChatFn(this.buildDocKey(), this.state.message);

  userExists = async () => {
    const usersSnapshot = await firebase
      .firestore()
      .collection('users')
      .get();

    const exists = usersSnapshot.docs
      .map(doc => doc.data().email)
      .includes(this.state.user);

    // this.setState({ serverError: !exists })

    return exists
  };

  buildDocKey = () => {
    return [firebase.auth().currentUser.email, this.state.user].sort().join(':');
  }

  chatExists = async () => {
    const docKey = this.buildDocKey();
    const chat = await firebase
      .firestore()
      .collection('chats')
      .doc(docKey)
      .get();

    console.log(chat.exists);
    return chat.exists;
  }
}

export default withStyles(style)(NewChatComponent)