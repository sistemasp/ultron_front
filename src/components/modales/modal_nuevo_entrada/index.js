import React, { useState, useEffect } from 'react';
import ModalFormNuevoEntrada from './ModalFormNuevoEntrada';
import {
  showAllTipoEntradas,
  showAllMetodoPago,
} from "../../../services";
import {
  createEntrada,
} from "../../../services/entradas";

const ModalNuevoEntrada = (props) => {
  const {
    open,
    onClose,
    empleado,
    sucursal,
    setMessage,
    setSeverity,
    setOpenAlert,
    onObtenerInformacion,
    corte,
  } = props;

  const [values, setValues] = useState({
    recepcionista: empleado._id,
    sucursal: sucursal,
    turno: corte.turno === 'm' ? 'MATUTINO' : 'VESPERTINO',
  });

  const [tipoEntradas, setTipoEntradas] = useState([]);
  const [formaPagos, setMetodoPagos] = useState([]);

  const dataComplete = !values.concepto || !values.cantidad || !values.tipo_entrada || !values.forma_pago;

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value.toUpperCase()
    });
  }

  const handleChangeTipoEntrada = (e) => {
    setValues({
      ...values,
      tipo_entrada: e.target.value
    });
  }

  const handleChangeMetodoPago = (e) => {
    setValues({
      ...values,
      forma_pago: e.target.value
    });
  }

  const handleAgregarConceto = async () => {
    const create_date = new Date();
    create_date.setHours(create_date.getHours());
    values.create_date = create_date;
    values.hora_aplicacion = corte.hora_apertura;
    const response = await createEntrada(values);
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
          setSeverity('success');
          setMessage("INGRESO AGREGADO CORRECTAMENTE");
          setOpenAlert(true);
          onClose();
          onObtenerInformacion();
        }
  }

  useEffect(() => {

    const loadTipoEntrada = async () => {
      const response = await showAllTipoEntradas();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setTipoEntradas(response.data);
      }
    }

    const loadMetodoPago = async () => {
      const response = await showAllMetodoPago();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setMetodoPagos(response.data);
      }
    }

    loadTipoEntrada();
    loadMetodoPago();
  }, []);

  return (
    <ModalFormNuevoEntrada
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      onClickCancel={onClose}
      dataComplete={dataComplete}
      values={values}
      tipoEntradas={tipoEntradas}
      formaPagos={formaPagos}
      onAgregarConceto={handleAgregarConceto}
      onChange={handleChange}
      onChangeTipoEntrada={(e) => handleChangeTipoEntrada(e)}
      onChangeMetodoPago={(e) => handleChangeMetodoPago(e)}
      {...props} />
  );
}

export default ModalNuevoEntrada;