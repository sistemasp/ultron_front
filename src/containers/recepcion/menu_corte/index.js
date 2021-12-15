import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { CorteContainer } from './corte';
import TableComponent from '../../../components/table/TableComponent';
import {
  showAllMetodoPago,
  showAllTipoSalidas,
} from '../../../services';
import {
  showEntradasTodayBySucursalAndHoraAplicacion, showEntradasTodayBySucursalAndHoraAplicacionPA,
} from '../../../services/entradas';
import {
  deleteSalida,
  showSalidasTodayBySucursalAndHoraAplicacion,
} from '../../../services/salidas';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { addZero, toFormatterCurrency } from "../../../utils/utils";
import {
  createCorte,
  findTurnoActualBySucursal,
  showCorteTodayBySucursalAndTurno,
  updateCorte,
} from "../../../services/corte";
import { showAllTipoEntradas } from "../../../services/tipo_entradas";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { deletePagoDermatologo } from "../../../services/pago_dermatologos";
import { deletePagoPatologo } from "../../../services/pago_patologo";
import { tipoSalidaPagoDermatologoId, tipoSalidaPagoPatologoId } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
}));

const Corte = (props) => {

  const classes = useStyles();

  const navigate = useNavigate();

  const [openModalNuevoEntrada, setOpenModalNuevoEntrada] = useState(false);
  const [openModalNuevoSalida, setOpenModalNuevoSalida] = useState(false);
  const [openModalImprimir, setOpenModalInmprimir] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [dataEntradas, setDataEntradas] = useState([]);
  const [dataPagosAnticipados, setDataPagosAnticipados] = useState([]);
  const [dataSalidas, setDataSalidas] = useState([]);
  const [entradas, setEntradas] = useState([]);
  const [pagosAnticipados, setPagosAnticipados] = useState([]);
  const [salidas, setSalidas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [turno, setTurno] = useState('m');
  const [corte, setCorte] = useState({});
  
  const {
    sucursal,
    empleado,
    colorBase,
    history,
  } = props;

  const token = empleado.access_token;

  const columnsEntrada = [
    { title: 'FORMA DE PAGO', field: 'forma_pago' },
    { title: 'TOTAL', field: 'total_moneda' },
  ];

  const columnsEntradaTipo = [
    { title: 'TIPO DE INGRESO', field: 'tipo_entrada' },
    { title: 'CANTIDAD', field: 'cantidad_entradas' },
    { title: 'TOTAL', field: 'total_moneda' },
  ];

  const columnsEntradaDetalles = [
    { title: 'CONCEPTO', field: 'concepto' },
    { title: 'HORA', field: 'hora' },
    { title: 'RECEPCIONISTA', field: 'recepcionista.nombre' },
    { title: 'CANTIDAD', field: 'cantidad_moneda' },
  ];

  const columnsSalida = [
    { title: 'TIPO EGRESO', field: 'tipo_salida' },
    { title: 'CANTIDAD', field: 'cantidad_salidas' },
    { title: 'TOTAL', field: 'total_moneda' },
  ];

  const columnsSalidaDetalles = [
    { title: 'CONCEPTO', field: 'concepto' },
    { title: 'DESCRIPCIÓN', field: 'descripcion' },
    { title: 'RECEPCIONISTA', field: 'recepcionista.nombre' },
    { title: 'CANTIDAD', field: 'cantidad_moneda' },

  ];

  const options = {
    headerStyle: {
      backgroundColor: colorBase,
      color: '#FFF',
      fontWeight: 'bolder',
      fontSize: '18px'
    },
    rowStyle: {
      fontWeight: 'bolder',
      fontSize: '16px'
    },
    exportAllData: true,
    exportButton: false,
    exportDelimiter: ';',
    paging: false,
  }

  const optionsDetail = {
    headerStyle: {
      backgroundColor: process.env.REACT_APP_TOP_BAR_DETAIL_COLOR,
      color: '#FFF',
      fontWeight: 'bolder',
      fontSize: '16px',
      padding: '5px',
    },
    cellStyle: {
      fontWeight: 'bolder',
      fontSize: '16px',
      padding: '0px',
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

  const detailPanelEntradaDetalle = [
    {
      tooltip: 'DETALLES',
      render: rowData => {
        return (
          <Fragment>
            <TableComponent
              columns={columnsEntradaDetalles}
              data={rowData.entradas}
              options={optionsDetail} />
          </Fragment>
        )
      },
    }
  ];

  const detailPanelEntrada = [
    {
      tooltip: 'DETALLES',
      render: rowData => {
        return (
          <Fragment>
            <TableComponent
              columns={columnsEntradaTipo}
              data={rowData.tipo_entradas_detalles}
              options={optionsDetail}
              detailPanel={detailPanelEntradaDetalle} />
          </Fragment>
        )
      },
    }
  ];

  const handleEliminarSalida = async (event, rowData) => {
    setIsLoading(true);
    switch (rowData.tipo_salida._id) {
      case tipoSalidaPagoDermatologoId:
        await deletePagoDermatologo(rowData.pago_dermatologo, token);
        break;
      case tipoSalidaPagoPatologoId:
        await deletePagoPatologo(rowData.pago_dermatologo, token);
        break;
    }
    await deleteSalida(rowData._id, token);
    turnoActual();
    setIsLoading(false);
  }

  const actions = [
    {
      icon: DeleteForeverIcon,
      tooltip: 'ELIMINAR SALIDA',
      onClick: handleEliminarSalida
    },
  ];

  const detailPanelSalida = [
    {
      tooltip: 'DETALLES',
      render: rowData => {
        return (
          <Fragment>
            <TableComponent
              actions={actions}
              columns={columnsSalidaDetalles}
              data={rowData.salidas_por_tipo}
              options={optionsDetail} />
          </Fragment>
        )
      },
    }
  ];

  const loadDataEntradas = async (tipoEntradas, entradas, formaPagos) => {

    const dataEntradasTemp = [];
    formaPagos.map((formaPago) => {

      const tipoEntradasDetalles = [];
      tipoEntradas.map((tipoEntrada) => {

        const entradasPorTipo = [];
        let totalTipoEntrada = 0;

        entradas.forEach(entrada => {
          if (entrada.forma_pago._id === formaPago._id) {
            if (entrada.tipo_entrada._id === tipoEntrada._id) {
              totalTipoEntrada += Number(entrada.cantidad);
              const date = new Date(entrada.create_date);
              entrada.hora = `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
              entradasPorTipo.push(entrada);
            }
          }
        });

        if (totalTipoEntrada !== 0) {
          const tipoEntradaDetalle = {
            tipo_entrada: tipoEntrada.nombre,
            total: totalTipoEntrada,
            total_moneda: toFormatterCurrency(totalTipoEntrada),
            cantidad_entradas: entradasPorTipo.length,
            entradas: entradasPorTipo,
          }
          if (tipoEntradaDetalle.total > 0) {
            tipoEntradasDetalles.push(tipoEntradaDetalle);
          }
        }
      });

      let total = 0;
      tipoEntradasDetalles.forEach(tipoEntradaDetalle => {
        return total += Number(tipoEntradaDetalle.total);
      });

      const dataEntrada = {
        forma_pago: formaPago.nombre,
        total: total,
        total_moneda: toFormatterCurrency(total),
        tipo_entradas_detalles: tipoEntradasDetalles,
      }
      if (dataEntrada.total > 0) {
        dataEntradasTemp.push(dataEntrada);
      }
    });
    setDataEntradas(dataEntradasTemp);
  }

  const loadDataPagosAnticipados = async (tipoEntradas, entradas, formaPagos) => {

    const dataEntradasTemp = [];
    formaPagos.map((formaPago) => {

      const tipoEntradasDetalles = [];
      tipoEntradas.map((tipoEntrada) => {

        const entradasPorTipo = [];
        let totalTipoEntrada = 0;

        entradas.forEach(entrada => {
          if (entrada.forma_pago._id === formaPago._id) {
            if (entrada.tipo_entrada._id === tipoEntrada._id) {
              totalTipoEntrada += Number(entrada.cantidad);
              const date = new Date(entrada.create_date);
              entrada.hora = `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
              entradasPorTipo.push(entrada);
            }
          }
        });

        if (totalTipoEntrada !== 0) {
          const tipoEntradaDetalle = {
            tipo_entrada: tipoEntrada.nombre,
            total: totalTipoEntrada,
            total_moneda: toFormatterCurrency(totalTipoEntrada),
            cantidad_entradas: entradasPorTipo.length,
            entradas: entradasPorTipo,
          }

          if (tipoEntradaDetalle.total > 0) {
            tipoEntradasDetalles.push(tipoEntradaDetalle);
          }
        }
      });

      let total = 0;
      tipoEntradasDetalles.forEach(tipoEntradaDetalle => {
        return total += Number(tipoEntradaDetalle.total);
      });

      const dataEntrada = {
        forma_pago: formaPago.nombre,
        total: total,
        total_moneda: toFormatterCurrency(total),
        tipo_entradas_detalles: tipoEntradasDetalles,
      }

      if (dataEntrada.total > 0) {
        dataEntradasTemp.push(dataEntrada);
      }
    });
    setDataPagosAnticipados(dataEntradasTemp);
  }

  const loadDataSalidas = async (salidas, tipoSalidas) => {

    const dataSalidasTemp = [];
    tipoSalidas.map((tipoSalida) => {
      const salidasPorTipo = [];
      salidas.forEach(salida => {
        if (salida.tipo_salida._id === tipoSalida._id) {
          salidasPorTipo.push(salida);
        }
      });

      let total = 0;
      salidasPorTipo.forEach(salida => {

        return total += Number(salida.cantidad ? salida.cantidad : 0);
      });

      const dataSalida = {
        tipo_salida: tipoSalida.nombre,
        salidas_por_tipo: salidasPorTipo,
        cantidad_salidas: salidasPorTipo.length,
        total: total,
        total_moneda: toFormatterCurrency(total),
      }
      if (dataSalida.total > 0) {
        dataSalidasTemp.push(dataSalida);
      }
    });
    setDataSalidas(dataSalidasTemp);
  }

  const loadEntradas = async (tipoEntradas, formaPagos, hora_apertura, hora_cierre) => {
    const response = await showEntradasTodayBySucursalAndHoraAplicacion(sucursal, hora_apertura, hora_cierre ? hora_cierre : new Date());
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const data = response.data;
      data.map((item) => {
        item.cantidad_moneda = toFormatterCurrency(item.cantidad);
      });
      setEntradas(data);
      await loadDataEntradas(tipoEntradas, data, formaPagos);
      setIsLoading(false);
    }
  }

  const loadPagosAnticipados = async (tipoEntradas, formaPagos, hora_apertura, hora_cierre) => {
    const response = await showEntradasTodayBySucursalAndHoraAplicacionPA(sucursal, hora_apertura, hora_cierre ? hora_cierre : new Date());
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const data = response.data;
      data.map((item) => {
        item.cantidad_moneda = toFormatterCurrency(item.cantidad);
      });
      setPagosAnticipados(data);
      await loadDataPagosAnticipados(tipoEntradas, data, formaPagos);
      setIsLoading(false);
    }
  }

  const loadSalidas = async (tipoSalidas, hora_apertura, hora_cierre) => {
    const response = await showSalidasTodayBySucursalAndHoraAplicacion(sucursal, hora_apertura, hora_cierre ? hora_cierre : new Date());
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const data = response.data;
      data.map((item) => {
        item.cantidad_moneda = toFormatterCurrency(item.cantidad);
      });
      setSalidas(data);
      await loadDataSalidas(data, tipoSalidas);
      setIsLoading(false);
    }
  }

  const loadMetodoPagos = async (tipoEntradas, hora_apertura, hora_cierre) => {
    const response = await showAllMetodoPago();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const formaPagos = response.data;
      await loadEntradas(tipoEntradas, formaPagos, hora_apertura, hora_cierre);
      //await loadPagosAnticipados(tipoEntradas, formaPagos, hora_apertura, hora_cierre);
    }
  }

  const loadTipoEntradas = async (corte) => {
    const response = await showAllTipoEntradas();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const tipoEntradas = response.data;
      await loadMetodoPagos(tipoEntradas, corte.hora_apertura, corte.hora_cierre);
    }
  }

  const loadTipoSalidas = async (corte) => {
    const response = await showAllTipoSalidas();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const tipoSalidas = response.data;
      await loadSalidas(tipoSalidas, corte.hora_apertura, corte.hora_cierre);
    }
  }

  const handleOpenNuevoEntrada = () => {
    setOpenModalNuevoEntrada(true);
  };

  const handleOpenNuevoSalida = () => {
    setOpenModalNuevoSalida(true);
  };

  const handleOpenImprimir = () => {
    const newEntradas = [...dataEntradas, ...dataPagosAnticipados];

    navigate('/imprimir/corte',
      {
        state: {
          empleado: empleado,
          sucursal: sucursal,
          colorBase: colorBase,
          corte: corte,
          dataEntradas: newEntradas,
          dataPagosAnticipados: dataPagosAnticipados,
          dataSalidas: dataSalidas,
        }
      });
  }

  // const handleOpenImprimir = () => {
  //   setOpenModalInmprimir(true);
  // };

  const handleClose = () => {
    setOpenModalNuevoEntrada(false);
    setOpenModalNuevoSalida(false);
    setOpenModalInmprimir(false);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleObtenerInformacion = async (reqTurno) => {
    setIsLoading(true);
    const response = await showCorteTodayBySucursalAndTurno(sucursal, reqTurno ? reqTurno : turno);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const resCorte = response.data;
      setCorte(resCorte);
      await loadTipoEntradas(resCorte);
      await loadTipoSalidas(resCorte);
    }
    setIsLoading(false);

  };

  const turnoActual = async () => {
    const response = await findTurnoActualBySucursal(sucursal);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const corte = response.data;
      setTurno(corte.turno);
      handleObtenerInformacion(corte.turno);
    }
  }

  const handleCambioTurno = () => {
    setTurno(turno === 'm' ? 'v' : 'm');
  };

  useEffect(() => {
    turnoActual();
  }, []);

  const handleGuardarCorte = async () => {
    const create_date = new Date();
    create_date.setHours(create_date.getHours());
    const newCorte = {
      create_date: create_date,
      turno: turno,
      entradas: entradas,
      pagos_anticipados: pagosAnticipados,
      salidas: salidas,
      recepcionista: empleado._id,
      sucursal: sucursal._id,
    }
    const response = await createCorte(newCorte);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      setSeverity('success');
      setMessage("CORTE GUARDADO CORRECTAMENTE.");
      setOpenAlert(true);
      turnoActual();
    }
  }

  const handleGenerarCorte = async () => {
    corte.salidas = salidas.map((salida) => {
      return salida._id;
    });
    corte.entradas = entradas.map((entrada) => {
      return entrada._id;
    });
    corte.pagos_anticipados = pagosAnticipados.map((pagoAnticipado) => {
      return pagoAnticipado._id;
    });
    corte.generado = true;
    corte.recepcionista = empleado._id;
    const response = await updateCorte(corte._id, corte);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setSeverity('success');
      setMessage("EL CORTE SE GENERO.");
      setOpenAlert(true);
      turnoActual();
    }
  }

  const handleCerrarCorte = async () => {
    const date = new Date();
    corte.hora_cierre = date;
    corte.recepcionista = empleado._id;
    const response = await updateCorte(corte._id, corte);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setSeverity('success');
      setMessage("CORTE CERRADO.");
      setOpenAlert(true);
      turnoActual();
      if (corte.turno === 'm') {
        const newCorte = {
          create_date: date,
          hora_apertura: date,
          turno: 'v',
          sucursal: sucursal,
          recepcionista: empleado._id,
        }
        await createCorte(newCorte);
      }
    }
  }

  return (
    <Fragment>
      {
        !isLoading ?
          <CorteContainer
            actions={actions}
            columnsEntrada={columnsEntrada}
            columnsSalida={columnsSalida}
            tituloEntrada='ENTRADAS'
            tituloPagoAnticipado='PAGOS ANTICIPADOS'
            tituloSalida='SALIDAS'
            options={options}
            openModalNuevoEntrada={openModalNuevoEntrada}
            openModalNuevoSalida={openModalNuevoSalida}
            openModalImprimir={openModalImprimir}
            dataEntradas={dataEntradas}
            dataSalidas={dataSalidas}
            dataPagosAnticipados={dataPagosAnticipados}
            handleOpenNuevoEntrada={handleOpenNuevoEntrada}
            handleOpenNuevoSalida={handleOpenNuevoSalida}
            handleOpenImprimir={handleOpenImprimir}
            handleClose={handleClose}
            turno={turno}
            onCambioTurno={() => handleCambioTurno()}
            onObtenerInformacion={() => handleObtenerInformacion()}
            turnoActual={() => turnoActual()}
            sucursal={sucursal}
            empleado={empleado}
            colorBase={colorBase}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            setSeverity={setSeverity}
            detailPanelEntrada={detailPanelEntrada}
            detailPanelSalida={detailPanelSalida}
            handleGuardarCorte={() => handleGuardarCorte()}
            handleCerrarCorte={() => handleCerrarCorte()}
            onGenerarCorte={() => handleGenerarCorte()}
            corte={corte}
          /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
      <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Fragment>
  );
}

export default Corte;