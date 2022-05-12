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

const FormAsignarTraspasos = (props) => {

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    isLoading,
    onClickEmpacar,
    onChange,
    open,
    colorBase,
    onClickGuardar,
    onClickEnviar,
    onChangeProducto,
    productos,
    unidades,
    titulo,
    columns,
    registro,
    options,
    components,
    lotes,
    registros,
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
                <h1>SOLICITUD DE TRASPASO</h1>
              </Grid>

              <Grid item xs={3}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={() => onClickGuardar(values)}
                  disabled={isLoading}
                  text='GUARDAR' />
              </Grid>
              <Grid item xs={3}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={() => onClickEnviar(values)}
                  disabled={isLoading}
                  text='ENVIAR' />
              </Grid>
              <Grid item xs={12} >
                <br />
              </Grid>
              <Grid item xs={7} >
                <FormControl variant="outlined" className={classes.textField}>
                  <ComboCustomProductos
                    label='PRODUCTO'
                    name="producto"
                    value={registro.producto}
                    onChange={onChangeProducto}
                    options={productos} />
                </FormControl>
              </Grid>
              <Grid container spacing={1}>
                <Grid item xs={true} >
                  <h2>
                    LOTE
                  </h2>
                </Grid>
                <Grid item xs={true} >
                  <h2>
                    CADUCIDAD
                  </h2>
                </Grid>
                <Grid item xs={true} >
                  <h2>
                    EXISTENCIAS
                  </h2>
                </Grid>
                <Grid item xs={true} >
                  <h2>
                    COSTO POR PIEZA
                  </h2>
                </Grid>
                <Grid item xs={true}>
                  <h2>
                    CANTIDAD
                  </h2>
                </Grid>
                <Grid item xs={true} >
                  <h2>
                    UNIDAD DE SALIDA
                  </h2>
                </Grid>
              </Grid>
              {
                lotes.map((lote, index) => {
                  return <Fragment>
                    <Grid container spacing={1}>
                      <Grid item xs={true} >
                        <h3>
                          {lote.lote}
                        </h3>
                      </Grid>
                      <Grid item xs={true} >
                        <h3>
                          {lote.caducidad_show}
                        </h3>
                      </Grid>
                      <Grid item xs={true} >
                        <h3>
                          {lote.stock_salida_show}
                        </h3>
                      </Grid>
                      <Grid item xs={true} >
                        <h3>
                          {lote.costo_unidad_salida_moneda}
                        </h3>
                      </Grid>
                      <Grid item xs={true}>
                        <TextField
                          className={classes.formControl}
                          name="cantidad"
                          label="CANTIDAD"
                          value={registros[index].cantidad}
                          onChange={(event) => onChange(event, index)}
                          type='Number'
                          variant="outlined" />
                      </Grid>
                      <Grid item xs={true} >
                        <h3>
                          {lote.unidad.descripcion}
                        </h3>
                      </Grid>
                    </Grid>
                  </Fragment>
                })
              }
              <Grid item xs={2}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={() => onClickEmpacar(registros)}
                  text='EMPACAR' />
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

export default FormAsignarTraspasos;