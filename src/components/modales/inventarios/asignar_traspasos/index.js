import React, { useEffect, useState } from 'react';
import { Backdrop, CircularProgress, FormControl, MenuItem, Select } from '@material-ui/core';
import { Fragment } from 'react';
import FormAsignarTraspasos from './FormAsignarTraspasos';
import myStyles from '../../../../css';
import { showAllAlmacens } from '../../../../services/centinela/almacenes';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { showAllProductos } from '../../../../services/centinela/productos';
// import { createRegistroFactura } from '../../../../services/centinela/registrotraspasos';
import { responseCodeCreate, responseCodeOK } from '../../../../utils/constants';
import { showAllUnidades } from '../../../../services/centinela/unidades';
import { createRegistroTraspaso, deleteRegistroTraspaso, findRegistroTraspasoById } from '../../../../services/centinela/registrotraspasos';
import { createTraspaso, findTraspasoById } from '../../../../services/centinela/traspasos';
import { centinelaBackgroundColorError, centinelaStatusEnviadoId, centinelaTextColorOK } from '../../../../utils/centinela_constants';
import { createExistencia, findByAlmacenProducto } from '../../../../services/centinela/existencias';
import { dateToString, toFormatterCurrency } from '../../../../utils/utils';
import { createSurtidoTraspaso, deleteSurtidoTraspaso, findSurtidoTraspasoByRegistroId } from '../../../../services/centinela/surtidotraspasos';
import TableComponent from '../../../table/TableComponent';

