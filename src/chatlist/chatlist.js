import React from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import NotificationImportant from '@material-ui/icons/NotificationImportant';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import style from './style';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

class ChatListComponent extends React.Component {
  constructor() {
    super();

    this.state = {

    }
  }

  render() {
    const { classes } = this.props;

    if (this.props.chats.length > 0) {
      return (
        <div className={classes.root}>
          <Button variant='contained' fullWidth color='primary' onClick={this.newChat} className={classes.newChatBtn}>
            New message
          </Button>
          <List>
            {
              this.props.chats.map((chat, index) => {
                return (
                  <div key={index}>
                    <ListItem onClick={() => this.selectChat(index)}
                      className={classes.listItem}
                      selected={this.props.selectedChatIndex === index}
                      alignItems='flex-start'>
                      <ListItemAvatar>
                        <Avatar alt='Remy Sharp'>
                          {
                            chat.users.filter(user => user !== this.props.email)[0].split('')[0]
                          }
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={chat.users.filter(user => user !== this.props.email)[0]}
                        secondary={
                          <React.Fragment>
                            <Typography component='span' color='textPrimary'>
                              {chat.messages[chat.messages.length - 1].message.substring(0, 30)}
                            </Typography>
                          </React.Fragment>
                        }>

                      </ListItemText>
                      {
                        chat.receiverHasRead === false && !this.userSent(chat) ?
                          <ListItemIcon>
                            <NotificationImportant className={classes.unreadMessage}></NotificationImportant>
                          </ListItemIcon> :
                          null
                      }
                    </ListItem>
                    <Divider></Divider>
                  </div>
                );
              })
            }
          </List>
        </div>
      );
    } else {
      return (
        <div className={classes.root}>
          <Button variant='contained' fullWidth onClick={this.newChat} className={classes.newChatBtn} color='primary'>
            New message
        </Button>
          <List></List>
        </div>
      );
    };
  };

  userSent = (chat) => {
    return chat.messages[chat.messages.length - 1].sender === this.props.email;
  }

  newChat = () => {
    this.props.newChatClickedFn();
  }

  selectChat = (index) => {
    this.props.selectChatFn(index)
  }
}

export default withStyles(style)(ChatListComponent)
