import React, { useEffect, useState } from 'react';
import { Backdrop, CircularProgress, FormControl, MenuItem, Select } from '@material-ui/core';
import { Fragment } from 'react';
import FormFacturas from './FormFacturas';
import myStyles from '../../../../css';
import { createFactura, updateFactura } from '../../../../services/centinela/facturas';
import EditIcon from '@material-ui/icons/Edit';
import { showAllProductos } from '../../../../services/centinela/productos';
import { showAllProveedors } from '../../../../services/centinela/proveedores';
import { showAllUnidades } from '../../../../services/centinela/unidades';
import { createRegistro } from '../../../../services/centinela/registros';
import { responseCodeCreate, responseCodeOK } from '../../../../utils/constants';

const ModalFacturas = (props) => {

  const {
    open,
    onClose,
    loadFacturas,
    empleado,
    setOpenAlert,
    setMessage,
    sucursal,
    colorBase,
    token,
    factura,
  } = props;

  const titulo = "REGISTROS";

  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState(factura);
  const [registros, setRegistros] = useState([]);
  const [registro, setRegistro] = useState({});
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [unidades, setUnidades] = useState([]);

  const classes = myStyles(colorBase)();

  const columns = [
    { title: 'CÓDIGO', field: 'producto.codigo' },
    { title: 'DESCRIPCIÓN', field: 'producto.descripcion' },
    { title: 'PIEZAS', field: 'piezas' },
    { title: 'COSTO', field: 'costo_moneda' },
    { title: 'COSTO UNITARIO', field: 'costo_unitario_moneda' },
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
      fontSize: '18px'
    },
    cellStyle: {
      fontWeight: 'bolder',
      fontSize: '16px',
      padding: '5px',
      textAlign: 'center',
    },
    paging: false,
  }

  const actions = [
    {
      icon: EditIcon,
      tooltip: 'EDITAR',
      onClick: {}
    },
  ];

  const handleOnClickEditar = (e, rowData) => {

  }

  const onChangeActions = (e, rowData) => {
    const action = e.target.value;
    switch (action) {
      case 'EDITAR':
        handleOnClickEditar(e, rowData);
        break;
    }
  }

  const components = {
    Actions: props => {
      return props.actions.length > 0
        ? <Fragment>
          <FormControl variant="outlined" className={classes.formControl}>
            <Select
              labelId="simple-select-outlined-actions"
              id="simple-select-outlined-actions"
              onChange={(e) => onChangeActions(e, props.data)}
              label="ACCIONES">
              {
                props.actions.map((item, index) => {
                  return <MenuItem
                    key={index}
                    value={item.tooltip}
                  >{item.tooltip}</MenuItem>
                })
              }
            </Select>
          </FormControl>
        </Fragment>
        : ''
    }
  };

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


  const loadAll = async () => {
    setIsLoading(true);
    await loadProductos();
    await loadProveedores();
    await loadUnidades();
    setIsLoading(false);
  }

  const handleClickGuardar = async (values) => {
    setIsLoading(true);
    const response = values.id ? await createFactura(values) : await updateFactura(values.id, values);
    if (`${response.status}` === responseCodeOK
      || `${response.status}` === responseCodeCreate) {
      loadFacturas();
      onClose();
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

  const handleClickAgregar = async (registro) => {
    registro.factura = factura.id;
    registros.push(registro);
    const resRegistro = await createRegistro(registro);
    if (`${resRegistro.status}` === responseCodeCreate) {
      const newRegistro = resRegistro.data;
    }
    setRegistros(registros);
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
            onChange={handleChange}
            onChangeRegistro={handleChangeRegistro}
            onClickAgregar={handleClickAgregar}
            onChangeProveedor={handleChangeProveedor}
            onChangeProducto={handleChangeProducto}
            onChangeUnidadEntrada={handleChangeUnidadEntrada}
            onChangeUnidadSalida={handleChangeUnidadSalida}
            onChangeFechaCaducidad={(e) => handleChangeFechaCaducidad(e)}
            isLoading={isLoading}
            productos={productos}
            proveedores={proveedores}
            unidades={unidades}
            titulo={titulo}
            columns={columns}
            registros={registros}
            registro={registro}
            actions={actions}
            options={options}
            components={components} />
          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }

    </Fragment>
  );
}

export default ModalFacturas;