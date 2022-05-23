import React, { useEffect, useState } from 'react';
import { Backdrop, CircularProgress, FormControl, MenuItem, Select } from '@material-ui/core';
import { Fragment } from 'react';
import FormVerTraspasos from './FormVerTraspasos';
import myStyles from '../../../../css';
import { showAllAlmacens } from '../../../../services/centinela/almacenes';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { showAllProductos } from '../../../../services/centinela/productos';
// import { createRegistroFactura } from '../../../../services/centinela/registrotraspasos';
import { responseCodeCreate, responseCodeOK } from '../../../../utils/constants';
import { showAllUnidades } from '../../../../services/centinela/unidades';
import { createRegistroTraspaso, deleteRegistroTraspaso, findRegistroTraspasoById } from '../../../../services/centinela/registrotraspasos';
import { createTraspaso, findTraspasoById } from '../../../../services/centinela/traspasos';
import { centinelaBackgroundColorError, centinelaBackgroundColorOk, centinelaStatusEnviadoId, centinelaStatusFinalizadoId, centinelaTextColorOK } from '../../../../utils/centinela_constants';
import { createExistencia, findByAlmacenProducto } from '../../../../services/centinela/existencias';
import { dateToString, toFormatterCurrency } from '../../../../utils/utils';
import { createSurtidoTraspaso, deleteSurtidoTraspaso, findSurtidoTraspasoByRegistroId } from '../../../../services/centinela/surtidotraspasos';
import TableComponent from '../../../table/TableComponent';

const ModalVerTraspasos = (props) => {

  const {
    open,
    onClose,
    colorBase,
    traspaso,
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
  ];

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
              options={optionsRegistroDetail} />
          </Fragment>
        )
      },
    }
  ]

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
          <FormVerTraspasos
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            values={values}
            open={open}
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

export default ModalVerTraspasos;