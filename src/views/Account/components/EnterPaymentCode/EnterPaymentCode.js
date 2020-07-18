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

const EnterPaymentCode = forwardRef((props, ref) => {
  const {
    event,
    className,
    onSubmit,
    onCancel,
    ...rest
  } = props;

  const classes = useStyles();

  const defaultEvent = {
    linkClass: '',
    id_link_class:'',
    paymentCode: '',
    uid:'',
    title: ''
  };

  const [values, setValues] = useState(event || defaultEvent);

  const handleFieldChange = e => {
    e.persist();
    setValues(values => ({
      ...values,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value
    }));
  };
  const handleSubmit = () => {
    onSubmit({ ...values });
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
      ref={ref}
    >
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
          onClick={handleSubmit}
          variant="contained"
        >
          Get payment info
        </Button>
      </CardActions>
    </Card>
  );
});

EnterPaymentCode.propTypes = {
  className: PropTypes.string,
  event: PropTypes.object,
  onAdd: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};

export default EnterPaymentCode;
