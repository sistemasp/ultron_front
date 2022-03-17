import React, { Fragment } from 'react';
import Modal from '@material-ui/core/Modal';
import { Grid, TextField } from '@material-ui/core';
import { ButtonCustom } from "../../../basic/ButtonCustom";
import myStyles from '../../../../css';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    overflow: 'scroll',
    height: '90%',
  };
}

const FormFacturas = (props) => {

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    isLoading,
    onClickCancel,
    onChange,
    open,
    colorBase,
    onClickGuardar,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper_95}>
          <form>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <h1>FACTURA</h1>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="factura"
                  label="FACTURA"
                  value={values.factura}
                  onChange={onChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="fecha"
                  label="FECHA"
                  value={values.fecha}
                  onChange={onChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="almacen"
                  label="ALMACEN"
                  value={values.almacen}
                  onChange={onChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="proveedor"
                  label="PROVEEDOR"
                  value={values.proveedor}
                  onChange={onChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.buttonCancel}
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
                  onClick={() => onClickGuardar(values)}
                  disabled={isLoading}
                  text='GUARDAR' />
              </Grid>
            </Grid>

          </form>
        </div>
      </Modal>
    </div>
  );
}

export default FormFacturas;