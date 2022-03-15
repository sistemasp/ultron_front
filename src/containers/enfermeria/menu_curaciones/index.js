import React, { Fragment, useEffect, useState } from "react";
import { MenuCuracionesContainer } from "./menu_curaciones";
import { Snackbar, Grid, Backdrop, CircularProgress, TablePagination, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { findCuracionByDateAndSucursal } from "../../../services/curaciones";
import { addZero, generateFolio } from "../../../utils/utils";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MenuCuraciones = (props) => {

  const [curaciones, setCuraciones] = useState([]);
  const [curacion, setCuracion] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [openModal, setOpenModal] = useState(false);

  const {
    enfermera,
    sucursal,
    colorBase,
  } = props;

  const token = enfermera.access_token;

  const classes = props;

  const titulo = 'CURACIONES';
  const columns = [
    { title: 'FOLIO', field: 'consecutivo' },
    { title: 'TURNO', field: 'turno' },
    { title: 'HORA', field: 'hora' },
    { title: 'PACIENTE', field: 'paciente.nombre_completo' },
    { title: 'TELÉFONO', field: 'paciente.telefono' },
    { title: 'DERMATÓLOGO (A)', field: 'dermatologo.nombre' },
    { title: 'MOTIVO', field: 'curacion_motivo.nombre' },
    { title: 'NOMBRE CURACIÓN', field: 'curacion_nombre.nombre' },
    { title: 'TIPO CURACIÓN', field: 'curacion_tipo.nombre' },
    { title: 'AREA', field: 'curacion_area.nombre' },
    { title: 'OBSERVACIONES', field: 'observaciones' },
  ];

  const handleOnClickEditarCuracion = async (event, rowData) => {
    setCuracion(rowData);
    setOpenModal(true);
  }

  const actions = [
    {
      tooltip: 'EDITAR',
      onClick: handleOnClickEditarCuracion,
    }
  ];

  const options = {
    headerStyle: {
      backgroundColor: colorBase,
      color: '#FFF',
      fontWeight: 'bolder',
      fontSize: '18px',
      textAlign: 'center',
    },
    cellStyle: {
      fontWeight: 'bolder',
      fontSize: '16px',
      padding: '5px',
      textAlign: 'center',
    },
    paging: false,
  };

  const onChangeActions = (e, rowData) => {
    const action = e.target.value;
    switch (action) {
      case 'EDITAR':
        handleOnClickEditarCuracion(e, rowData);
        break;
    }
  }

  const components = {
    Pagination: props => {
      return <TablePagination
        {...props}
        rowsPerPageOptions={[5, 10, 20, 30, curaciones.length]}
      />
    },
    Actions: props => {
      return props.actions.length > 0
        ? <Fragment>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="simple-select-outlined-hora"></InputLabel>
            <Select
              labelId="simple-select-outlined-actions"
              id="simple-select-outlined-actions"
              onChange={(e) => onChangeActions(e, props.data)}
              label="ACCIONES">
              {
                props.actions.map((item, index) => {
                  return <MenuItem
                    key={index}
                    value={item.tooltip}
                  >{item.tooltip}</MenuItem>
                })
              }
            </Select>
          </FormControl>
        </Fragment>
        : ''
    }
  }

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const loadCuraciones = async (filterDate) => {
    const response = await findCuracionByDateAndSucursal(filterDate.getDate(), filterDate.getMonth(), filterDate.getFullYear(), sucursal._id, token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      response.data.forEach(item => {
        item.folio = generateFolio(item);
        const fecha = new Date(item.fecha_hora);
        item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
        item.paciente.nombre_completo = `${item.paciente.nombres} ${item.paciente.apellidos}`;
      });
      setCuraciones(response.data);
    }
  }

  const handleCloseModal = async () => {
    setOpenModal(false);
    await loadCuraciones(new Date());
  };


  const loadAll = async () => {
    setIsLoading(true);
    await loadCuraciones(new Date());
    setIsLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <Fragment>
            <MenuCuracionesContainer
              enfermera={enfermera}
              sucursal={sucursal}
              curacion={curacion}
              colorBase={colorBase}
              setMessage={setMessage}
              setSeverity={setSeverity}
              setOpenAlert={setOpenAlert}
              titulo={titulo}
              columns={columns}
              curaciones={curaciones}
              actions={actions}
              options={options}
              components={components}
              openModal={openModal}
              loadCuraciones={loadCuraciones}
              onClickCancel={handleCloseModal} />
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

export default MenuCuraciones;
