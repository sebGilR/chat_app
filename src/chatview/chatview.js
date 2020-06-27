import React from 'react';
import style from './style';
import { withStyles } from '@material-ui/core/styles';

class ChatViewComponent extends React.Component {
  componentDidUpdate = () => {
    const container = document.getElementById('chatview-container');

    if (container) {
      container.scrollTo(0, container.scrollHeight)
    }
  }

  render() {
    const { classes, chat, user } = this.props

    if (chat === undefined) {
      return (<main id='chatview-container' className={classes.content}></main>);
    } else {
      return (
        <div>
          <div className={classes.chatHeader}>
            Chat with {chat.users.filter(friend => friend !== user)[0]}
          </div>
          <main id='chatview-container' className={classes.content}>
            {
              chat.messages.map((msg, index) => {
                return (
                  <div key={index} className={msg.sender === user ? classes.userSent : classes.friendSent}>
                    {msg.message}
                  </div>
                );
              })
            }
          </main>
        </div>
      );
    }
  }
}

export default withStyles(style)(ChatViewComponent)