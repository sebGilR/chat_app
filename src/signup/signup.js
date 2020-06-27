import style from './style';
import React from 'react';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import * as firebase from 'firebase';

class SignupComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      email: null,
      password: null,
      passwordConfirm: null,
      signupError: '',
    }
  }

  render() {
    const { classes } = this.props
    return (
      <main className={classes.main}>
        <CssBaseline></CssBaseline>
        <Paper className={classes.paper}>
          <Typography component='h1' variant='h5'>
            Sign up
          </Typography>
          <form onSubmit={(e) => this.submitSignup(e)} className={classes.form}>
            <FormControl required fullWidth margin='normal'>
              <InputLabel htmlFor='signup-email-input'>Enter your email</InputLabel>
              <Input autoComplete='email' autoFocus id='signup-email-input' onChange={(e) => this.typing('email', e)}></Input>
            </FormControl>
            <FormControl required fullWidth margin='normal'>
              <InputLabel htmlFor='signup-password'>Create a password</InputLabel>
              <Input type='password' id='signup-password' onChange={(e) => this.typing('password', e)}></Input>
            </FormControl>
            <FormControl required fullWidth margin='normal'>
              <InputLabel htmlFor='signup-password-confirm'>Confirm your password</InputLabel>
              <Input type='password' id='signup-password-confirm' onChange={(e) => this.typing('passwordConfirm', e)}></Input>
            </FormControl>
            <Button type='submit' className={classes.submit} fullWidth variant='contained' color='primary'>Sign Up</Button>
          </form>
          {
            this.state.signupError ?
              <Typography className={classes.errorText} component='h5' variant='h6'>
                {this.state.signupError}
              </Typography> :
              null
          }
          <Typography className={classes.hasAccountHeader} component='h5' variant='h6'>Already haven an account?</Typography>
          <Link className={classes.logInLink} to='/login'>Log in</Link>
        </Paper>
      </main>
    );
  };

  formValid = () => this.state.password === this.state.passwordConfirm;

  typing = (type, e) => {
    switch (type) {
      case 'email':
        this.setState({ email: e.target.value });
        break;
      case 'password':
        this.setState({ password: e.target.value });
        break;
      case 'passwordConfirm':
        this.setState({ passwordConfirm: e.target.value });
        break;
      default:
        break;
    }
  };

  submitSignup = (e) => {
    e.preventDefault();
    if (!this.formValid()) {
      this.setState({ signupError: 'Passwords do not match' });
      return
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(response => {
        const userObj = {
          email: response.user.email
        }

        firebase
          .firestore()
          .collection('users')
          .doc(this.state.email)
          .set(userObj)
          .then(() => {
            this.props.history.push('/dashboard')
          }, dbError => {
            console.log(dbError);
            this.setState({ signupError: 'Failed to save user' })
          })
      }, authError => {
        console.log(authError);
        this.setState({ signupError: 'Failed to save user' })
      })
  }
};

export default withStyles(style)(SignupComponent);