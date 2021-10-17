import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import { Formik } from 'formik';
import {
  updateSalaCuracion,
  findSalaCuracionBySucursalIdAndFree,
} from '../../../services';
import {
  findCuracionById,
  updateCuracion,
} from '../../../services/curaciones';
import {
  findEsteticaById,
  updateEstetica,
} from '../../../services/esteticas';
import { addZero } from '../../../utils/utils';
import ModalFormCuracionAgregarPaciente from './ModalFormCuracionAgregarPaciente';

const validationSchema = Yup.object({
  nombre: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos")
});

const ModalCuracionAgregarPaciente = (props) => {
  const {
    open,
    onClose,
    tipo_servicio,
    servicio,
    setOpenAlert,
    setMessage,
    loadAll,
    sucursal,
    cambio,
    paciente,
    empleado,
    colorBase,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [salaCuraciones, setSalaCuraciones] = useState([]);
  const [currentService, setCurrentService] = useState({});
  //const [consulta, setConsulta] = useState();
  //const [cita, setCita] = useState();

  const [values, setValues] = useState({
  });

  const enSalaCuracionStatusId = process.env.REACT_APP_EN_SALA_CURACION_STATUS_ID;
  const curacionServicioId = process.env.REACT_APP_CURACION_SERVICIO_ID;

  const handleClickGuardar = async (event, rowData) => {
    setIsLoading(true);

    if (!cambio) {
      const dateNow = new Date();
      let updateData = currentService;
      updateData.status = enSalaCuracionStatusId;
      updateData.hora_atencion = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
      tipo_servicio === curacionServicioId ? await updateCuracion(currentService._id, updateData, empleado.access_token) : updateEstetica(currentService._id, updateData, empleado.access_token, empleado.access_token);
    }

    setValues({ sala_curacion: { paciente: currentService.paciente._id } });
    let salaCuracion = values.sala_curacion;
    salaCuracion.curacion = currentService._id;
    salaCuracion.dermatologo = currentService.dermatologo;
    salaCuracion.paciente = paciente._id;
    salaCuracion.tipo_servicio = tipo_servicio;
    salaCuracion.servicio = servicio;
    salaCuracion.disponible = false;

    const response = await updateSalaCuracion(salaCuracion._id, salaCuracion, empleado.access_token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setOpenAlert(true);
      setMessage('EL PACIENTE ENTRO A LA SALA DE CURACIÓN');
    }

    onClose();
    await loadAll();
    setIsLoading(false);
  }

  const handleChangeSalaCuracion = (event) => {
    setValues({ sala_curacion: event.target.value });
  }

  useEffect(() => {
    const loadCabinasDisponibles = async () => {
      const response = await findSalaCuracionBySucursalIdAndFree(sucursal, empleado.access_token);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setSalaCuraciones(response.data);
      }
    }

    const getCurrentService = async () => {
      const responseServicio = tipo_servicio === curacionServicioId ? await findCuracionById(servicio, empleado.access_token) : await findEsteticaById(servicio, empleado.access_token);
      if (`${responseServicio.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        const currentService = responseServicio.data;
        setCurrentService(currentService);
      }
    }

    loadCabinasDisponibles();
    getCurrentService();
    setIsLoading(false);

  }, [sucursal]);

  return (
    <Formik
      enableReinitialize
      initialValues={values}
      validationSchema={validationSchema} >
      {
        props => <ModalFormCuracionAgregarPaciente
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClickCancel={onClose}
          onClickGuardar={handleClickGuardar}
          isLoading={isLoading}
          salaCuraciones={salaCuraciones}
          onChangeSalaCuracion={(e) => handleChangeSalaCuracion(e)}
          cambio={cambio}
          paciente={paciente}
          colorBase={colorBase}
          {...props} />
      }
    </Formik>
  );
}

export default ModalCuracionAgregarPaciente;