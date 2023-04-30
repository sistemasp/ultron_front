import React, { Fragment, useEffect, useState } from "react";
import { findSurgeryBySucursalAndDermatologoId } from "../../../services/consultorios";
import { createReceta, findRecetaByConsultaId, findRecetaByPacienteId, updateReceta } from "../../../services/recetas";
import { RecetasPacienteContainer } from "./inicio";
import { Snackbar, Grid, Backdrop, CircularProgress, TablePagination, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { dateToString } from "../../../utils/utils";
import TableComponent from "../../../components/table/TableComponent";
import { showAllTipoMedicamentos } from "../../../services/tipo_medicamentos";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const RecetasPaciente = (props) => {

  const [consultorio, setConsultorio] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [openAlert, setOpenAlert] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('success')
  const [recetas, setRecetas] = useState([])

  const {
    dermatologo,
    sucursal,
    colorBase,
  } = props;

  const classes = props;

  const titulo = 'HISTORIAL DE RECETAS';

  const columns = [
    { title: 'FECHA', field: 'fecha' },
    { title: 'DERMATÓLOGO', field: 'dermatologo.nombre' },
    { title: 'SUCURSAL', field: 'sucursal.nombre' }
  ]

  const columnsTipo = [
    { title: 'TIPO DE MEDICAMENTO', field: 'tipo_medicamento' },
    { title: 'CANTIDAD DE MEDICAMENTOS', field: 'cantidad_medicamentos' }
  ]

  const columnsProductos = [
    { title: 'LABOTATORIO', field: 'nombre_laboratorio' },
    { title: 'PRODUCTO', field: 'nombre_producto' },
    { title: 'INDICACIÓN', field: 'recomendacion' }
  ]

  const optionsDetail = {
    headerStyle: {
      backgroundColor: colorBase,
      color: '#FFF',
      fontWeight: 'bolder',
      fontSize: '16px',
      padding: '5px'
    },
    cellStyle: {
      fontWeight: 'bolder',
      fontSize: '16px',
      padding: '0px'
    },
    exportAllData: true,
    exportButton: false,
    exportDelimiter: ';',
    search: false,
    showTitle: false,
    toolbar: false,
    paging: false,
    draggable: false,
  }

  const detailPanelProductos = [
    {
      tooltip: 'VER PRODUCTOS RECETADOS',
      render: rowData => {
        return (
          <Fragment>
            <TableComponent
              columns={columnsProductos}
              data={rowData.productos}
              options={optionsDetail} />
          </Fragment>
        )
      },
    }
  ];

  const detailPanel = [
    {
      tooltip: 'VER TIPOS MEDICAMENTOS RECETADOS',
      render: rowData => {
        return (
          <Fragment>
            <TableComponent
              columns={columnsTipo}
              data={rowData.tipo_medicamentos}
              options={optionsDetail}
              detailPanel={detailPanelProductos} />
          </Fragment>
        )
      },
    }
  ];

  const findRecetas = async (pacienteId, tipoMedicamentos) => {
    setIsLoading(true)  
    if (pacienteId) { // REVISAR ESTE PARCHE QUE ENVIA EL PACIENTE NULO SIN LLAMARLO
      const response = await findRecetaByPacienteId(pacienteId)
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        const recetasResponse = response.data

        recetasResponse.map((receta) => {
          receta.tipo_medicamentos = []        
          
          tipoMedicamentos.map(tipoMedicamento => {
            const productoPorTipo = receta.productos.filter(producto => {
              return producto.tipo_medicamento === tipoMedicamento._id
            })
            if (productoPorTipo.length !== 0) {
              const categoria = {
                tipo_medicamento: tipoMedicamento.nombre,
                cantidad_medicamentos: productoPorTipo.length,
                productos: productoPorTipo
              }
              receta.tipo_medicamentos.push(categoria)
            }
          })

          receta.fecha = dateToString(receta.create_date)
        })

        setRecetas(recetasResponse)
      }
    }
    setIsLoading(false)
  }

  const loadTipoMedicamentos = async (pacienteId) => {
    setIsLoading(true)
    const response = await showAllTipoMedicamentos()
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const tipoMedicamentos = response.data
      await findRecetas(pacienteId, tipoMedicamentos)
    }
    setIsLoading(false);
  }

  const findConsultorio = async () => {
    setIsLoading(true)
    const response = await findSurgeryBySucursalAndDermatologoId(sucursal._id, dermatologo._id)
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const consultorio = response.data
      if (consultorio) {
        await loadTipoMedicamentos(consultorio.paciente._id)
        setConsultorio(consultorio)
      }
    }
    setIsLoading(false);
  }

  const actions = []

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

  const components = {
    Pagination: props => {
      return <TablePagination
        {...props}
        rowsPerPageOptions={[5, 10, 20, 30]}
      />
    }
  }

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const loadAll = () => {
    loadTipoMedicamentos()
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
            <RecetasPacienteContainer
              dermatologo={dermatologo}
              sucursal={sucursal}
              consultorio={consultorio}
              recetas={recetas}
              colorBase={colorBase}
              setMessage={setMessage}
              setSeverity={setSeverity}
              setOpenAlert={setOpenAlert}
              findConsultorio={findConsultorio}
              tituloNormal={titulo}
              columns={columns}
              actions={actions}
              options={options}
              components={components}
              detailPanel={detailPanel} />
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

export default RecetasPaciente;
