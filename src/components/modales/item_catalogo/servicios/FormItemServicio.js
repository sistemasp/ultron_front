import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { ButtonCustom } from '../../../basic/ButtonCustom';
import { CheckCustom } from '../../../basic/CheckCustom';
import { Fragment } from 'react';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    overflow: 'scroll',
    height: '60%',
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  textField: {
    width: '100%',
  },
  button: {
    width: '100%',
    color: '#FFFFFF',
  },
  formControl: {
    minWidth: 120,
    width: '100%',
  },
}));

const FormItemCatalogo = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    handleSubmit,
    values,
    onChange,
    onChangeActive,
    onGuardarItem,
    onClickCancel,
    open,
    catalogo,
  } = props;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} className={classes.label}>
                <h1 className={classes.label}>{`${catalogo.nombre}`}</h1>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="nombre"
                  label="NOMBRE"
                  value={values.nombre}
                  onChange={onChange}
                  variant="outlined" />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="clave"
                  label="CLAVE"
                  value={values.clave}
                  onChange={onChange}
                  variant="outlined" />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="color"
                  label="COLOR"
                  value={values.color}
                  onChange={onChange}
                  variant="outlined" />
              </Grid>

              <Grid item xs={12}>
                <CheckCustom
                  checked={values.is_active}
                  onChange={onChangeActive}
                  name="checkedG"
                  label="ACTIVO" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                  onClick={onClickCancel}
                  text='CANCELAR' />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={(e) => onGuardarItem(e, values)}
                  text='GUARDAR' />
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default FormItemCatalogo;