
import React from 'react';
import * as firebase from 'firebase';
import ChatListComponent from '../chatlist/chatlist';
import ChatViewComponent from '../chatview/chatview';
import ChatboxComponent from '../chatbox/chatbox';
import style from './style';
import { Button, withStyles } from '@material-ui/core';

class DashboardComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedChat: null,
      newChatVisible: false,
      email: null,
      chats: [],
    }
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <ChatListComponent history={this.props.history}
          newChatClickedFn={this.newChatClicked}
          selectChatFn={this.selectChat}
          chats={this.state.chats}
          email={this.state.email}
          selectedChatIndex={this.state.selectedChat}></ChatListComponent>
        {
          this.state.newChatVisible ?
            null :
            <ChatViewComponent
              user={this.state.email}
              chat={this.state.chats[this.state.selectedChat]}></ChatViewComponent>
        }
        {
          this.state.selectedChat !== null && !this.state.newChatVisible ?
            <ChatboxComponent submitMessageFn={this.submitMessage}></ChatboxComponent> :
            null
        }
        <Button onClick={this.signOut} className={classes.signOutBtn}>Sign out</Button>
      </div>
    );
  };

  submitMessage = (msg) => {
    const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(usr => usr !== this.state.email)[0]);
    firebase
      .firestore()
      .collection('chats')
      .doc(docKey)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          sender: this.state.email,
          message: msg,
          timestamp: Date.now(),
        }),
        receiverHasRead: false,
      });
  }

  buildDocKey = (friend) => [this.state.email, friend].sort().join(':');

  signOut = () => firebase.auth().signOut()

  selectChat = async (chatIndex) => {
    await this.setState({ selectedChat: chatIndex });

    this.messageRead();
  };

  messageRead = () => {
    const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(usr => usr !== this.state.email)[0]);

    if (this.notAuthorClicked(this.state.selectedChat)) {
      firebase
        .firestore()
        .collection('chats')
        .doc(docKey)
        .update({ receiverHasRead: true })
    } else {
      console.log('Clicked your own message')
    }
  }

  notAuthorClicked = (chatIndex) => {
    return this.state.chats[chatIndex].messages[this.state.chats[chatIndex].messages.length - 1].sender !== this.state.email;
  };

  newChatClicked = () => {
    this.setState({ newChatVisible: true, selectedChat: null })
  };

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async _usr => {
      if (!_usr) {
        this.props.history.push('/login');
      } else {
        await firebase
          .firestore()
          .collection('chats')
          .where('users', 'array-contains', _usr.email)
          .onSnapshot(async res => {
            const chats = res.docs.map(_doc => _doc.data());
            await this.setState({
              email: _usr.email,
              chats: chats
            });
            console.log(await this.state.chats)
          })
      }
    });
  }
};

export default withStyles(style)(DashboardComponent);