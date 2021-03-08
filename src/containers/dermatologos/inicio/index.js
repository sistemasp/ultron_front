import React, { Fragment, useEffect, useState } from "react";
import { findSurgeryBySucursalAndDermatologoId } from "../../../services/consultorios";
import { InicioContainer } from "./inicio";
import { Snackbar, Grid, Backdrop, CircularProgress } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const InicioDermatologos = (props) => {

  const [consultorio, setConsultorio] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [openModalPacienteDomicilio, setOpenModalPacienteDomicilio] = useState(false);
  const [openModalRecetar, setOpenModalRecetar] = useState(false);

  const {
    dermatologo,
    sucursal,
  } = props;

  const classes = props;

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const findConsultorio = async () => {
    setIsLoading(true);
    const response = await findSurgeryBySucursalAndDermatologoId(sucursal._id, dermatologo._id);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setConsultorio(response.data);
    }
    setIsLoading(false);

  }

  const handleClickCompletarDatos = (i) => {
    setOpenModalPacienteDomicilio(true);
  }

  const handleClickRecetar = () => {
    setOpenModalRecetar(true);
  }

  const handleClosePacienteDomicilio = () => {
    setOpenModalPacienteDomicilio(false);
  }

  const handleCloseRecetar = () => {
    setOpenModalRecetar(false);
  }

  useEffect(() => {
    findConsultorio();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <Fragment>
            <InicioContainer
              dermatologo={dermatologo}
              sucursal={sucursal}
              consultorio={consultorio}
              onClickCompletarDatos={handleClickCompletarDatos}
              onClickRecetar={handleClickRecetar}
              openModalPacienteDomicilio={openModalPacienteDomicilio}
              onClosePacienteDomicilio={handleClosePacienteDomicilio}
              openModalRecetar={openModalRecetar}
              onCloseRecetar={handleCloseRecetar}
              setMessage={setMessage}
              setSeverity={setSeverity}
              setOpenAlert={setOpenAlert} 
              findConsultorio={findConsultorio} />
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

export default InicioDermatologos;
