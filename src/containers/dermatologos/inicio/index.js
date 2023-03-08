import React, { Fragment, useEffect, useState } from "react";
import { findSurgeryBySucursalAndDermatologoId } from "../../../services/consultorios";
import { createReceta, findRecetaByConsultaId, updateReceta } from "../../../services/recetas";
import { InicioContainer } from "./inicio";
import { Snackbar, Grid, Backdrop, CircularProgress, TablePagination, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import EditIcon from '@material-ui/icons/Edit';
import { findLaboratorioById } from "../../../services/laboratorios";
import { findProductoComercialById } from "../../../services/productos_comerciales";

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
  const [openModalItemReceta, setOpenModalItemReceta] = useState(false);
  const [openModalImprimirReceta, setOpenModalImprimirReceta] = useState(false);
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState({});
  const [receta, setReceta] = useState({});

  const {
    dermatologo,
    sucursal,
    colorBase,
  } = props;

  const classes = props;

  const tituloNormal = 'RECETA NORMAL';
  const tituloAntibioticos = 'RECETA ANTIBIÓTICOS';
  const tituloControlados = 'RECETA CONTROLADOS';
  const tituloEstudios = 'RECETA ESTUDIOS';

  const columns = [
    { title: 'LABORATORIO', field: 'nombre_laboratorio' },
    { title: 'PRODUCTO', field: 'nombre_producto' },
    { title: 'RECOMENDACIÓN', field: 'recomendacion' },
  ];

  const findConsultorio = async () => {
    setIsLoading(true);
    const response = await findSurgeryBySucursalAndDermatologoId(sucursal._id, dermatologo._id);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const consultorio = response.data;
      setConsultorio(consultorio);
      if (!consultorio.disponible) {
        abrirReceta(consultorio);
      } {
        setIsLoading(false);
      }
    }
  }

  const handleOnClickEditarProducto = async (event, rowData) => {
    setIsLoading(true);
    setProducto(rowData);
    setOpenModalItemReceta(true);
    setIsLoading(false);
  }

  const handleOnClickEliminarItem = async (event, rowData) => {
    setIsLoading(true);
    const index = receta.productos.indexOf(rowData);
    receta.productos.splice(index, 1);
    const response = await updateReceta(receta._id, receta);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      findConsultorio();
    }

    setIsLoading(false);
  }

  const actions = [
    {
      tooltip: 'ELIMINAR',
      onClick: handleOnClickEliminarItem
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
      case 'ELIMINAR':
        handleOnClickEliminarItem(e, rowData);
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

  const abrirReceta = async (consultorio) => {
    setIsLoading(true);
    const response = await findRecetaByConsultaId(consultorio.consultaId);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const receta = response.data;
      if (receta) {
        setReceta(receta);
        setReceta({
          ...receta,
          fecha_proxima_consulta: receta.fecha_proxima_consulta ? receta.fecha_proxima_consulta : ""
        })
        setProductos(receta.productos);
        receta.productos.forEach(async (producto) => {
          const responseLaboratorio = await findLaboratorioById(producto.laboratorio._id);
          const responseProductoComercial = await findProductoComercialById(producto.producto._id);
          if (`${responseLaboratorio.status}` === process.env.REACT_APP_RESPONSE_CODE_OK &&
            `${responseProductoComercial.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            setIsLoading(true);
            producto.laboratorio = responseLaboratorio.data;
            producto.producto = responseProductoComercial.data;
            setIsLoading(false);
          }
        });
      } else {
        const newReceta = {
          create_date: new Date(),
          consultaId: consultorio.consultaId,
          paciente: consultorio.paciente._id,
          dermatologo: consultorio.dermatologo._id,
          sucursal: consultorio.sucursal,
          productos: [],
          fecha_proxima_consulta: new Date(),
        };

        const responseReceta = await createReceta(newReceta);

        if (`${responseReceta.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
          setSeverity('success');
          setOpenAlert(true);
          setMessage('RECETA CREADA CORRECTAMENTE');
          setReceta(responseReceta.data);
          setReceta({
            ...receta,
            fecha_proxima_consulta: receta.fecha_proxima_consulta ? receta.fecha_proxima_consulta : ""
          })
          responseReceta.data.productos.forEach(async (producto) => {
            const responseLaboratorio = await findLaboratorioById(producto.laboratorio._id);
            const responseProductoComercial = await findProductoComercialById(producto.producto._id);
            if (`${responseLaboratorio.status}` === process.env.REACT_APP_RESPONSE_CODE_OK &&
              `${responseProductoComercial.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
              setIsLoading(true);
              producto.laboratorio = responseLaboratorio.data;
              producto.producto = responseProductoComercial.data;
              setIsLoading(false);
            }
          });
        }
      }
    }
  }

  const handleChangeProximaConsulta = (date) => {
    setReceta({
      ...receta,
      fecha_proxima_consulta: date
    })
  }

  const handleClickCompletarDatos = (i) => {
    setOpenModalPacienteDomicilio(true);
  }

  const handleClickItemReceta = () => {
    setOpenModalItemReceta(true);
  }

  const handleClickImprimirReceta =  async () => {
    const responseReceta = await updateReceta(receta._id, receta)
    if (`${responseReceta.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setOpenModalImprimirReceta(true)
    }
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

  const handleAgregarProducto = async (event, newItem) => {
    const item = {
      nombre_laboratorio: newItem.laboratorio._id.nombre,
      nombre_producto: newItem.producto._id.nombre,
      recomendacion: newItem.recomendacion,
    }

    receta.productos.push(item);
    const response = await updateReceta(receta._id, receta);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      findConsultorio();
    }
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
              producto={producto}
              receta={receta}
              colorBase={colorBase}
              onAgregarProducto={handleAgregarProducto}
              onClickCompletarDatos={handleClickCompletarDatos}
              onClickItemReceta={handleClickItemReceta}
              onClickImprimirReceta={handleClickImprimirReceta}
              onChangeProximaConsulta={(e) => handleChangeProximaConsulta(e)}
              openModalPacienteDomicilio={openModalPacienteDomicilio}
              onClosePacienteDomicilio={handleClosePacienteDomicilio}
              openModalItemReceta={openModalItemReceta}
              onCloseItemRecetar={handleCloseItemReceta}
              setMessage={setMessage}
              setSeverity={setSeverity}
              setOpenAlert={setOpenAlert}
              findConsultorio={findConsultorio}
              tituloNormal={tituloNormal}
              tituloAntibioticos={tituloAntibioticos}
              tituloControlados={tituloControlados}
              tituloEstudios={tituloEstudios}
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

export default InicioDermatologos;
