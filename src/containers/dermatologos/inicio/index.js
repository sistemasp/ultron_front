import React, { Fragment, useEffect, useState } from "react";
import { findSurgeryBySucursalAndDermatologoId } from "../../../services/consultorios";
import { createReceta, findRecetaByConsultaId, updateReceta } from "../../../services/recetas";
import { createEstudio, findEstudioByConsultaId, updateEstudio } from "../../../services/estudios";
import { InicioContainer } from "./inicio";
import { Snackbar, Grid, Backdrop, CircularProgress, TablePagination, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { findLaboratorioById } from "../../../services/laboratorios";
import { findProductoComercialById } from "../../../services/productos_comerciales";
import { tipoMedicamentoAntibioticoId, tipoMedicamentoControladoId, tipoMedicamentoNormalId } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const InicioDermatologos = (props) => {

  const navigate = useNavigate();

  const [consultorio, setConsultorio] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [openModalPacienteDomicilio, setOpenModalPacienteDomicilio] = useState(false);
  const [openModalItemReceta, setOpenModalItemReceta] = useState(false);
  const [openModalImprimirReceta, setOpenModalImprimirReceta] = useState(false);
  const [productosNormales, setProductosNormales] = useState([]);
  const [productosAntibioticos, setProductosAntibioticos] = useState([]);
  const [productosControlados, setProductosControlados] = useState([]);
  const [producto, setProducto] = useState({});
  const [receta, setReceta] = useState({});
  const [openModalItemEstudio, setOpenModalItemEstudio] = useState(false);
  const [analisismedicos, setAnalisisMedicos] = useState({});

  const {
    dermatologo,
    sucursal,
    colorBase,
  } = props;

  const classes = props;

  const tituloNormal = 'MEDICAMENTOS NORMALES';
  const tituloAntibioticos = 'ANTIBIÓTICOS';
  const tituloControlados = 'MEDICAMENTOS CONTROLADOS';
  const tituloEstudios = 'ESTUDIOS';

  const columns = [
    { title: 'LABORATORIO', field: 'nombre_laboratorio' },
    { title: 'PRODUCTO', field: 'nombre_producto' },
    { title: 'RECOMENDACIÓN', field: 'recomendacion' },
  ];

  const columnsEstudio = [
    { title: 'NOMBRE', field: 'nombre' },
  ];

  const loadEstudios = async (consultaId) => {
    const response = await findEstudioByConsultaId(consultaId)
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const estudios = response.data
      setAnalisisMedicos(estudios.analisis_medicos)
    }
  }

  const findConsultorio = async () => {
    setIsLoading(true);
    const response = await findSurgeryBySucursalAndDermatologoId(sucursal._id, dermatologo._id);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const consultorio = response.data;
      setConsultorio(consultorio);
      if (!consultorio.disponible) {
        abrirReceta(consultorio);
        loadEstudios(consultorio.consultaId)
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
    let ind = -1;
    receta.productos.forEach((product, index) => {
      if (product.nombre_producto === rowData.nombre_producto && product.recomendacion === rowData.recomendacion){
        ind = index
      } 
    })
    receta.productos.splice(ind, 1);
    const response = await updateReceta(receta._id, receta);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      findConsultorio();
    }

    setIsLoading(false);
  }

  const handleOnClickEliminarItemEstudios = async (event, rowData) => {
    setIsLoading(true);
    const index = analisismedicos.indexOf(rowData)
    analisismedicos.splice(index, 1)
    const response = await findEstudioByConsultaId(consultorio.consultaId)
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const estudio = response.data
      estudio.analisis_medicos = analisismedicos
      const responseEstudio = await updateEstudio(estudio._id, estudio)
      if (`${responseEstudio.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        findConsultorio()
      }
    }
    setIsLoading(false);
  }

  const actions = [
    {
      tooltip: 'ELIMINAR',
      onClick: handleOnClickEliminarItem
    }
  ];

  const actionsEstudios = [
    {
      tooltip: 'ELIMINAR ESTUDIO',
      onClick: handleOnClickEliminarItemEstudios
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
        handleOnClickEditarProducto(e, rowData)
        break;
      case 'ELIMINAR':
        handleOnClickEliminarItem(e, rowData)
        break;
      case 'ELIMINAR ESTUDIO':
        handleOnClickEliminarItemEstudios(e, rowData)
        break
    }
  }

  const components = {
    Pagination: props => {
      return <TablePagination
        {...props}
        rowsPerPageOptions={[5, 10, 20, 30]}
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
        let productos = receta.productos;
        let productosNormalesList = productos.filter(producto => {
          return producto.tipo_medicamento === tipoMedicamentoNormalId
        })
        setProductosNormales(productosNormalesList)

        let productosAntibioticosList = productos.filter(producto => {
          return producto.tipo_medicamento === tipoMedicamentoAntibioticoId
        })
        setProductosAntibioticos(productosAntibioticosList)

        let productosControladosList = productos.filter(producto => {
          return producto.tipo_medicamento === tipoMedicamentoControladoId
        })
        setProductosControlados(productosControladosList)

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

  const handleClickItemEstudio = () => {
    setOpenModalItemEstudio(true)
  }

  const handleClickImprimirReceta = async () => {
    const responseReceta = await updateReceta(receta._id, receta)
    if (`${responseReceta.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      navigate('/imprimir/receta/normal',
      {
        state: {
          sucursal: sucursal,
          colorBase: colorBase,
          productos: productosNormales,
          consultorio: consultorio,
          receta: receta
        }
      })
    }   
  }

  const handleClickImprimirRecetaAntibioticos = async () => {
    const responseReceta = await updateReceta(receta._id, receta)
    if (`${responseReceta.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      navigate('/imprimir/receta/antibioticos',
      {
        state: {
          sucursal: sucursal,
          colorBase: colorBase,
          productos: productosAntibioticos,
          consultorio: consultorio,
          receta: receta
        }
      })
    }   
  }

  const handleClickImprimirRecetaControlados = async () => {
    const responseReceta = await updateReceta(receta._id, receta)
    if (`${responseReceta.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      navigate('/imprimir/receta/controlados',
      {
        state: {
          sucursal: sucursal,
          colorBase: colorBase,
          productos: productosControlados,
          consultorio: consultorio,
          receta: receta
        }
      })
    }   
  }

  const handleClickImprimirEstudios = async () => {
    const responseReceta = await updateReceta(receta._id, receta)
    if (`${responseReceta.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      navigate('/imprimir/estudios',
      {
        state: {
          sucursal: sucursal,
          colorBase: colorBase,
          productos: analisismedicos,
          consultorio: consultorio,
          receta: receta
        }
      })
    }   
  }
  const handleClosePacienteDomicilio = () => {
    setOpenModalPacienteDomicilio(false);
  }

  const handleCloseItemReceta = () => {
    setOpenModalItemReceta(false);
  }

  const handleCloseItemEstudio = () => {
    setOpenModalItemEstudio(false)
  }

  const handleCloseImprimirRecetar = () => {
    setOpenModalImprimirReceta(false);
  }

  const handleAgregarProducto = async (event, newItem) => {
    const item = {
      nombre_laboratorio: newItem.laboratorio._id.nombre,
      nombre_producto: newItem.producto._id.nombre,
      recomendacion: newItem.recomendacion,
      producto_activo: newItem.producto._id.producto_activo ? newItem.producto._id.producto_activo : newItem.producto._id.nombre,
      tipo_medicamento: newItem.producto._id.tipo_medicamento
    }

    receta.productos.push(item);
    const response = await updateReceta(receta._id, receta);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      findConsultorio();
    }
  }

  const handleAgregarEstudio = async (event, newItem) => {
    const estudios = {
      create_date: new Date(),
      consultaId: consultorio.consultaId,
      paciente: consultorio.paciente._id,
      dermatologo: consultorio.dermatologo._id,
      sucursal: consultorio.sucursal,
      analisis_medicos: newItem.analisismedicos
    }
    const response = await createEstudio(estudios)
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      findConsultorio()
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
              onClickItemEstudio={handleClickItemEstudio}
              onClickImprimirReceta={handleClickImprimirReceta}
              onClickImprimirRecetaAntibioticos={handleClickImprimirRecetaAntibioticos}
              onClickImprimirRecetaControlados={handleClickImprimirRecetaControlados}
              onClickImprimirEstudios={handleClickImprimirEstudios}
              onChangeProximaConsulta={(e) => handleChangeProximaConsulta(e)}
              openModalPacienteDomicilio={openModalPacienteDomicilio}
              onClosePacienteDomicilio={handleClosePacienteDomicilio}
              openModalItemReceta={openModalItemReceta}
              onCloseItemRecetar={handleCloseItemReceta}
              openModalItemEstudio={openModalItemEstudio}
              onCloseItemEstudio={handleCloseItemEstudio}
              onClickAgregarEstudios={handleAgregarEstudio}
              analisismedicos={analisismedicos}
              setMessage={setMessage}
              setSeverity={setSeverity}
              setOpenAlert={setOpenAlert}
              findConsultorio={findConsultorio}
              tituloNormal={tituloNormal}
              tituloAntibioticos={tituloAntibioticos}
              tituloControlados={tituloControlados}
              tituloEstudios={tituloEstudios}
              columns={columns}
              columnsEstudio={columnsEstudio}
              productosNormales={productosNormales}
              productosAntibioticos={productosAntibioticos}
              productosControlados={productosControlados}
              actions={actions}
              actionsEstudios={actionsEstudios}
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
