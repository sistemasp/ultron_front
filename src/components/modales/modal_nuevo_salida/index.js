import React, { useState, useEffect } from 'react';
import ModalFormNuevoSalida from './ModalFormNuevoSalida';
import {
  showAllTipoSalidas,
} from "../../../services";
import {
  createSalida,
} from "../../../services/salidas";

const ModalNuevoSalida = (props) => {
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

  const efectivoMetodoPagoId = process.env.REACT_APP_FORMA_PAGO_EFECTIVO;

  const [values, setValues] = useState({
    recepcionista: empleado._id,
    sucursal: sucursal,
    forma_pago: efectivoMetodoPagoId,
    turno: corte.turno === 'm' ? 'MATUTINO' : 'VESPERTINO',
    tipo_salida: '',
  });

  const [previousTipoSalida, setPreviousTipoSalida] = useState();
  const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false);

  const [tipoSalidas, setTipoSalidas] = useState([]);

  const dataComplete = !values.concepto || !values.cantidad || !values.tipo_salida || !values.forma_pago;

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value.toUpperCase()
    });
  }

  const handleChangeTipoSalida = (e) => {
    setPreviousTipoSalida(values.tipo_salida);
    const tipoSalida = tipoSalidas.find(item => {
      return item._id === e.target.value
    });
    //setOpenModalConfirmacion(tipoSalida.confirmacion);
    setValues({
      ...values,
      tipo_salida: tipoSalida._id
    });
  }

  const handleAgregarSalida = async () => {
    const create_date = new Date();
    create_date.setHours(create_date.getHours());
    values.create_date = create_date;
    values.hora_aplicacion = corte.hora_apertura;
    const response = await createSalida(values);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      setSeverity('success');
      setMessage("EGRESO AGREGADO CORRECTAMENTE");
      setOpenAlert(true);
      onClose();
      onObtenerInformacion();
    }
  }

  const handleConfirmModalConfirmacion = () => {
    setOpenModalConfirmacion(false);
  }

  const handleCloseModalConfirmacion = () => {
    setOpenModalConfirmacion(false);
    setValues({ ...values, tipo_salida: previousTipoSalida });
  }

  useEffect(() => {

    const loadTipoSalida = async () => {
      const response = await showAllTipoSalidas();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setTipoSalidas(response.data);
      }
    }

    loadTipoSalida();
  }, []);

  return (
    <ModalFormNuevoSalida
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      onClickCancel={onClose}
      dataComplete={dataComplete}
      values={values}
      empleado={empleado}
      tipoSalidas={tipoSalidas}
      previousTipoSalida={previousTipoSalida}
      openModalConfirmacion={openModalConfirmacion}
      onCloseModalConfirmacion={handleCloseModalConfirmacion}
      onConfirmModalConfirmacion={handleConfirmModalConfirmacion}
      onAgregarSalida={handleAgregarSalida}
      onChange={handleChange}
      onChangeTipoSalida={(e) => handleChangeTipoSalida(e)}
      {...props} />
  );
}

export default ModalNuevoSalida;