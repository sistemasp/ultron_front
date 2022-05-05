import React, { Fragment } from 'react';
import Modal from '@material-ui/core/Modal';
import { FormControl, Grid, TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { ButtonCustom } from "../../../basic/ButtonCustom";
import { ComboCustomProductos } from "../../../basic/ComboCustomProductos";
import myStyles from '../../../../css';
import TableComponent from '../../../table/TableComponent';
import { ComboCustom } from '../../../basic/ComboCustom';
import { ComboCustomDescripcion } from '../../../basic/ComboCustomDescripcion';
import { CheckCustom } from '../../../basic/CheckCustom';

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

const FormSeleccionarLote = (props) => {

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    isLoading,
    open,
    colorBase,
    onClickGuardar,
    titulo,
    columns,
    options,
    components,
    onClickCancel,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <h1>SOLICITUD DE TRASPASO</h1>
              </Grid>

              <Grid item xs={6}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={() => onClickGuardar(values)}
                  disabled={isLoading}
                  text='GUARDAR' />
              </Grid>
              <Grid item xs={6}>
                <ButtonCustom
                  className={classes.buttonCancel}
                  color="primary"
                  variant="contained"
                  onClick={onClickCancel}
                  disabled={isLoading}
                  text='CANCELAR' />
              </Grid>
              <Grid item xs={12} >
                <br />
              </Grid>
  
              <Grid item xs={12}>
                <TableComponent
                  titulo={titulo}
                  columns={columns}
                  data={values.registros}
                  options={options}
                  components={components} />
              </Grid>
            </Grid>

          </form>
        </div>
      </Modal >
    </div >
  );
}

export default FormSeleccionarLote;