import React, { Fragment } from 'react';
import Modal from '@material-ui/core/Modal';
import { FormControl, Grid, TextField } from '@material-ui/core';
import { ButtonCustom } from "../../../basic/ButtonCustom";
import { ComboCustomProductos } from "../../../basic/ComboCustomProductos";
import myStyles from '../../../../css';
import TableComponent from '../../../table/TableComponent';

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

const FormVerTraspasos = (props) => {

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    isLoading,
    open,
    colorBase,
    onClickCancel,
    titulo,
    columns,
    options,
    components,
    detailRegistroPanel,
  } = props

  const classes = myStyles(colorBase)()

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper_95}>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <h1>DETALLES DEL TRASPASO</h1>
              </Grid>

              <Grid item xs={6}>
                <ButtonCustom
                  className={classes.buttonCancel}
                  color="primary"
                  variant="contained"
                  onClick={() => onClickCancel()}
                  disabled={isLoading}
                  text='CERRAR' />
              </Grid>

              <Grid item xs={6}>
                <h1>{`ALMACEN ORIGEN: ${values.almacen_origen.descripcion}`}</h1>
              </Grid>

              <Grid item xs={6}>
                <h1>{`ALMACEN DESTINO: ${values.almacen_destino.descripcion}`}</h1>
              </Grid>
               
              <Grid item xs={12}>
                <TableComponent
                  titulo={titulo}
                  columns={columns}
                  data={values.registros}
                  options={options}
                  components={components}
                  detailPanel={detailRegistroPanel} />
              </Grid>
            </Grid>

          </form>
        </div>
      </Modal >
    </div >
  );
}

export default FormVerTraspasos;