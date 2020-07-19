import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Link, IconButton} from '@material-ui/core';
import InputIcon from '@material-ui/icons/Input';
import firebase from '../../../../config'

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  }
}));

const Topbar = props => {
  const { className, onSidebarOpen,history, ...rest } = props;

  const classes = useStyles();

  const onLogOut = () => {
    firebase.auth().signOut().then(function() {
      localStorage.removeItem('uid')
      localStorage.removeItem('email')
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
    // history
  }

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <RouterLink to="/" >

      </RouterLink>
      <Toolbar>
        <IconButton
          className={classes.signOutButton}
          color="inherit"
          >
          <Link
            color={'inherit'}
            component={RouterLink}
            to="/balance"
            variant="h6"
          >
            View balance
          </Link>
        </IconButton>
        <IconButton
            className={classes.signOutButton}
            color="inherit"
          >
          <Link
            color={'inherit'}
            component={RouterLink}
            to="/calender"
            variant="h6"
          >
            View calender
          </Link>
        </IconButton>
        <IconButton
            className={classes.signOutButton}
            color="inherit"
          >
          <Link
            color={'inherit'}
            component={RouterLink}
            to="/signup"
            variant="h6"
          >
            Create payment info
          </Link>
        </IconButton>
        <div className={classes.flexGrow} />
        <IconButton
            className={classes.signOutButton}
            color="inherit"
          >
          <Link
            color={'inherit'}
            component={RouterLink}
            to="/signin"
            variant="h6"
          >
            Log in
          </Link>
        </IconButton>
        <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick={onLogOut}
          >
            <Link
              color={'inherit'}
              component={RouterLink}
              to="/signin"
              variant="h6"
            >
            <InputIcon />
            </Link>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