const ModalAsignarTraspasos = (props) => {

  const {
    open,
    onClose,
    colorBase,
    traspaso,
    almacen,
    loadSolicitudesEnviadas,
    loadSolicitudesRecibidas,
    setMessage,
    setSeverity,
    setOpenAlert,
  } = props;

  const titulo = "INSUMOS";

  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({
    ...traspaso,
  });
  const [registro, setRegistro] = useState({});
  const [registros, setRegistros] = useState([]);
  const [findRegistro, setFindRegistro] = useState({});
  const [almacenes, setAlmacenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [lotes, setLotes] = useState([]);

  const [openLotes, setOpenLotes] = useState(false);

  const classes = myStyles(colorBase)();

  const columns = [
    { title: 'PRODUCTO', field: 'show_producto' },
    { title: 'CANTIDAD', field: 'show_cantidad' },
    { title: 'SURTIDO', field: 'surtido' },
    { title: 'FALTANTES', field: 'faltantes' },
  ];

  const options = {
    rowStyle: rowData => {
      return {
        color: rowData.faltantes === 0 ? centinelaTextColorOK : '',
        backgroundColor: rowData.faltantes === 0 ? process.env.REACT_APP_PAGADO_COLOR : (rowData.faltantes < 0 ? centinelaBackgroundColorError : '')
      };
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

  const handleEliminarRegistro = async (event, rowData) => {
    setIsLoading(true);
    await deleteSurtidoTraspaso(rowData.id)
    loadAll()
    setIsLoading(false);
  }

  const actions = [
    {
      icon: DeleteForeverIcon,
      tooltip: 'ELIMINAR REGISTRO',
      onClick: handleEliminarRegistro
    },
  ]

  const columnsRegistroDetalles = [
    { title: 'CANTIDAD', field: 'cantidad' },
    { title: 'COSTO', field: 'costo_moneda' },
    { title: 'LOTE', field: 'lote' },
    { title: 'CADUCIDAD', field: 'show_caducidad' },
  ]

  const optionsRegistroDetail = {
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
              actions={actions}
              columns={columnsRegistroDetalles}
              data={rowData.surtidos}
              options={optionsRegistroDetail} />
          </Fragment>
        )
      },
    }
  ];

  const handleChange = (event, index) => {
    let faltantes = findRegistro.faltantes;
    const cant = event.target.value;
    const current = cant > 0 ? (cant > registros[index].stock_salida ? registros[index].stock_salida : cant ) : 0
    registros.forEach((reg, ind) => {
      faltantes -= ind === index ? 0 : reg.cantidad
    })
    const cantidad = current > faltantes ? faltantes : current
    registros[index] = { ...registros[index], cantidad: cantidad }
    setRegistro({
      ...registro,
      cantidad: cantidad
    });
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

  const loadUnidades = async () => {
    const response = await showAllUnidades();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const resUnidades = response.data;
      setUnidades(resUnidades);
    }
  }

  const loadAlmacenes = async () => {
    setIsLoading(true);
    const response = await showAllAlmacens();
    if (`${response.status}` === responseCodeOK) {
      setAlmacenes(response.data);
    }
    setIsLoading(false);
  }

  const loadProductos = async () => {
    setIsLoading(true);
    const response = await showAllProductos();
    if (`${response.status}` === responseCodeOK) {
      setProductos(response.data);
    }
    setIsLoading(false);
  }

  const handleClickGuardar = async (values) => {
    await createTraspaso(values)
    loadSolicitudesEnviadas()
    loadSolicitudesRecibidas()
    onClose()
  }

  const handleClickEnviar = async (values) => {
    values.status = centinelaStatusEnviadoId
    values.registros.map(async (registro) => {
      const resFindLotes = await findByAlmacenProducto(almacen, registro.producto.id)
      if (`${resFindLotes.status}` === responseCodeOK) {
        const resLotes = resFindLotes.data

        registro.surtidos.map(surtido => {
          resLotes.map(async (lote) => {
            if (lote.lote === surtido.lote) {
              lote.stock_salida -= surtido.cantidad
              lote.cantidad = parseInt(lote.stock_salida / lote.contenido)
              await createExistencia(lote)
            }
          })
        })
      }
    })
    handleClickGuardar(values)
  }

  const handleChangeProducto = async (e, newValue) => {
    setLotes([]);
    setIsLoading(true);
    setRegistro({
      ...registro,
      producto: newValue,
    });
    const findRegistro = values.registros.find(reg => {
      return (newValue ? newValue.id : '') === reg.producto.id;
    });
    if (findRegistro) {
      setFindRegistro(findRegistro)
      const resFindLotes = await findByAlmacenProducto(almacen, findRegistro.producto.id)
      if (`${resFindLotes.status}` === responseCodeOK) {
        const lotes = resFindLotes.data.filter(lote => {
          return lote.cantidad > 0
        })
        if (lotes.length === 0) {
          setSeverity(`error`);
          setMessage(`NO HAY "${findRegistro.producto.codigo} - ${findRegistro.producto.descripcion}" EN EXISTENCIAS`)
          setOpenAlert(true)
        } else {
          lotes.map((lote, index) => {
            lote.registroTraspaso = findRegistro.id
            lote.caducidad_show = lote.caducidad ? dateToString(lote.caducidad) : 'SIN CADUCIDAD'
            lote.stock_salida_show = `${lote.stock_salida} (${lote.unidad_salida.descripcion})`
            lote.costo_unidad_salida_moneda = toFormatterCurrency(lote.costo_unidad_salida)
            lote.unidad = findRegistro.unidad
            registros[index] = {
              ...lote,
              cantidad: 0,
            }
          })
          setLotes(lotes);
        }
      }
    } else {
      setSeverity(`error`);
      setMessage(`NO SE ENCONTRO EL PRODUCTO`);
      setOpenAlert(newValue ? true : false);
    }
    setIsLoading(false);
  };

  const handleClickEmpacar = async (registros) => {
    setIsLoading(true)
    const nuevosRegistros = registros.filter(reg => {
      return reg.cantidad > 0
    })
    nuevosRegistros.forEach(async (nuevoRegistro) => {
      nuevoRegistro.existencia_id = nuevoRegistro.id
      delete nuevoRegistro.id
      nuevoRegistro.costo = nuevoRegistro.costo_unidad_salida
      const response = await createSurtidoTraspaso(nuevoRegistro)
      if (`${response.status}` === responseCodeCreate) {
        loadAll()
      }
    })
    handleChangeProducto()
    setIsLoading(false);
  }

  const loadAll = async () => {
    setIsLoading(true);
    findTraspaso();
    loadAlmacenes();
    loadUnidades();
    loadProductos();
    setIsLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <FormAsignarTraspasos
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            values={values}
            open={open}
            onClickCancel={onClose}
            onClickGuardar={handleClickGuardar}
            onClickEnviar={handleClickEnviar}
            onChange={handleChange}
            onChangeProducto={handleChangeProducto}
            onClickEmpacar={handleClickEmpacar}
            detailRegistroPanel={detailRegistroPanel}
            isLoading={isLoading}
            productos={productos}
            almacenes={almacenes}
            unidades={unidades}
            titulo={titulo}
            columns={columns}
            registro={registro}
            registros={registros}
            options={options}
            openLotes={openLotes}
            lotes={lotes}
            colorBase={colorBase} />
          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }

    </Fragment>
  );
}

export default ModalAsignarTraspasos;