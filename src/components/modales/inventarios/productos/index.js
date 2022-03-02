import React, { useEffect, useState } from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { Fragment } from 'react';
import FormProductos from './FormProductos';
import myStyles from '../../../../css';
import { createProducto, updateProducto } from '../../../../services/centinela/productos';

const ModalProductos = (props) => {

  const {
    open,
    onClose,
    loadProductos,
    empleado,
    setOpenAlert,
    setMessage,
    sucursal,
    colorBase,
    token,
    producto,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState(producto);

  console.log("KAOZ", values);

  const classes = myStyles(colorBase)();

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value.toUpperCase()
    });
  }

  const loadAll = async () => {
    setIsLoading(true);

    setIsLoading(false);
  }

  const handleClickGuardar = async (values) => {
    setIsLoading(true);
    const response = values.id ? await createProducto(values) : await updateProducto(values.id, values);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
      || `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      loadProductos();
      onClose();
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <FormProductos
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            values={values}
            open={open}
            onClickCancel={onClose}
            onClickGuardar={handleClickGuardar}
            onChange={handleChange} />
          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }

    </Fragment>
  );
}

export default ModalProductos;