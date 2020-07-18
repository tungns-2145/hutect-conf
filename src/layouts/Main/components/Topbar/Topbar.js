import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Link, IconButton, Typography} from '@material-ui/core';
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
        {/* <div style ={{ marginRight: '2vw'}}>
          <Typography
            variant="caption"
          >
            <Link
              color={'secondary'}
              component={RouterLink}
              to="/calender"
              variant="h6"
            >
              Calender
            </Link>
          </Typography>
        </div>
        <div>
          <Typography
            variant="caption"
          >
            <Link
              color={'secondary'}
              component={RouterLink}
              to="/calender-public"
              variant="h6"
            >
              Calender public
            </Link>
          </Typography>
          
        </div> */}
        
        <div className={classes.flexGrow} />
        <div>
          <Typography
            variant="caption"
          >
            <Link
              color={'secondary'}
              component={RouterLink}
              to="/sign-in"
              variant="h6"
            >
              Log-in
            </Link>
          </Typography>
          
        </div>
        <RouterLink to="/sign-in" >
          <IconButton
              className={classes.signOutButton}
              color="secondary"
              onClick={onLogOut}
            >
              <InputIcon />
          </IconButton>
        </RouterLink>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
