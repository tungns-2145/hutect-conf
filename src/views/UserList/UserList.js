import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Grid
} from '@material-ui/core';
import {  UsersTable } from './components';
import mockData from './data';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const UserList = () => {
  const classes = useStyles();

  const [users] = useState(mockData);
  const [search] = useState('');

  let userList = users
  let user = search.trim().toLowerCase();
  if (user.length > 0) {
    userList = users.filter(val => val.email.toLowerCase().match(user) || val.name.toLowerCase().match(user));
  }
  return (
    <div className={classes.root}>
      <Grid
          item
          lg={4}
          md={6}
          xl={4}
          xs={12}
        >
          {/* <UsersToolbar onChange = {onChange}/> */}
        </Grid>
        <Grid
          item
          lg={8}
          md={6}
          xl={8}
          xs={12}
        >
          <div className={classes.content}>
            <UsersTable 
              users={userList} 
            />
          </div>
        </Grid>
      
    </div>
  );
};

export default UserList;
