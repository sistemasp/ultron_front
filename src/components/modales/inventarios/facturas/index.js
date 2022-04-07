import React, { useEffect, useState } from 'react';
import { Backdrop, CircularProgress, FormControl, MenuItem, Select } from '@material-ui/core';
import { Fragment } from 'react';
import FormFacturas from './FormFacturas';
import myStyles from '../../../../css';
import { createFactura, deleteFactura, findFacturaById, updateFactura } from '../../../../services/centinela/facturas';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { showAllProductos } from '../../../../services/centinela/productos';
import { showAllProveedors } from '../../../../services/centinela/proveedores';
import { showAllUnidades } from '../../../../services/centinela/unidades';
import { createRegistroFactura } from '../../../../services/centinela/registrofacturas';
import { responseCodeCreate, responseCodeOK } from '../../../../utils/constants';
import { toFormatterCurrency } from '../../../../utils/utils';

const ModalFacturas = (props) => {

  const {
    open,
    onClose,
    loadFacturas,
    colorBase,
    factura,
  } = props;

  const titulo = "REGISTROS";

  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({});
  const [registro, setRegistro] = useState({});
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [unidades, setUnidades] = useState([]);

  const classes = myStyles(colorBase)();

  const columns = [
    { title: 'CÓDIGO', field: 'producto.codigo' },
    { title: 'DESCRIPCIÓN', field: 'producto.descripcion' },
    { title: 'CANTIDAD', field: 'cantidad_show' },
    { title: 'COSTO UNITARIO', field: 'costo_unitario_moneda' },
    { title: 'COSTO', field: 'costo_moneda' },
  ];

  const options = {
    // rowStyle: rowData => {
    //   return {
    //     color: rowData.status.color,
    //     backgroundColor: rowData.pagado ? process.env.REACT_APP_PAGADO_COLOR : ''
    //   };
    // },
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

  const handleOnClickEliminar = async (e, rowData) => {
    const response = await deleteFactura(rowData.id);
    if (`${response.status}` === responseCodeOK) {
      findFactura();
    }
  }

  const actions = [
    {
      icon: DeleteForeverIcon,
      tooltip: 'ELIMINAR',
      onClick: handleOnClickEliminar
    },
  ];


  const loadProductos = async () => {
    const response = await showAllProductos();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const resProductos = response.data;
      setProductos(resProductos);
    }
  }

  const loadProveedores = async () => {
    const response = await showAllProveedors();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const resProveedores = response.data;
      setProveedores(resProveedores);
    }
  }

  const loadUnidades = async () => {
    const response = await showAllUnidades();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const resUnidades = response.data;
      setUnidades(resUnidades);
    }
  }

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value.toUpperCase()
    });
  }

  const handleChangeRegistro = (e) => {
    setRegistro({
      ...registro,
      [e.target.name]: e.target.value.toUpperCase()
    });
  }

  const handleChangeProveedor = (e, newValue) => {
    setIsLoading(true);
    setValues({
      ...values,
      proveedor: newValue,
    });
    setIsLoading(false);
  };

  const handleChangeProducto = (e, newValue) => {
    setIsLoading(true);
    setRegistro({
      ...registro,
      producto: newValue,
    });
    setIsLoading(false);
  };

  const handleChangeUnidadEntrada = (e, newValue) => {
    setIsLoading(true);
    setRegistro({
      ...registro,
      unidad_entrada: newValue,
    });
    setIsLoading(false);
  };

  const handleChangeUnidadSalida = (e, newValue) => {
    setIsLoading(true);
    setRegistro({
      ...registro,
      unidad_salida: newValue,
    });
    setIsLoading(false);
  };

  const handleChangSinCaducidad = (event) => {
    const newValue = !registro.sin_caducidad;
    setRegistro({
      ...registro,
      sin_caducidad: newValue,
    });
    if (newValue) {
      delete registro.caducidad;
    }
  }

  const findFactura = async () => {
    setIsLoading(true);
    const response = await findFacturaById(factura.id);
    if (`${response.status}` === responseCodeOK) {
      const resFactura = response.data;
      let total = 0;
      resFactura.registros.map(item => {
        total += item.costo;
        item.costo_moneda = toFormatterCurrency(item.costo);
        item.costo_unitario_moneda = toFormatterCurrency(item.costo / item.cantidad);
        item.cantidad_show = `${item.cantidad} (${item.unidad_entrada.descripcion})`;
      });
      resFactura.total = total;
      setValues(resFactura);
      setIsLoading(false);
    }
  }

  const loadAll = async () => {
    setIsLoading(true);
    await findFactura();
    await loadProductos();
    await loadProveedores();
    await loadUnidades();
    setIsLoading(false);
  }

  const handleClickGuardar = async (values) => {
    setIsLoading(true);
    const response = await createFactura(values);
    // const response = !values.id ? await createFactura(values) : await updateFactura(values.id, values);
    if (`${response.status}` === responseCodeOK
      || `${response.status}` === responseCodeCreate) {
      loadFacturas();
      onClose();
      setIsLoading(false);
    }
  }

  const handleClickActualizar = async (values) => {
    setIsLoading(true);
    const response = await createFactura(values);
    // const response = !values.id ? await createFactura(values) : await updateFactura(values.id, values);
    if (`${response.status}` === responseCodeOK
      || `${response.status}` === responseCodeCreate) {
      findFactura();
      setIsLoading(false);
    }
  }

  const handleChangeFechaCaducidad = async (date) => {
    setIsLoading(true);
    setRegistro({
      ...registro,
      caducidad: date,
    });
    setIsLoading(false);
  };

  const handleChangeFecha = async (date) => {
    setIsLoading(true);
    setValues({
      ...values,
      fecha: date,
    });
    setIsLoading(false);
  };


  const handleClickAgregar = async (registro) => {
    registro.factura = factura.id;
    const resRegistro = await createRegistroFactura(registro);
    if (`${resRegistro.status}` === responseCodeCreate) {
      await createFactura(values);
      // setRegistro({
      //   piezas: '',
      //   producto: {},
      //   costo: '',
      //   unidad_entrada: {},
      //   contenido: '',
      //   unidad_salida: {},
      //   lote: '',
      //   caducidad: '',
      //   sin_caducidad: false,
      // });
      findFactura();
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <FormFacturas
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            values={values}
            open={open}
            onClickCancel={onClose}
            onClickGuardar={handleClickGuardar}
            onClickActualizar={handleClickActualizar}
            onChange={handleChange}
            onChangeRegistro={handleChangeRegistro}
            onClickAgregar={handleClickAgregar}
            onChangeProveedor={handleChangeProveedor}
            onChangeProducto={handleChangeProducto}
            onChangeUnidadEntrada={handleChangeUnidadEntrada}
            onChangeUnidadSalida={handleChangeUnidadSalida}
            onChangeFechaCaducidad={(e) => handleChangeFechaCaducidad(e)}
            onChangeFecha={(e) => handleChangeFecha(e)}
            onChangSinCaducidad={(e) => handleChangSinCaducidad(e)}
            isLoading={isLoading}
            productos={productos}
            proveedores={proveedores}
            unidades={unidades}
            titulo={titulo}
            columns={columns}
            registro={registro}
            // actions={actions}
            options={options} />
          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }

    </Fragment>
  );
}

export default ModalFacturas;