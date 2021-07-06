import React, { useState, useEffect } from 'react';
import ModalFormPaciente from './ModalFormPaciente';
import {
  showAllSexos,
} from "../../../services";

const ModalPaciente = (props) => {
  const {
    open,
    onClose,
    paciente,
    onClickGuardar,
    onClickGuardarAgendar,
    colorBase,
  } = props;

  const [sexos, setSexos] = useState([]);

  const [values, setValues] = useState({
    _id: paciente._id,
    nombres: paciente.nombres,
    apellidos: paciente.apellidos,
    telefono: paciente.telefono,
    email: paciente.email,
    sexo: paciente.sexo ? paciente.sexo._id : '',
    fecha_nacimiento: paciente.fecha_nacimiento ? paciente.fecha_nacimiento : '',
    familiar: false,
  });

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value.toUpperCase()
    });
  }

  const handleChangeSexo = (e) => {
    setValues({
      ...values,
      sexo: e.target.value
    })
  }

  const handleChangeEmail = (e) => {
    setValues({
      ...values,
      email: e.target.value
    })
  }

  const handleChangeFamiliar = (e) => {
    setValues({
      ...values,
      familiar: !values.familiar
    })
  }

  const dataComplete = !values.nombres || !values.apellidos
    || !values.sexo || !values.telefono || !values.fecha_nacimiento || values.fecha_nacimiento.length !== 10;

  const loadSexos = async () => {
    const response = await showAllSexos();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setSexos(response.data);
    }
  }

  useEffect(() => {
    loadSexos();
  }, []);

  return (
    <ModalFormPaciente
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      values={values}
      onClickCancel={onClose}
      paciente={paciente}
      onClickGuardar={onClickGuardar}
      onClickGuardarAgendar={onClickGuardarAgendar}
      dataComplete={dataComplete}
      onChange={handleChange}
      onChangeSexo={handleChangeSexo}
      onChangeEmail={handleChangeEmail}
      onChangeFamiliar={handleChangeFamiliar}
      colorBase={colorBase}
      sexos={sexos} />

  );
}

export default ModalPaciente;