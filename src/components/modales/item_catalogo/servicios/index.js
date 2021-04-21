import React, { useState, useEffect } from 'react';
import FormItemCatalogo from './FormItemServicio';
import { Fragment } from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import myStyles from '../../../../css';

const ItemServicio = (props) => {

  const classes = myStyles();

  const {
    open,
    onClose,
    item,
    catalogo,
    setMessage,
    setSeverity,
    setOpenAlert,
  } = props;

  const [isLoading, setIsLoading] = useState(true);

  const [values, setValues] = useState({
    _id: item._id,
    nombre: item.nombre,
    clave: item.clave,
    color: item.color,
    is_active: item.is_active,
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value.toUpperCase()
    });
  }

  const handleChangeActive = (event) => {
    setValues({
      ...values,
      is_active: !values.is_active
    });
  }

  const loadAll = async () => {
    setIsLoading(true);

    setIsLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  const handleGuardarItem = async (event, newItem) => {
    setIsLoading(true);
    let response = item._id ? "" : "";     

    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
      || `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      setSeverity('success');
      setOpenAlert(true);
      setMessage(item._id ? 'REGISTRO ACTUALIZADO CORRECTAMENTE' : 'REGISTRO CREADO CORRECTAMENTE');
    }

    setIsLoading(false);
  }

  return (
    <Fragment>
      {
        !isLoading ?
          <FormItemCatalogo
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            values={values}
            open={open}
            onClickCancel={onClose}
            onChange={handleChange}
            onChangeActive={handleChangeActive}
            onGuardarItem={handleGuardarItem}
            catalogo={catalogo}
          />
          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>


  );
}

export default ItemServicio;