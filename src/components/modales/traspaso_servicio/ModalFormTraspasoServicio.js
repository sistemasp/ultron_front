import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { ButtonCustom } from "../../basic/ButtonCustom";
import myStyles from '../../../css';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const ModalFormTraspasoServicio = (props) => {

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    sucursales,
    onClickCancel,
    onClickTraspasar,
    open,
    onChangeSucursal,
    values,
    colorBase,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <Grid container xs={12}>

            <Grid item xs={12}>
              <h1>TRASPASO PARA:</h1>
            </Grid>

            <Grid item xs={12}>
              <FormControl variant="outlined" className={classes.margin, classes.textField}>
                <InputLabel id="simple-select-outlined-sucursal">SUCURSALES</InputLabel>
                <Select
                  labelId="simple-select-outlined-sucursal"
                  id="simple-select-outlined-sucursal"
                  value={values.sucursal}
                  onChange={onChangeSucursal}
                  label="SUCURSALES" >
                  {sucursales
                    ? sucursales.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)
                    : ''}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <ButtonCustom
                className={classes.buttonCancel}
                color="secondary"
                variant="contained"
                onClick={onClickCancel}
                text="CANCELAR" />
            </Grid>
            <Grid item xs={6}>
              <ButtonCustom
                className={classes.button}
                color="primary"
                variant="contained"
                onClick={() => onClickTraspasar(values)}
                text='TRASPASAR' />
            </Grid>
          </Grid>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFormTraspasoServicio;