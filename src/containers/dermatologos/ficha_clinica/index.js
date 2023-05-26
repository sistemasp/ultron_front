import React, { Fragment, useEffect, useState } from "react";
import { findSurgeryBySucursalAndDermatologoId } from "../../../services/consultorios";
import { showAllAlergias } from "../../../services/u-sgcm-ficha-clinica/alergias"
import { Snackbar, Backdrop, CircularProgress } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { FichaClinicaContainer } from "./ficha_clinica";
import { showAllSignosVitales } from "../../../services/u-sgcm-ficha-clinica/signos_vitales";

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

  const {
    dermatologo,
    sucursal,
    colorBase,
  } = props;

  const classes = props;

  const findConsultorio = async () => {
    setIsLoading(true)
    const response = await findSurgeryBySucursalAndDermatologoId(sucursal._id, dermatologo._id)
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const consultorio = response.data
      if (consultorio) {
        setConsultorio(consultorio)
      }
    }
    setIsLoading(false);
  }

  const loadSignosVitales = async () => {
    setIsLoading(true)
    const response = await showAllSignosVitales()
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setSignosVitales(response.data)
    }
    setIsLoading(false)
  }

  const loadAlergias = async () => {
    setIsLoading(true)
    const response = await showAllAlergias()
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setAlergias(response.data)
    }
    setIsLoading(false)
  }

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const loadAll = () => {
    loadAlergias()
    findConsultorio()
    loadSignosVitales()
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
              setMessage={setMessage}
              setSeverity={setSeverity}
              setOpenAlert={setOpenAlert}
              findConsultorio={findConsultorio}
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
