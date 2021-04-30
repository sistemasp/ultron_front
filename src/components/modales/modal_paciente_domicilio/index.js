import { Backdrop, CircularProgress } from '@material-ui/core';
import React, { useState, useEffect, Fragment } from 'react';
import myStyles from '../../../css';
import { 
  updatePatient
} from '../../../services/pacientes';
import { showAllOcupacions } from '../../../services/ocupacion';
import {
  sepomexGetEstados,
  sepomexGetMunicipos,
  sepomexGetColonia,
  sepomexGetAllInfoByCP,
} from '../../../services/sepomex';
import ModalFormPacienteDomicilio from './ModalFormPacienteDomicilio';

const ModalPacienteDomicilio = (props) => {

  const classes = myStyles();

  const {
    open,
    dermatologo,
    onClose,
    sucursal,
    paciente,
    setMessage,
    setSeverity,
    setOpenAlert,
    findConsultorio,
  } = props;

  const [ocupaciones, setOcupaciones] = useState([]);
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [colonias, setColonias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [values, setValues] = useState({
    _id: paciente._id,
    nombres: paciente.nombres,
    apellidos: paciente.apellidos,
    telefono: paciente.telefono,
    sexo: paciente.sexo,
    email: paciente.email,
    fecha_nacimiento: paciente.fecha_nacimiento ? paciente.fecha_nacimiento : '',
    domicilio: paciente.domicilio,
    numero_exterior: paciente.numero_exterior,
    numero_interior: paciente.numero_interior,
    colonia: paciente.colonia,
    ciudad: paciente.ciudad,
    municipio: paciente.municipio,
    estado: paciente.estado,
    codigo_postal: paciente.codigo_postal,
  });

  const loadMunicipios = async (estado) => {
    const response = await sepomexGetMunicipos(estado);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setMunicipios(response.data.response.municipios);
    }
  }

  const loadColonias = async (municipio) => {
    const response = await sepomexGetColonia(municipio);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setColonias(response.data.response.colonia);
    }
  }

  const loadOcupaciones = async () => {
    const response = await showAllOcupacions();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setOcupaciones(response.data);
    }
  }

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value.toUpperCase()
    });
  }

  const handleChangeSelect = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  }

  const handleClickBuscar = async () => {
    const response = await sepomexGetAllInfoByCP(values.codigo_postal);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const res = response.data.response;
      setEstados([res.estado]);
      setMunicipios([res.municipio]);
      setColonias(res.asentamiento);
      setValues({
        ...values,
        estado: res.estado.toUpperCase(),
        municipio: res.municipio.toUpperCase(),
        ciudad: res.ciudad.toUpperCase(),
      });
    } else {
      setOpenAlert(true);
      setSeverity('warning');
      setMessage(response.descripcion.response.data.error_message);
    }
  }

  const handleChangeEstado = async (event) => {
    setValues({ ...values, estado: event.target.value.toUpperCase() });
    await loadMunicipios(event.target.value);
  }

  const handleChangeMunicipio = async (event) => {
    setValues({ ...values, municipio: event.target.value.toUpperCase() });
    await loadColonias(event.target.value);
  }

  const handleChangeColonia = (event) => {
    setValues({ ...values, colonia: event.target.value.toUpperCase() });
  }

  const handleClickGuardar = async (e) => {
    values.codigo_postal = values.codigo_postal ? values.codigo_postal : 'SCP';

    const response = await updatePatient(paciente._id, values, dermatologo.access_token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setSeverity('success');
      setOpenAlert(true);
      findConsultorio();
      setMessage('PACIENTE ACTUALIZADO CORRECTAMENTE');
    }

    onClose();
  }

  const loadEstados = async () => {
    const response = await sepomexGetEstados();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setEstados(response.data.response.estado);
    }
  }

  const loadAll = async () => {
    setIsLoading(true);
    await loadEstados();
    await loadOcupaciones();
    setIsLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormPacienteDomicilio
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            values={values}
            onClickCancel={onClose}
            paciente={paciente}
            estados={estados}
            municipios={municipios}
            ciudades={ciudades}
            colonias={colonias}
            onChangeSelect={handleChangeSelect}
            ocupaciones={ocupaciones}
            onChange={handleChange}
            onChangeEstado={handleChangeEstado}
            onChangeMunicipio={handleChangeMunicipio}
            onChangeColonia={handleChangeColonia}
            onClickBuscar={handleClickBuscar}
            onClickGuardar={handleClickGuardar} />
          :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>
  );
}

export default ModalPacienteDomicilio;