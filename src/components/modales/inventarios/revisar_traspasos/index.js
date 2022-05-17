import React, { useEffect, useState } from 'react';
import { Backdrop, CircularProgress, FormControl, MenuItem, Select } from '@material-ui/core';
import { Fragment } from 'react';
import FormRevisarTraspasos from './FormRevisarTraspasos';
import myStyles from '../../../../css';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { responseCodeCreate, responseCodeOK } from '../../../../utils/constants';
import { createTraspaso, findTraspasoById } from '../../../../services/centinela/traspasos';
import {
  centinelaStatusFinalizadoId,
  centinelaTextColorOK,
  centinelaBackgroundColorOk,
} from '../../../../utils/centinela_constants';
import { dateToString, toFormatterCurrency } from '../../../../utils/utils';
import { createSurtidoTraspaso, findSurtidoTraspasoByRegistroId } from '../../../../services/centinela/surtidotraspasos';
import TableComponent from '../../../table/TableComponent';
import { createRegistroTraspaso } from '../../../../services/centinela/registrotraspasos';
import { createExistencia } from '../../../../services/centinela/existencias';

const ModalRevisarTraspasos = (props) => {

  const {
    open,
    onClose,
    colorBase,
    traspaso,
    loadSolicitudesEnviadas,
    loadSolicitudesRecibidas,
  } = props;

  const titulo = "REGISTROS";

  const [isLoading, setIsLoading] = useState(false)
  const [values, setValues] = useState({
    ...traspaso,
  })

  const classes = myStyles(colorBase)();

  const columns = [
    { title: 'PRODUCTO', field: 'show_producto' },
    { title: 'CANTIDAD', field: 'show_cantidad' },
    { title: 'SURTIDO', field: 'surtido' },
    { title: 'FALTANTES', field: 'faltantes' },
    { title: 'STATUS', field: 'status.descripcion' },
  ]

  const options = {
    rowStyle: rowData => {
      return {
        color: rowData.status.id == centinelaStatusFinalizadoId ? centinelaTextColorOK : '',
        backgroundColor: rowData.status.id == centinelaStatusFinalizadoId ? centinelaBackgroundColorOk : '',
      }
    },
    headerStyle: {
      backgroundColor: colorBase,
      color: '#FFF',
      fontWeight: 'bolder',
      fontSize: '18px',
      textAlign: 'center',
    },
    cellStyle: {
      fontWeight: 'bolder',
      fontSize: '16px',
      padding: '5px',
      textAlign: 'center',
    },
    paging: false,
  }

  const validarRegistro = async (surtido) => {
    const registro = values.registros.find(reg => {
      return reg.surtidos[surtido.tableData.id] ? reg.surtidos[surtido.tableData.id].id === surtido.id
        : false
    })
    let registroCompleto = true
    registro.surtidos.forEach(surt => {
      registroCompleto = registroCompleto && (surt.status == centinelaStatusFinalizadoId || surt.status.id == centinelaStatusFinalizadoId)
    })
    if (registroCompleto) {
      registro.status = centinelaStatusFinalizadoId
      const response = await createRegistroTraspaso(registro)
      if (`${response.status}` === responseCodeCreate) {
        findTraspaso()
      }
    } else {
      findTraspaso()
    }

  }

  const handleCheckRegistro = async (event, rowData) => {
    rowData.status = centinelaStatusFinalizadoId
    const response = await createSurtidoTraspaso(rowData)
    if (`${response.status}` === responseCodeCreate) {
      const registro = values.registros.find(reg => {
        return reg.surtidos[rowData.tableData.id] ? reg.surtidos[rowData.tableData.id].id === rowData.id
          : false
      })
      console.log("KAOZ", registro)

      const existencia = {
        ...rowData,
        almacen: traspaso.almacen_destino.id,
        unidad_entrada: registro.unidad.id,
        unidad_salida: registro.unidad.id,
        costo_unidad_entrada: rowData.costo,
        costo_unidad_salida: rowData.costo,
        contenido: 1,
        producto: registro.producto.id,
        stock_salida: rowData.cantidad
      }

      const response = await createExistencia(existencia)
      if (`${response.status}` === responseCodeCreate) {
        validarRegistro(rowData)
      }
      
    }
  }

  const actions = [
    rowData => {
      return rowData.status.id == centinelaStatusFinalizadoId ?
        '' :
        {
          icon: CheckCircleOutlineIcon,
          tooltip: 'CHECK',
          onClick: handleCheckRegistro
        }
    },
  ]

  const columnsRegistroDetalles = [
    { title: 'CANTIDAD', field: 'cantidad' },
    { title: 'COSTO', field: 'costo_moneda' },
    { title: 'LOTE', field: 'lote' },
    { title: 'CADUCIDAD', field: 'show_caducidad' },
    { title: 'STATUS', field: 'status.descripcion' },
  ]

  const optionsRegistroDetail = {
    rowStyle: rowData => {
      return {
        color: rowData.status.id == centinelaStatusFinalizadoId ? centinelaTextColorOK : '',
        backgroundColor: rowData.status.id == centinelaStatusFinalizadoId ? centinelaBackgroundColorOk : '',
      }
    },
    headerStyle: {
      backgroundColor: colorBase,
      color: '#FFF',
      fontWeight: 'bolder',
      fontSize: '16px',
      padding: '5px',
    },
    cellStyle: {
      fontWeight: 'bolder',
      fontSize: '16px',
      padding: '0px',
    },
    exportAllData: true,
    exportButton: false,
    exportDelimiter: ';',
    search: false,
    showTitle: false,
    toolbar: false,
    paging: false,
    draggable: false,
  }

  const detailRegistroPanel = [
    {
      tooltip: 'DETALLES',
      render: rowData => {
        return (
          <Fragment>
            <TableComponent
              columns={columnsRegistroDetalles}
              data={rowData.surtidos}
              actions={actions}
              options={optionsRegistroDetail} />
          </Fragment>
        )
      },
    }
  ]

  const handleClickAceptarTraspaso = async () => {
    values.status = centinelaStatusFinalizadoId
    const response = await createTraspaso(values)
    if (`${response.status}` === responseCodeCreate) {
      loadSolicitudesEnviadas()
      loadSolicitudesRecibidas()
      onClose()
    }
  }

  const findTraspaso = async () => {
    setIsLoading(true);
    const response = await findTraspasoById(traspaso.id);
    if (`${response.status}` === responseCodeOK) {
      const resTraspaso = response.data;
      await resTraspaso.registros.reduce(async (previousPromise, registro) => {
        await previousPromise
        const resRegTra = await findSurtidoTraspasoByRegistroId(registro.id)
        if (`${resRegTra.status}` === responseCodeOK) {
          const surtidos = resRegTra.data
          let cantidadSurtida = 0
          surtidos.forEach(surtido => {
            surtido.costo_moneda = toFormatterCurrency(surtido.costo)
            surtido.show_caducidad = surtido.caducidad ? dateToString(surtido.caducidad) : 'SIN CADUCIDAD'
            cantidadSurtida += surtido.cantidad
          })
          registro.surtido = cantidadSurtida
          registro.show_producto = `${registro.producto.codigo} - ${registro.producto.descripcion}`
          registro.faltantes = Number(registro.cantidad) - cantidadSurtida
          registro.show_cantidad = `${registro.cantidad} (${registro.unidad.descripcion})`
          registro.surtidos = surtidos
        }
        return Promise.resolve()
      }, Promise.resolve())
      setValues(resTraspaso)
    }
    setIsLoading(false)
  }

  const loadAll = async () => {
    setIsLoading(true)
    findTraspaso()
    setIsLoading(false)
  }

  useEffect(() => {
    loadAll()
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <FormRevisarTraspasos
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            values={values}
            open={open}
            onClickAceptarTraspaso={handleClickAceptarTraspaso}
            onClickCancel={onClose}
            detailRegistroPanel={detailRegistroPanel}
            isLoading={isLoading}
            titulo={titulo}
            columns={columns}
            options={options}
            colorBase={colorBase} />
          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }

    </Fragment>
  );
}

export default ModalRevisarTraspasos;