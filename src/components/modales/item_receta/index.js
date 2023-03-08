import React, { useState, useEffect } from 'react';
import FormItemReceta from './FormItemReceta';
import {
  showAllSexos,
} from "../../../services";
import { createLaboratorio, showAllLaboratorios, updateLaboratorio } from '../../../services/laboratorios';
import { Fragment } from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import myStyles from '../../../css';
import { showAllProductoComercials, showProductoComercialByLaboratorioId, updateProductoComercial } from '../../../services/productos_comerciales';

const ModalItemReceta = (props) => {


  const {
    open,
    onClose,
    producto,
    onAgregarProducto,
    colorBase,
  } = props;

  const classes = myStyles(colorBase)();

  const [isLoading, setIsLoading] = useState(true);

  const [values, setValues] = useState({
    recomendacion: producto.recomendacion,
    laboratorio: { _id: producto.laboratorio ? producto.laboratorio._id : undefined },
    producto: { _id: producto.producto ? producto.producto._id : undefined },
  });

  const [laboratorios, setLaboratorios] = useState([]);
  const [productos, setProductos] = useState([]);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value.toUpperCase()
    });
  }

  const loadProductosComerciales = async () => {
    const response = await showAllProductoComercials();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setProductos(response.data);
    }
  }

  // const handleChangeLaboratorio = async (event, newValue) => {
  //   await loadProductosComerciales(newValue._id);
  //   setValues({
  //     ...values,
  //     laboratorio: { _id: newValue }
  //   });
  // }

  const handleChangeProducto = async (event, newValue) => {
    setValues({
      ...values,
      producto: { _id: newValue },
      laboratorio: { _id: newValue.laboratorio }
    });
  }

  // const loadLaboratorios = async () => {
  //   const response = await showAllLaboratorios();
  //   if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
  //     setLaboratorios(response.data);
  //   }
  // }

  const loadAll = async () => {
    setIsLoading(true);
    await loadProductosComerciales();
    setIsLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <FormItemReceta
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            values={values}
            open={open}
            onClickCancel={onClose}
            onChange={handleChange}
            // onChangeLaboratorio={handleChangeLaboratorio}
            onChangeProducto={handleChangeProducto}
            onAgregarProducto={onAgregarProducto}
            laboratorios={laboratorios}
            productos={productos}
          />
          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>


  );
}

export default ModalItemReceta;