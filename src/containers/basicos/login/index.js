import React, { Fragment, useEffect, useState } from "react";
import { Formik } from "formik";
import io from 'socket.io-client';
import socketIOClient from "socket.io-client";
import { showAllOffices } from "../../../services";
import withStyles from "@material-ui/core/styles/withStyles";
import { LoginContainer } from "./login";
import * as Yup from "yup";
import { Snackbar, Grid } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import bannerMePiel from './../../../bannerMePiel.PNG';
import { login } from "../../../services/empleados";
import { useNavigate } from "react-router-dom";
import { rolJulioId, rolSuperEnfermeroId } from "../../../utils/constants";

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing(5)}px ${theme.spacing(5)}px ${theme.spacing(5)}px`
  },
  container: {
    maxWidth: "200px"
  },
  title: {
    color: "#2BA6C6"
  }
});

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const validationSchema = Yup.object({
  employee_number: Yup.string("Ingresa tu numero de empleado")
    .required("El numero de empleado es requerido"),
});

const LoginForm = (props) => {

  const [sucursales, setSucursales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [values, setValues] = useState({
    employee_number: '',
    password: '',
    showPassword: false
  });
  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const rolPromovendedorId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
  const rolCosmetologaId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;
  const rolDermatologoId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
  const rolPatologoId = process.env.REACT_APP_PATOLOGO_ROL_ID;
  const rolDirectorId = process.env.REACT_APP_DIRECTOR_ROL_ID;
  const rolEncargadoSucursalId = process.env.REACT_APP_ENCARGADO_SUCURSAL_ROL_ID;
  const rolEncargadoCosmetologasId = process.env.REACT_APP_ENCARGADO_COSMETOLOGAS_ROL_ID;
  const rolRecepcionistaId = process.env.REACT_APP_RECEPCIONISTA_ROL_ID;
  const rolEnfermeraId = process.env.REACT_APP_ENFERMERA_ROL_ID;
  const rolAdministacionId = process.env.REACT_APP_ADMINISTRACION_ROL_ID;
  const rolDiosSupremoId = process.env.REACT_APP_DIOS_SUPREMO_ROL_ID;
  const rolMasterId = process.env.REACT_APP_MASTER_ROL_ID;
  const rolSistemasId = process.env.REACT_APP_SISTEMAS_ROL_ID;
  const rolSupervisorId = process.env.REACT_APP_SUPERVISOR_ROL_ID;
  const rolAuxiliarAdministrativoId = process.env.REACT_APP_AUXILIAR_ADMINISTRATIVO_ROL_ID;
  const rolCallCenterId = process.env.REACT_APP_CALL_CENTER_ROL_ID;

  const navigate = useNavigate();

  const [carrie, setCarrie] = useState(false);


  const sumota = () => {
    const num1 = "323"
    const num2 = "456"
    console.log("KAOZ", '', num1, '+', num2)
    let resultado = ''
    let final = ''
    for (let i = num1.length - 1; i >= 0; i--) {
      let res = Number(num1[i]) + Number(num2[i]) + (carrie ? 1 : 0)
      if (res > 9) {
        res -= 10
        setCarrie(true)
      } else {
        setCarrie(false)
      }
      resultado += res
    }
    for (let i = resultado.length - 1; i >= 0; i--) {
      final += resultado[i]
    }
    console.log("KAOZ", carrie, `${final}`)

  }

  useEffect(() => {
    const loadSucursales = async () => {
      const response = await showAllOffices();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setSucursales(response.data);
      }
    }
    setIsLoading(true);
    sumota()
    loadSucursales();
    setIsLoading(false);
  }, []);

  const handleChangeSucursal = (e, newValue) => {
    setIsLoading(true);
    setValues({
      ...values,
      sucursal: newValue,
    });
    setIsLoading(false);
  };

  const handleChangeNumber = e => {
    setValues({ ...values, employee_number: e.target.value });
  }

  const handleChangePassword = e => {
    setValues({ ...values, password: e.target.value });
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const submit = async (data) => {
    const response = await login(data.employee_number, data.password);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED && response.data !== '') {
      const empleado = response.data;
      if (empleado.rol._id === rolCallCenterId) {
        navigate('/call_center', {
          state: {
            empleado: empleado,
            sucursal: data.sucursal
          }
        });
      } else if (empleado.rol._id === rolCosmetologaId) {
        navigate('/cabinas', {
          state: {
            empleado: empleado,
            sucursal: data.sucursal
          }
        });
      } else if (empleado.rol._id === rolDermatologoId) {
        navigate('/dermatologos', {
          state: {
            dermatologo: empleado,
            sucursal: data.sucursal
          }
        });
      } else if (empleado.rol._id === rolDirectorId
        || empleado.rol._id === rolEncargadoSucursalId
        || empleado.rol._id === rolRecepcionistaId
        || empleado.rol._id === rolDiosSupremoId
        || empleado.rol._id === rolMasterId
        || empleado.rol._id === rolSistemasId
        || empleado.rol._id === rolSupervisorId
        || empleado.rol._id === rolJulioId
      ) {
        navigate('/recepcion', {
          state: {
            empleado: empleado,
            sucursal: data.sucursal
          }
        });
      } else if (empleado.rol._id === rolSuperEnfermeroId
        || empleado.rol._id === rolEnfermeraId) {
        navigate('/enfermeria', {
          state: {
            enfermera: empleado,
            sucursal: data.sucursal
          }
        });
      } else if (empleado.rol._id === rolAdministacionId
        || empleado.rol._id === rolAuxiliarAdministrativoId) {
        navigate('/administracion', {
          state: {
            empleado: empleado,
            sucursal: data.sucursal
          }
        });
      }
    } else {
      setOpenAlert(true);
      setSeverity('warning');
      setMessage('NUMERO DE EMPLEADO O CONSTRASEÑA INCORRECTOS');
    }
  };

  const classes = props;

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <Fragment>
      <img src={bannerMePiel} alt='banner' />
      <h1>INICIAR SESIÓN</h1>
      <Grid container className={classes.root} justify="center" spacing={3}>
        <Grid item xs={3}>
          <Formik
            enableReinitialize
            initialValues={values}
            validationSchema={validationSchema}
            onSubmit={submit}>
            {props => <LoginContainer
              sucursales={sucursales}
              isLoading={isLoading}
              handleChangeNumber={(e) => handleChangeNumber(e)}
              handleChangePassword={(e) => handleChangePassword(e)}
              onChangeSucursal={handleChangeSucursal}
              handleClickShowPassword={handleClickShowPassword}
              handleMouseDownPassword={(e) => handleMouseDownPassword(e)}
              {...props} />}
          </Formik>
        </Grid>
      </Grid>
      <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Fragment>
  );
}

export default withStyles(styles)(LoginForm);
