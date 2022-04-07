import React, { useEffect, useState } from 'react';
import { Backdrop, CircularProgress, FormControl, MenuItem, Select } from '@material-ui/core';
import { Fragment } from 'react';
import FormTraspasos from './FormTraspasos';
import myStyles from '../../../../css';
import { createFactura, deleteFactura, findFacturaById, updateFactura } from '../../../../services/centinela/facturas';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { showAllProductos } from '../../../../services/centinela/productos';
import { showAllProveedors } from '../../../../services/centinela/proveedores';
import { showAllUnidades } from '../../../../services/centinela/unidades';
import { createRegistroFactura } from '../../../../services/centinela/registrofacturas';
import { responseCodeCreate, responseCodeOK } from '../../../../utils/constants';
import { toFormatterCurrency } from '../../../../utils/utils';

const ModalTraspasos = (props) => {

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
    { title: 'PIEZAS', field: 'piezas' },
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

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value.toUpperCase()
    });
  }

  const findFactura = async () => {
    setIsLoading(true);
    setIsLoading(false);

  }

  const loadAll = async () => {
    setIsLoading(true);
    setIsLoading(false);
  }

  const handleClickGuardar = async (values) => {
    onClose();
  }

  const handleClickActualizar = async (values) => {

  }

  const handleChangeFechaCaducidad = async (date) => {

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
          <FormTraspasos
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            values={values}
            open={open}
            onClickCancel={onClose}
            onClickGuardar={handleClickGuardar}
            onClickActualizar={handleClickActualizar}
            onChange={handleChange}
            onClickAgregar={handleClickAgregar}
            onChangeFechaCaducidad={(e) => handleChangeFechaCaducidad(e)}
            onChangeFecha={(e) => handleChangeFecha(e)}
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

export default ModalTraspasos;