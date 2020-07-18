import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Divider,
  LinearProgress
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  }
}));

const AccountProfile = props => {
  const { userInfo, className, ...rest } = props;

  const classes = useStyles();

  const userDefault = {
    name: 'Name',
    city: 'Hà Nội',
    country: 'Việt Nam',
    timezone: 'GTM-7',
    avatar: '/images/avatars/default.jpg',
    balance: 0,
    payment_code: ''
  };

  const [user] = useState(userInfo || userDefault);

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div className={classes.details}>
          <div>
            <Typography
              gutterBottom
              variant="h2"
            >
              {user.name}
            </Typography>
            <Typography
              className={classes.locationText}
              color="textSecondary"
              variant="body1"
            >
              {user.city}, {user.country}
            </Typography>
            <Typography
              className={classes.dateText}
              color="textSecondary"
              variant="body1"
            >
              {moment().format('hh:mm A')} ({user.timezone})
            </Typography>
          </div>
          <Avatar
            className={classes.avatar}
            src={user.avatar}
          />
        </div>
        <div className={classes.progress}>
          <Typography variant="body1">Payment code: {user.payment_code}</Typography>
          <Typography variant="body1">Balance: {user.balance}</Typography>
          <LinearProgress
            value={100}
            variant="determinate"
          />
        </div>
      </CardContent>
      <Divider />
    </Card>
  );
};

AccountProfile.propTypes = {
  className: PropTypes.string
};

export default AccountProfile;
