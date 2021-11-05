import React, { useState, useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core';
import FormImprimirCorte from './FormImprimirCorte';
import {
  showAllTipoSalidas,
  showAllMetodoPago,
} from '../../../services';
import { showAllTipoEntradas } from '../../../services/tipo_entradas';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ImprimirCorte = (props) => {

  const classes = useStyles();

  
  const {
    history,
  } = props;

  const {
    dataEntradas,
    dataPagosAnticipados,
    dataSalidas,
    corte,
    empleado,
    sucursal,
  } = props.location.state;

  const [show, setShow] = useState(true);
  const [tipoEntradas, setTipoEntradas] = useState([]);
  const [tipoSalidas, setTipoSalidas] = useState([]);
  const [formaPagos, setMetodoPagos] = useState([]);

  const handleClickImprimir = (e) => {
    setShow(false);
    setTimeout(() => {
      window.print();
    }, 0);
    setTimeout(() => { setShow(true); }, 15);
  }

  const handleReturn = () => {
    history.goBack();
  }

  useEffect(() => {

    const loadTipoEntrada = async () => {
      const response = await showAllTipoEntradas();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setTipoEntradas(response.data);
      }
    }

    const loadTipoSalida = async () => {
      const response = await showAllTipoSalidas();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setTipoSalidas(response.data);
      }
    }

    const loadMetodoPago = async () => {
      const response = await showAllMetodoPago();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setMetodoPagos(response.data);
      }
    }

    loadTipoEntrada();
    loadTipoSalida();
    loadMetodoPago();
  }, []);

  return (
    <Fragment>
      <FormImprimirCorte
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        corte={corte}
        empleado={empleado}
        sucursal={sucursal}
        onClickImprimir={handleClickImprimir}
        onReturn={handleReturn}
        show={show}
        tipoEntradas={tipoEntradas}
        tipoSalidas={tipoSalidas}
        formaPagos={formaPagos}
        dataEntradas={dataEntradas}
        dataPagosAnticipados={dataPagosAnticipados}
        dataSalidas={dataSalidas} />
    </Fragment>

  );
}

export default ImprimirCorte;