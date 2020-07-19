/* eslint-disable react/display-name */
import React, { useState, forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import uuid from 'uuid/v1';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  FormControlLabel,
  Switch,
  colors
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';

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

const AddEvent = forwardRef((props, ref) => {
  const {
    publicFlag,
    start,
    end,
    event,
    onDelete,
    onCancel,
    onAdd,
    onEdit,
    className,
    ...rest
  } = props;

  const classes = useStyles();

  const defaultEvent = {
    title: 'class',
    linkClass: '',
    publicFlag: publicFlag,
    start: start,
    end: end
  };

  const [values, setValues] = useState(event || defaultEvent);

  const mode = event ? 'edit' : 'add';

  const handleFieldChange = e => {
    e.persist();
    setValues(values => ({
      ...values,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value
    }));
  };

  const joinClass = (values) => {
    const {linkClass, start, end } = values
    const now = new Date()
    if (now.getTime() >= new Date(start).getTime() && now.getTime() <= new Date(end).getTime()){
      window.open(linkClass)
    } else {
      if (now.getTime() < new Date(start).getTime()){
        alert('Lớp học chưa bắt đầu')
      }
      if(now.getTime() > new Date(end).getTime()){
        alert('Lớp học đã kết thúc')
      }
    }
  }

  const handleDelete = () => {
    onDelete && onDelete(event);
  };

  const handleAdd = () => {
    if (!values.title) {
      return;
    }

    onAdd({ ...values, id: uuid() });
  };

  const handleEdit = () => {
    if (!values.title) {
      return;
    }

    onEdit(values);
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
            {mode === 'add' ? 'Add Event' : 'Edit Event'}
          </Typography>
          <TextField
            required
            className={classes.field}
            fullWidth
            label="Title class"
            name="title"
            onChange={handleFieldChange}
            value={values.title}
            variant="outlined"
          />
          {
            mode === 'edit' ?
            <>
              <TextField
                className={classes.field2}
                fullWidth
                onChange={handleFieldChange}
                label="Link class"
                name="linkClass"
                value={values.linkClass}
                variant="outlined"
              />
              <div className ={classes.join}>
                <Button
                  className={classes.joinClass}
                  // href={values.linkClass}
                  onClick={() => joinClass(values)}
                  variant="contained"
                >
                  Join class
                </Button>
              </div>
            </>
            : 
            <TextField
              className={classes.field}
              fullWidth
              label="Link class"
              name="linkClass"
              value={values.linkClass}
              onChange={handleFieldChange}
              variant="outlined"
            />
          }
          {
            mode === 'add' &&
            <FormControlLabel
              className={classes.field}
              control={
                <Switch
                  checked={values.publicFlag}
                  name="publicFlag"
                  onChange={handleFieldChange}
                />
              }
              label="Public"
            />
          }
          
          <TextField
            className={classes.field}
            defaultValue={moment(values.start).format('YYYY-MM-DDTHH:mm:ss')}
            fullWidth
            label="Start date"
            name="start"
            onChange={handleFieldChange}
            type="datetime-local"
            variant="outlined"
          />
          <TextField
            className={classes.field}
            defaultValue={moment(values.end).format('YYYY-MM-DDTHH:mm:ss')}
            // disabled={values.publicFlag}
            fullWidth
            label="End date"
            name="end"
            onChange={handleFieldChange}
            type="datetime-local"
            variant="outlined"
          />
        </CardContent>
        <Divider />
        <CardActions>
          <IconButton
            edge="start"
            onClick={handleDelete}
          >
            <DeleteIcon />
          </IconButton>
          <Button
            className={classes.cancelButton}
            onClick={onCancel}
            variant="contained"
          >
            Cancel
          </Button>
          {mode === 'add' ? (
            <Button
              className={classes.confirmButton}
              onClick={handleAdd}
              variant="contained"
            >
              Add
            </Button>
          ) : (
            <Button
              className={classes.confirmButton}
              onClick={handleEdit}
              variant="contained"
            >
              Save
            </Button>
          )}
        </CardActions>
      </form>
    </Card>
  );
});

AddEvent.propTypes = {
  className: PropTypes.string,
  event: PropTypes.object,
  onAdd: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};

export default AddEvent;
