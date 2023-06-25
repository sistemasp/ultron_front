import React, { Fragment, useEffect, useState } from "react";
import { findSurgeryBySucursalAndDermatologoId } from "../../../services/consultorios";
import { showAllAlergias } from "../../../services/u-sgcm-ficha-clinica/alergias"
import { Snackbar, Backdrop, CircularProgress } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { FichaClinicaContainer } from "./ficha_clinica";
import { showAllSignosVitales } from "../../../services/u-sgcm-ficha-clinica/signos_vitales";
import { showAllAntecedentesPersonalesNoPatologicos } from "../../../services/u-sgcm-ficha-clinica/antecedentes_personales_no_patologicos";
import { showAllAntecedentesPersonalesPatologicos } from "../../../services/u-sgcm-ficha-clinica/antecedentes_personales_patologicos";
import { createHistoriaClinica, findHistoriaClinicaByPacienteId, updateHistoriaClinica } from "../../../services/u-sgcm-ficha-clinica/historia_clinica";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const FichaClinica = (props) => {

  const [consultorio, setConsultorio] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [openAlert, setOpenAlert] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('success')
  const [alergias, setAlergias] = useState([])
  const [signosVitales, setSignosVitales] = useState([])
  const [value, setValue] = useState(0);
  const [historiaClinica, setHistoriaClinica] = useState({})

  const {
    dermatologo,
    sucursal,
    colorBase,
  } = props;

  const classes = props;

  const handleChangeTab = (event, newValue) => {
    setValue(newValue)
  }

  const loadHistoriaClinica = async (consultorio) => {
    setIsLoading(true)
    const response = await findHistoriaClinicaByPacienteId(consultorio.paciente._id)
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const historiaClinicaResponse = response.data;

      if (!historiaClinicaResponse) {
        const requestHistoriaClinica = {
          paciente: consultorio.paciente._id,
          sucursal: consultorio.sucursal,
          dermatologo: consultorio.dermatologo._id,
        }
        const responseCreateHistoriaClinica = await createHistoriaClinica(requestHistoriaClinica)
        if (`${responseCreateHistoriaClinica.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
          setHistoriaClinica(responseCreateHistoriaClinica.data)
        }
      } else {
        setHistoriaClinica(historiaClinicaResponse)
      }
    }
    setIsLoading(false)
  }

  const findConsultorio = async () => {
    setIsLoading(true)
    const response = await findSurgeryBySucursalAndDermatologoId(sucursal._id, dermatologo._id)
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const consultorio = response.data
      if (consultorio) {
        setConsultorio(consultorio)
        if (consultorio.paciente) {
          loadHistoriaClinica(consultorio)
        }
      }
    }
  }

  const handleCloseAlert = () => {
    setOpenAlert(false);
  }

  const commitHistoriaClinica = async() => {
    const response = await updateHistoriaClinica(historiaClinica._id, historiaClinica)
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      findConsultorio()
    }
  }

  const loadAll = () => {
    findConsultorio()
  }
  

  useEffect(() => {
    loadAll()
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <Fragment>
            <FichaClinicaContainer
              dermatologo={dermatologo}
              sucursal={sucursal}
              consultorio={consultorio}
              colorBase={colorBase}
              historiaClinica={historiaClinica}
              setHistoriaClinica={setHistoriaClinica}
              commitHistoriaClinica={() => commitHistoriaClinica()}
              setMessage={setMessage}
              setSeverity={setSeverity}
              setOpenAlert={setOpenAlert}
              findConsultorio={() => findConsultorio()}
              onChangeTab={handleChangeTab}
              value={value}
              alergias={alergias} />
            <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
              <Alert onClose={handleCloseAlert} severity={severity}>
                {message}
              </Alert>
            </Snackbar>
          </Fragment> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }

    </Fragment>
  );
}

export default FichaClinica;
