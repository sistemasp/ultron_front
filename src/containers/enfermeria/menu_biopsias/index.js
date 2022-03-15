import React, { Fragment, useEffect, useState } from "react";
import { findSurgeryBySucursalAndDermatologoId } from "../../../services/consultorios";
import { createReceta, findRecetaByConsultaId, updateReceta } from "../../../services/recetas";
import { MenuBiopsiasContainer } from "./menu_biopsias";
import { Snackbar, Grid, Backdrop, CircularProgress, TablePagination, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { findLaboratorioById } from "../../../services/laboratorios";
import { findProductoComercialById } from "../../../services/productos_comerciales";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MenuBiopsias = (props) => {

  const [consultorio, setConsultorio] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [openModalPacienteDomicilio, setOpenModalPacienteDomicilio] = useState(false);
  const [openModalItemReceta, setOpenModalItemReceta] = useState(false);
  const [openModalImprimirReceta, setOpenModalImprimirReceta] = useState(false);
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState({});
  const [receta, setReceta] = useState({});

  const {
    enfermera,
    sucursal,
    colorBase,
  } = props;

  const classes = props;

  const titulo = 'RECETA';
  const columns = [
    { title: 'LABORATORIO', field: 'laboratorio.nombre' },
    { title: 'PRODUCTO', field: 'producto.nombre' },
    { title: 'RECOMENDACIÓN', field: 'recomendacion' },
  ];

  const handleOnClickEditarProducto = async (event, rowData) => {
    setIsLoading(true);
    setProducto(rowData);
    setOpenModalItemReceta(true);
    setIsLoading(false);
  }

  const actions = [
    {
      tooltip: 'ELIMINAR',
      onClick: {}
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
        handleOnClickEditarProducto(e, rowData);
        break;
    }
  }

  const components = {
    Pagination: props => {
      return <TablePagination
        {...props}
        rowsPerPageOptions={[5, 10, 20, 30, productos.length]}
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

  const handleClickCompletarDatos = (i) => {
    setOpenModalPacienteDomicilio(true);
  }

  const handleClickItemReceta = () => {
    setOpenModalItemReceta(true);
  }

  const handleClickImprimirReceta = () => {
    setOpenModalImprimirReceta(true);
  }

  const handleClosePacienteDomicilio = () => {
    setOpenModalPacienteDomicilio(false);
  }

  const handleCloseItemReceta = () => {
    setOpenModalItemReceta(false);
  }

  const handleCloseImprimirRecetar = () => {
    setOpenModalImprimirReceta(false);
  }

  useEffect(() => {
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <Fragment>
            <MenuBiopsiasContainer
              enfermera={enfermera}
              sucursal={sucursal}
              consultorio={consultorio}
              producto={producto}
              receta={receta}
  
              setMessage={setMessage}
              setSeverity={setSeverity}
              setOpenAlert={setOpenAlert}
              titulo={titulo}
              columns={columns}
              productos={productos}
              actions={actions}
              options={options}
              components={components}
              openModalImprimirReceta={openModalImprimirReceta}
              onCloseImprimirRecetar={handleCloseImprimirRecetar}
            />
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

export default MenuBiopsias;
