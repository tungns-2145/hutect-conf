import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  TextField,
  FormHelperText,
  Typography
} from '@material-ui/core';
import {db} from '../../config'

const schema = {
  name: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  paymentCode: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  role: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 64
    }
  },
  balance: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  },
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 800,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  signUpButton: {
    margin: theme.spacing(2, 0)
  }
}));

const SignUp = props => {
  // const { history } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    console.log(event.target.value)
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  getPaymentInfo = async (paymentCode) => {
    const paymentInfo = await db.collection('payment-info')
    .where('payment_code', '==', paymentCode)
    .get()
    return paymentInfo.docs.map(info => ({...info.data(), id: info.id}))
  }

  const handleSignUp = async event => {
    const { role, balance, name, paymentCode } = formState.values
    console.log( role, balance )
    event.preventDefault();
    const uid = localStorage.getItem('uid')
    if(uid) {
      const paymentInfo = await getPaymentInfo(paymentCode)
      if (paymentInfo.length === 0) {
        db.collection("payment-info").add({
          name: name,
          role,
          payment_code: paymentCode,
          balance
        }).then(()=>{
          setFormState(formState => ({
            ...formState,
            values: {}
          }));
          alert('create success')
        })
      }else{
        alert('payment code is exist')
      }
      
    }else {
      alert('need login')
    }
  };

  const states = [
    {
      value: '',
      label: ''
    },
    {
      value: 'teacher',
      label: 'Teacher'
    },
    {
      value: 'student',
      label: 'Student'
    },
  ];


  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
      <Grid
        className={classes.grid}
        container
      >
        <Grid
          className={classes.quoteContainer}
          item
          lg={2}
        >
        </Grid>
        <Grid
          className={classes.content}
          item
          lg={8}
          xs={12}
        >
          <div className={classes.content}>
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                onSubmit={handleSignUp}
              >
                <Typography
                  className={classes.title}
                  variant="h2"
                >
                  Create payment info
                </Typography>
                <Typography
                  color="textSecondary"
                  gutterBottom
                >
                  Create payment info for teacher or student
                </Typography>
                <TextField
                  className={classes.textField}
                  error={hasError('name')}
                  fullWidth
                  helperText={
                    hasError('name') ? formState.errors.name[0] : null
                  }
                  label="Name"
                  name="name"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.name || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('paymentCode')}
                  fullWidth
                  helperText={
                    hasError('paymentCode') ? formState.errors.paymentCode[0] : null
                  }
                  label="Payment code"
                  name="paymentCode"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.paymentCode || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  fullWidth
                  helperText={
                    hasError('role') ? formState.errors.role[0] : null
                  }
                  error={hasError('role')}
                  label="Select role"
                  name="role"
                  onChange={handleChange}
                  required
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={formState.values.state}
                  variant="outlined"
                >
                  {states.map(option => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
                <TextField
                  className={classes.textField}
                  error={hasError('balance')}
                  fullWidth
                  helperText={
                    hasError('balance') ? formState.errors.balance[0] : null
                  }
                  label="Balance"
                  name="balance"
                  onChange={handleChange}
                  type="number"
                  value={formState.values.balance || ''}
                  variant="outlined"
                />
                {hasError('policy') && (
                  <FormHelperText error>
                    {formState.errors.policy[0]}
                  </FormHelperText>
                )}
                <Button
                  className={classes.signUpButton}
                  color="primary"
                  disabled={!formState.isValid}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Create now
                </Button>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

SignUp.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignUp);
