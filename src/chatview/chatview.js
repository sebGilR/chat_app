import React from 'react';
import style from './style';
import { withStyles } from '@material-ui/core/styles';

class ChatViewComponent extends React.Component {

  render() {
    const { classes, chat, user } = this.props

    if (chat === undefined) {
      return (<main className={classes.content}></main>);
    } else {
      return (
        <div>
          <div></div>
          <main className={classes.content}>
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