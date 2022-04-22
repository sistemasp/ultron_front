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
import { createRegistroTraspaso, deleteRegistroTraspaso } from '../../../../services/centinela/registrotraspasos';
import { createTraspaso, findTraspasoById } from '../../../../services/centinela/traspasos';

const ModalAsignarTraspasos = (props) => {

  const {
    open,
    onClose,
    colorBase,
    traspaso,
    loadSolicitudesEnviadas,
    loadSolicitudesRecibidas,
  } = props;

  const titulo = "REGISTROS";

  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({
    ...traspaso,
  });
  const [registro, setRegistro] = useState({});
  const [almacenes, setAlmacenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [unidades, setUnidades] = useState([]);

  const classes = myStyles(colorBase)();

  const columns = [
    { title: 'CANTIDAD', field: 'cantidad' },
    { title: 'CÓDIGO', field: 'producto.codigo' },
    { title: 'DESCRIPCIÓN', field: 'producto.descripcion' },
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
    const response = await deleteRegistroTraspaso(rowData.id);
    if (`${response.status}` === responseCodeOK) {
      findTraspaso();
    }
  }

  const actions = [
    {
      icon: DeleteForeverIcon,
      tooltip: 'ELIMINAR',
      onClick: handleOnClickEliminar
    },
  ];

  const handleChange = (e) => {
    setRegistro({
      ...registro,
      [e.target.name]: e.target.value.toUpperCase()
    });
  }

  const findTraspaso = async () => {
    setIsLoading(true);
    const response = await findTraspasoById(traspaso.id);
    if (`${response.status}` === responseCodeOK) {
      const resTraspaso = response.data;
      setValues(resTraspaso);
    }
    setIsLoading(false);
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
    await createTraspaso(values);
    loadSolicitudesEnviadas();
    loadSolicitudesRecibidas();
    onClose();
  }

  const handleChangeProducto = (e, newValue) => {
    setIsLoading(true);
    setRegistro({
      ...registro,
      producto: newValue,
    });
    setIsLoading(false);
  };


  const handleChangeAlmacen = async (e, newValue) => {
    setIsLoading(true);
    const newValues = {
      ...values,
      almacen_origen: newValue,
    }
    const response = await createTraspaso(newValues);
    if (`${response.status}` === responseCodeCreate) {
      findTraspaso();
    }
  };

  const handleChangeUnidad = (e, newValue) => {
    setIsLoading(true);
    setRegistro({
      ...registro,
      unidad: newValue,
    });
    setIsLoading(false);
  };

  const handleClickAgregar = async (registro) => {
    registro.traspaso = traspaso.id;
    const resRegistro = await createRegistroTraspaso(registro);
    if (`${resRegistro.status}` === responseCodeCreate) {
      findTraspaso();
    }
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
            onChange={handleChange}
            onChangeProducto={handleChangeProducto}
            onChangeAlmacen={handleChangeAlmacen}
            onChangeUnidad={handleChangeUnidad}
            onClickAgregar={handleClickAgregar}
            isLoading={isLoading}
            productos={productos}
            almacenes={almacenes}
            unidades={unidades}
            titulo={titulo}
            columns={columns}
            registro={registro}
            actions={actions}
            options={options}
            colorBase={colorBase} />
          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }

    </Fragment>
  );
}

export default ModalAsignarTraspasos;