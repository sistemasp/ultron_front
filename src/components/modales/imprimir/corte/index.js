import React, { useState, useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core';
import ModalFormImprimirCorte from './ModalFormImprimirCorte';
import {
  showAllTipoEntradas,
  showAllTipoSalidas,
  showAllMetodoPago,
} from '../../../../services';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalImprimirCorte = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    dataEntradas,
    dataPagosAnticipados,
    dataSalidas,
    corte,
    empleado,
    sucursal,
  } = props;

  const [show, setShow] = useState(true);
  const [tipoEntradas, setTipoEntradas] = useState([]);
  const [tipoSalidas, setTipoSalidas] = useState([]);
  const [formaPagos, setMetodoPagos] = useState([]);

  const handleClickImprimir = (e) => {
    setTimeout(() => {
      window.print();
    }, 500);
    setTimeout(() => { onClose(); }, 550);
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
    handleClickImprimir();
  }, []);

  return (
    <Fragment>
      <ModalFormImprimirCorte
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={onClose}
        corte={corte}
        empleado={empleado}
        sucursal={sucursal}
        onClickImprimir={handleClickImprimir}
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

export default ModalImprimirCorte;