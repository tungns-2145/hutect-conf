/* eslint-disable react/display-name */
import React, { useState, forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Divider,
  colors
} from '@material-ui/core';
import { db } from '../../../../config';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 700,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  field: {
    marginTop: theme.spacing(3)
  },
  field2: {
    marginTop: theme.spacing(3),
    width: '80%'
  },
  cancelButton: {
    marginLeft: 'auto'
  },
  confirmButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  join: {
    marginTop: theme.spacing(4),
    float: "right",
    textAlign: "center",
    width: "20%"
  },
  joinClass: {
    
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

const ConfirmPayment = forwardRef((props, ref) => {
  const {
    event,
    className,
    onCancel,
    ...rest
  } = props;

  const classes = useStyles();

  const defaultEvent = {
    linkClass: '',
    id_link_class:'',
    paymentCode: '',
    uid:''
  };

  const [values, setValues] = useState(event || defaultEvent);

  const getPaymentInfo = async (paymentCode) => {
    const paymentInfos = await db.collection(`payment-info`)
    .where('payment_code', '==', paymentCode)
    .get()
    return paymentInfos.docs.map(payment => ({...payment.data(),id: payment.id}))
  }
  const getLogInClass = async (payment_code, id) => {
    const logIn = await db.collection('log_in_class')
    .where('payment_code', '==', payment_code)
    .where('id_link_class', '==', id)
    .get()
    return logIn.docs.map(log => ({...log.data(),id: log.id}))
  }

  const addLogIn = (id_link_class, payment_code) => {
    db.collection(`log_in_class`).add({
      id_link_class,
      payment_code,
      time_in: new Date()
    })
  }

  const joinClass = async () => {
    const {linkClass, paymentCode, id_link_class } = values
    const logIn = await getLogInClass(paymentCode, id_link_class) 
    if (logIn.length > 0){
      addLogIn(id_link_class, paymentCode)
      window.open(linkClass)
    } else {
      const paymentInfo = await getPaymentInfo(paymentCode)
      if (paymentInfo.length > 0) {
        const {id ,payment_code, balance} = paymentInfo[0]
        if(balance > 0) {
          db.collection(`payment-info`).doc(id).set({
            payment_code,
            balance: balance - 1
          }).then(()=>{
            addLogIn(id_link_class, payment_code)
            window.open(linkClass)
          })
        }
      } else {
        alert('Payment code not found')
      }
    }
  }

  const handleFieldChange = e => {
    e.persist();
    setValues(values => ({
      ...values,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value
    }));
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
      ref={ref}
    >
      <form>
        <CardContent>
          <Typography
            align="center"
            gutterBottom
            variant="h3"
          >
            Enter payment code:
          </Typography>
          <TextField
            required
            className={classes.field}
            fullWidth
            label="Payment code"
            name="paymentCode"
            onChange={handleFieldChange}
            value={values.paymentCode}
            variant="outlined"
          />
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            className={classes.cancelButton}
            onClick={onCancel}
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            className={classes.confirmButton}
            onClick={joinClass}
            variant="contained"
          >
            Join class
          </Button>
        </CardActions>
      </form>
    </Card>
  );
});

ConfirmPayment.propTypes = {
  className: PropTypes.string,
  event: PropTypes.object,
  onAdd: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};

export default ConfirmPayment;
