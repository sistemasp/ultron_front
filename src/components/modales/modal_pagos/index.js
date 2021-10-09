import React, { useState, useEffect, Fragment } from 'react';
import { addZero, toFormatterCurrency } from '../../../utils/utils';
import ModalFormPagos from './ModalFormPagos';
import EditIcon from '@material-ui/icons/Edit';
import { findEsquemaById } from '../../../services/esquemas';
import { Backdrop, CircularProgress } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import myStyles from '../../../css';
import { deleteEntrada } from '../../../services/entradas';
import { deletePago, findPagosByTipoServicioAndServicio } from '../../../services/pagos';
import { deleteFactura } from '../../../services/facturas';

const ModalPagos = (props) => {

  const {
    open,
    onClose,
    sucursal,
    servicio,
    empleado,
    onGuardarModalPagos,
    tipoServicioId,
    colorBase,
  } = props;

  const token = empleado.access_token;

  const classes = myStyles(colorBase)();

  const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;
  const efectivoFormaPagoId = process.env.REACT_APP_FORMA_PAGO_EFECTIVO;
  const noPagaFormaPagoId = process.env.REACT_APP_FORMA_PAGO_NO_PAGA;
  const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
  const servicioConsultaId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const servicioCirugiaId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID;
  const servicioEsteticaId = process.env.REACT_APP_ESTETICA_SERVICIO_ID;
  const servicioFacialId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
  const servicioDermapenId = process.env.REACT_APP_DERMAPEN_SERVICIO_ID;
  const frecuenciaReconsultaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;
  const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
  const sucursalRubenDarioId = process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID;
  const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
  const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;
  const revisadoTipoCitaId = process.env.REACT_APP_TIPO_CITA_REVISADO_ID;
  const derivadoTipoCitaId = process.env.REACT_APP_TIPO_CITA_DERIVADO_ID;
  const realizadoTipoCitaId = process.env.REACT_APP_TIPO_CITA_REALIZADO_ID;
  const noAplicaTipoCitaId = process.env.REACT_APP_TIPO_CITA_NO_APLICA_ID;
  const directoTipoCitaId = process.env.REACT_APP_TIPO_CITA_DIRECTO_ID;

  const [isLoading, setIsLoading] = useState(true);
  const [pagos, setPagos] = useState([]);
  const [pago, setPago] = useState({});
  const [esquema, setEsquema] = useState({});
  const [openModalPago, setOpenModalPago] = useState(false);
  const [openModalFactura, setOpenModalFactura] = useState(false);
  const [datosImpresion, setDatosImpresion] = useState();
  const [openModalImprimirDatosFacturacion, setOpenModalImprimirDatosFacturacion] = useState(false);
  const [restante, setRestante] = useState(0);
  const [values, setValues] = useState({
    ...servicio,
    cantidad: servicio.precio,
    porcentaje_descuento_clinica: servicio.porcentaje_descuento_clinica ? servicio.porcentaje_descuento_clinica : 0,
    descuento_clinica: 0,
    descuento_dermatologo: 0,
    has_descuento_dermatologo: servicio.has_descuento_dermatologo,
    total: servicio.total,
    isFactura: !!servicio.factura,
    factura: servicio.factura,
    paciente: servicio.paciente,
  });

  servicio.isFactura = !!servicio.factura;

  const handleEliminarPago = async (event, rowData) => {
    setIsLoading(true);
    await deleteEntrada(rowData.entrada);
    const response = await deletePago(rowData._id);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      await loadPagos();
    }
    setIsLoading(false);
  }

  const handleChangeFactura = () => {
    const isFactura = !values.isFactura;
    servicio.isFactura = isFactura;
    setValues({
      ...values,
      isFactura: isFactura,
    });
    setOpenModalFactura(isFactura);
  }

  const columns = [
    { title: 'FECHA', field: 'fecha' },
    { title: 'HORA', field: 'hora' },
    { title: 'FORMA PAGO', field: 'forma_pago.nombre' },
    { title: 'CANTIDAD', field: 'cantidad_moneda' },
    { title: 'TOTAL', field: 'total_moneda' },
    { title: 'BANCO', field: 'banco_nombre' },
    { title: 'TIPO TARJETA', field: 'tipo_tarjeta_nombre' },
    { title: 'DÍGITOS', field: 'digitos_show' },
    { title: 'OBSERVACIONES', field: 'observaciones' },
  ];

  const options = {
    headerStyle: {
      backgroundColor: colorBase,
      color: '#FFF',
      fontWeight: 'bolder',
      fontSize: '18px'
    }
  }

  const localization = {
    header: { actions: 'FACTURAR' }
  };

  const actions = [
    {
      icon: DeleteForeverIcon,
      tooltip: 'ELIMINAR PAGO',
      onClick: handleEliminarPago
    },
  ];

  const loadPagos = async () => {
    setIsLoading(true);
    const response = await findPagosByTipoServicioAndServicio(tipoServicioId, servicio._id);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      let acomulado = 0;
      response.data.forEach(item => {
        const fecha = new Date(item.fecha_pago);
        item.fecha = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${addZero(fecha.getFullYear())}`
        item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
        item.cantidad_moneda = toFormatterCurrency(item.cantidad);
        item.comision_moneda = toFormatterCurrency(item.comision);
        item.total_moneda = toFormatterCurrency(item.total);
        item.banco_nombre = item.banco ? item.banco.nombre : '-';
        item.tipo_tarjeta_nombre = item.tipo_tarjeta ? item.tipo_tarjeta.nombre : '-';
        item.digitos_show = item.digitos ? item.digitos : '-';
        acomulado = Number(acomulado) + Number(item.cantidad);
      });
      setRestante(Number(values.total) - Number(acomulado));
      servicio.pagos = response.data;
      setPagos(response.data);
    }
    setIsLoading(false);
  }

  /*const handleClickGuardar = async (event, rowData) => {
    setIsLoading(true);
    rowData.fecha_pago = new Date();
    onGuardarPago(rowData);
    setIsLoading(false);
  }*/

  const handleClickNewPago = () => {
    setOpenModalPago(true);
  }

  const handleClickCancelPago = () => {
    setOpenModalPago(false);
  }

  const handleCloseImprimirDatosFacturacion = (event, rowData) => {
    setOpenModalImprimirDatosFacturacion(false);
  }

  const handlePrint = async (event, rowData) => {
    setDatosImpresion(rowData);
    setOpenModalImprimirDatosFacturacion(true);
  }

  const handleEliminarFactura = async (event, rowData) => {
    setIsLoading(true);
    delete servicio.factura;
    servicio.isFactura = false;
    onGuardarModalPagos(servicio);
    // const factura = rowData.factura;
    // const response = await deleteFactura(factura._id);
    // if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
    //   delete rowData.factura;
    //   rowData.isFactura = false;
    //   setValues({
    //     ...values,
    //     isFactura: false,
    //   });
    // }
    setIsLoading(false);
  }

  const handleCloseBuscarRazonSocial = (val, datosFactura) => {
    servicio.isFactura = val;
    servicio.factura = datosFactura;
    setValues({
      ...values,
      isFactura: val,
      factura: datosFactura,
    });
    // TODO: CREATE FACTURA
    setOpenModalFactura(false);
  }

  const getMayorDescuento = () => {
    let porcentajeDescuento = 0;
    switch (servicio.servicio._id) {
      case servicioCirugiaId:
        const descuentoCirugia = (servicio.total_aplicacion * esquema.porcentaje_cirugias / 100);
        porcentajeDescuento = (descuentoCirugia * 100 / values.total);
        break;
      case servicioConsultaId:
        porcentajeDescuento = servicio.frecuencia._id === frecuenciaReconsultaId ? esquema.porcentaje_reconsulta : esquema.porcentaje_consulta;
        break;
      case servicioEsteticaId:
        const descuentoEstetica = (servicio.total_aplicacion * esquema.porcentaje_dermocosmetica / 100);
        porcentajeDescuento = (descuentoEstetica * 100 / values.total);
        break;
      case servicioDermapenId:
        const descuentoDermapen = (servicio.total_aplicacion * esquema.porcentaje_dermocosmetica / 100);
        porcentajeDescuento = (descuentoDermapen * 100 / values.total);
        break;
      case servicioAparatologiaId:
        porcentajeDescuento = esquema.porcentaje_laser;
        break;
      case servicioFacialId:
        let comisionDermatologo = 0;
        servicio.tratamientos.map(tratamiento => {
          tratamiento.areasSeleccionadas.map(areaSeleccionada => {
            let comisionReal = 0;
            switch (servicio.tipo_cita._id) {
              case revisadoTipoCitaId:
                comisionReal = sucursal._id === sucursalManuelAcunaId ? areaSeleccionada.comision_revisado_ma
                  : (sucursal._id === sucursalRubenDarioId ? areaSeleccionada.comision_revisado_rd
                    : areaSeleccionada.comision_revisado);
                break;
              case derivadoTipoCitaId:
                comisionReal = sucursal._id === sucursalManuelAcunaId ? areaSeleccionada.comision_derivado_ma
                  : (sucursal._id === sucursalRubenDarioId ? areaSeleccionada.comision_derivado_rd
                    : areaSeleccionada.comision_derivado);
                break;
              case realizadoTipoCitaId:
                comisionReal = sucursal._id === sucursalManuelAcunaId ? areaSeleccionada.comision_realizado_ma
                  : (sucursal._id === sucursalRubenDarioId ? areaSeleccionada.comision_realizado_rd
                    : areaSeleccionada.comision_realizado);
                break;
              case directoTipoCitaId: // TOMA EL 100%
                comisionReal = sucursal._id === sucursalManuelAcunaId ? areaSeleccionada.precio_ma
                  : (sucursal._id === sucursalRubenDarioId ? areaSeleccionada.precio_rd
                    : areaSeleccionada.precio_fe);
                break;
              case noAplicaTipoCitaId:
                comisionReal = 0;
                break;
            }
            comisionReal -= comisionReal * (servicio.porcentaje_descuento_clinica ? servicio.porcentaje_descuento_clinica : 0) / 100;

            areaSeleccionada.comision_real = comisionReal;
            comisionDermatologo += Number(comisionReal);
          });
        });

        porcentajeDescuento = comisionDermatologo * 100 / values.total;
        break;
    }
    return porcentajeDescuento;
  }

  const calcularTotal = (datos) => {
    const cantidad = Number(datos.cantidad);
    const descuento_clinica = cantidad * Number(datos.porcentaje_descuento_clinica) / 100;
    const descuento_dermatologo = datos.has_descuento_dermatologo
      ? (servicio.dermatologo._id !== dermatologoDirectoId
        ? (getMayorDescuento())
        : 0)
      : 0;
    const descuento_dermatologo_final = (descuento_dermatologo * (cantidad - descuento_clinica) / 100);
    let total = cantidad - descuento_clinica - descuento_dermatologo_final;

    let acomulado = 0;
    pagos.forEach(pago => {
      acomulado = Number(acomulado) + Number(pago.cantidad);
    });
    setRestante(servicio.precio - acomulado - descuento_clinica - descuento_dermatologo_final);

    servicio.has_descuento_dermatologo = datos.has_descuento_dermatologo;
    servicio.descuento_dermatologo = descuento_dermatologo;
    servicio.porcentaje_descuento_clinica = datos.porcentaje_descuento_clinica;
    servicio.descuento_clinica = descuento_clinica;
    servicio.total = total;

    setValues({
      ...datos,
      cantidad: cantidad,
      descuento_clinica: descuento_clinica,
      descuento_dermatologo: descuento_dermatologo_final,
      has_descuento_dermatologo: datos.has_descuento_dermatologo,
      porcentaje_descuento_clinica: datos.porcentaje_descuento_clinica,
      total: total,
    });
  }

  const handleChangDescuentoDermatologo = (event) => {
    const datos = {
      ...values,
      has_descuento_dermatologo: !values.has_descuento_dermatologo,
    }
    calcularTotal(datos);
  }

  const handleChangeDescuento = (event) => {
    const datos = {
      ...values,
      porcentaje_descuento_clinica: event.target.value,
    }
    calcularTotal(datos);
  }

  const loadEsquema = async () => {
    const response = await findEsquemaById(servicio.dermatologo.esquema);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setEsquema(response.data);
    }
  }

  const loadAll = async () => {
    setIsLoading(true);
    await loadPagos();
    await loadEsquema();
    setIsLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormPagos
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClickNewPago={handleClickNewPago}
            onClickCancelPago={handleClickCancelPago}
            openModalPago={openModalPago}
            onClickCancel={onClose}
            isLoading={isLoading}
            pagos={pagos}
            pago={pago}
            columns={columns}
            options={options}
            actions={actions}
            localization={localization}
            servicio={servicio}
            empleado={empleado}
            datosImpresion={datosImpresion}
            openModalImprimirDatosFacturacion={openModalImprimirDatosFacturacion}
            handleCloseImprimirDatosFacturacion={handleCloseImprimirDatosFacturacion}
            handlePrint={handlePrint}
            handleEliminarFactura={handleEliminarFactura}
            sucursal={sucursal}
            onGuardarModalPagos={onGuardarModalPagos}
            titulo={`PAGOS: ${servicio.paciente.nombres} ${servicio.paciente.apellidos}`}
            openModalFactura={openModalFactura}
            onCloseBuscarRazonSocial={handleCloseBuscarRazonSocial}
            onChangeFactura={handleChangeFactura}
            loadPagos={loadPagos}
            restante={restante}
            onChangeDescuento={(e) => handleChangeDescuento(e)}
            onChangDescuentoDermatologo={(e) => handleChangDescuentoDermatologo(e)}
            tipoServicioId={tipoServicioId}
            colorBase={colorBase}
            values={values} />

          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>


  );
}

export default ModalPagos;