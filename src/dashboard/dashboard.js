
import React from 'react';
import * as firebase from 'firebase';
import ChatListComponent from '../chatlist/chatlist';

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
    return (
      <div>
        <ChatListComponent history={this.props.history}
          newChatClickedFn={this.newChatClicked}
          selectChatFn={this.selectChat}
          chats={this.state.chats}
          email={this.state.email}
          selectedChatIndex={this.state.selectedChat}></ChatListComponent>
      </div>
    );
  };

  selectChat = (chatIndex) => {
    console.log('Chat selected', chatIndex);
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

export default DashboardComponent;