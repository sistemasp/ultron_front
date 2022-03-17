import React, { useEffect, useState } from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { Fragment } from 'react';
import FormFacturas from './FormFacturas';
import myStyles from '../../../../css';
import { createFactura, updateFactura } from '../../../../services/centinela/facturas';

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

  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState(factura);

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
    const response = values.id ? await createFactura(values) : await updateFactura(values.id, values);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
      || `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      loadFacturas();
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
          <FormFacturas
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

export default ModalFacturas;