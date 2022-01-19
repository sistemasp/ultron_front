import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, Grid } from '@material-ui/core';
import { ButtonCustom } from "../../basic/ButtonCustom";
import { CheckCustom } from '../../basic/CheckCustom';
import TableComponent from '../../table/TableComponent';
import ModalPago from '../modal_pago';
import ModalBuscarRazonSocial from '../modal_buscar_razon_social';
import { toFormatterCurrency } from '../../../utils/utils';
import myStyles from '../../../css';
import PagoMultiservicio from '../pago_multiservicios';
import ImprimirDatosFacturacion from '../imprimir/datos_facturacion';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const FormPagosMultiservicios = (props) => {

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    pago,
    pagos,
    titulo,
    isValid,
    onClickCancel,
    onClickGuardar,
    isLoading,
    open,
    columns,
    options,
    openModalPago,
    onClickNewPago,
    onClickCancelPago,
    loadPagos,
    datosImpresion,
    handlePrint,
    openModalImprimirDatosFacturacion,
    handleCloseImprimirDatosFacturacion,
    pagoAnticipado,
    empleado,
    sucursal,
    onGuardarModalPagos,
    openModalFactura,
    onCloseBuscarRazonSocial,
    actions,
    restante,
    tipoServicioId,
    onChangeFactura,
    values,
    colorBase,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <div>
      {
        openModalPago ?
          <PagoMultiservicio
            open={openModalPago}
            onClose={onClickCancelPago}
            servicio={pagoAnticipado}
            pago={pago}
            empleado={empleado}
            sucursal={sucursal}
            loadPagos={loadPagos}
            restante={restante}
            colorBase={colorBase}
            tipoServicioId={tipoServicioId} />
          : ''
      }
      {
        openModalFactura ?
          <ModalBuscarRazonSocial
            open={openModalFactura}
            onClose={onCloseBuscarRazonSocial}
            pago={pago}
            colorBase={colorBase}
            servicio={pagoAnticipado}
          /> : ''
      }
      {
        openModalImprimirDatosFacturacion ?
          <ImprimirDatosFacturacion
            open={openModalImprimirDatosFacturacion}
            onClose={handleCloseImprimirDatosFacturacion}
            datos={datosImpresion}
            colorBase={colorBase}
            sucursal={sucursal} /> : ''
      }
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper_95}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={true} className={classes.grid_center}>
              <ButtonCustom
                className={classes.button}
                color="primary"
                variant="contained"
                onClick={onClickNewPago}
                disabled={isLoading}
                text='AGREGAR PAGO' />
            </Grid>

            <Grid item xs={true} sm={true} className={classes.grid_center}>
              <CheckCustom
                checked={pagoAnticipado.isFactura}
                onChange={onChangeFactura}
                disabled={pagoAnticipado.factura}
                name="checkedF"
                label="REQUIERE FACTURA"
              />
            </Grid>
            {
              pagoAnticipado.factura || values.isFactura ?
                <Grid item xs={true} sm={true}>
                  <ButtonCustom
                    className={classes.button}
                    color="primary"
                    variant="contained"
                    onClick={(event) => handlePrint(event, pagoAnticipado)}
                    text='IMPRIMIR DATOS' />
                </Grid>
                : ''
            }
          </Grid>
          <TableComponent
            titulo={titulo}
            columns={columns}
            data={pagos}
            options={options}
            actions={actions}
            localization={
              {
                header: {
                  actions: 'FACTURA'
                }
              }
            } />

          <Grid container xs={12}>
            <Grid item xs={true} sm={true}>
              <h1>{`TOTAL A PAGAR: ${toFormatterCurrency(pagoAnticipado.total)}`}</h1>
            </Grid>
            <Grid item xs={true} sm={true}>
              <h1>{`RESTANTE: ${toFormatterCurrency(restante)}`}</h1>
            </Grid>
          </Grid>

          <Grid container xs={12}>
            <Grid item xs={12} sm={6}>
              <ButtonCustom
                className={classes.buttonCancel}
                color="secondary"
                variant="contained"
                onClick={onClickCancel}
                text={true ? 'CANCELAR' : 'SALIR'} />
            </Grid>
            {
              //!servicio.pagado ?
              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={() => onGuardarModalPagos(pagoAnticipado)}
                  disabled={pagos == ![]}
                  text='GUARDAR' />
              </Grid> //: ''
            }

          </Grid>
        </div>
      </Modal>
    </div>
  );
}

export default FormPagosMultiservicios;