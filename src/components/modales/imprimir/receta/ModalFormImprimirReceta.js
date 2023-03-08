import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Grid } from '@material-ui/core';
import bannerMePiel from './../../../../bannerMePiel.PNG';
import bannerDermastetic from './../../../../bannerDermastetic.jpeg';
import { addZero, dateToString } from '../../../../utils/utils';
import { ButtonCustom } from '../../../basic/ButtonCustom';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 850,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
  },
  textField: {
    width: '100%',
  },
  formControl: {
    minWidth: 120,
    width: '100%',
  },
  button: {
    width: '100%',
    color: '#FFFFFF',
  },
  label: {
    marginTop: '0px',
    marginBottom: '0px',
    textAlign: 'center',
  },
  label_left: {
    marginTop: '0px',
    marginBottom: '0px',
    marginLeft: '10px',
    textAlign: 'left',
  },
  label_right: {
    marginTop: '0px',
    marginBottom: '0px',
    marginRight: '10px',
    textAlign: 'right',
  },
  label_foot: {
    fontSize: '11px',
    marginTop: '0px',
    marginRight: '10px',
    marginBottom: '10px',
    textAlign: 'right',
    fontWeight: 'bold',
  }
}));

const ModalFormImprimirReceta = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    onClose,
    sucursal,
    consultorio,
    receta,
    today,
    edad,
    onClickImprimir,
    open,
    show,
  } = props;

  const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
  const sucursalRubenDarioId = process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID;
  const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
  const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>

          <Grid container>
          <Grid item xs={3}>
              <img
                src={sucursal === sucursalManuelAcunaId || sucursal === sucursalRubenDarioId ? bannerDermastetic : bannerMePiel}
                alt='banner'
                width='100%'
                height='100%' />
            </Grid>
            <Grid item xs={12} sm={5} className={classes.label_right}>
              <h4>DERMATOLÓGO: {`${receta.dermatologo.nombre}`}</h4>
            </Grid>
            <Grid item xs={12} sm={true} className={classes.label_right}>
              <h4>CÉDULA: {`${receta.dermatologo.cedula}`}</h4>
            </Grid>
            <Grid item xs={12} sm={5} className={classes.label_left}>
              <h3>PACIENTE: {`${consultorio.paciente.nombres} ${consultorio.paciente.apellidos}`}</h3>
            </Grid>
            <Grid item xs={12} sm={true} className={classes.label_right}>
              <h3 >EDAD: {`${edad} `}</h3>
            </Grid>
            <Grid item xs={12} sm={true} className={classes.label_right}>
              <h3>CONSULTA: {`${dateToString(consultorio.consulta.fecha_hora)}`}</h3>
            </Grid>
            <h1><br /></h1>
            {
              receta.productos.map((producto, index) => {
                return <Fragment>
                  <Grid container>
                    <Grid item xs={true} className={classes.label_left}>
                      <h3 className={classes.label_left}>
                        {`${index + 1} - ${producto.nombre_producto} (LAB: ${producto.nombre_laboratorio}) / ${producto.recomendacion}`}
                      </h3>
                    </Grid>
                  </Grid>
                </Fragment>
              })
            }
            <Grid item xs={12} sm={12} className={classes.label_right}>
              <h3>PRÓXIMA CONSULTA: {`${dateToString(receta.fecha_proxima_consulta)}`}</h3>
            </Grid>
            {
              show ?
                <Fragment>
                  <Grid item xs={12} sm={6}>
                    <ButtonCustom
                      className={classes.button}
                      color="secondary"
                      variant="contained"
                      onClick={onClose}
                      text='CERRAR' />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <ButtonCustom
                      className={classes.button}
                      color="primary"
                      variant="contained"
                      onClick={onClickImprimir}
                      text='IMPRIMIR' />
                  </Grid>
                </Fragment> : ''

            }
          </Grid>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFormImprimirReceta;