import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Grid } from '@material-ui/core';
import bannerMePiel from './../../../bannerMePiel.PNG';
import bannerDermastetic from './../../../bannerDermastetic.jpeg';
import { addZero, precioAreaBySucursal, toFormatterCurrency } from '../../../utils/utils';
import myStyles from '../../../css';
import { ButtonCustom } from '../../../components/basic/ButtonCustom';
import { dermatologoDirectoId } from '../../../utils/constants';

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
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    paddingLeft: 15
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

const FormTratamiento = (props) => {

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    datos,
    sucursal,
    onClickImprimir,
    hadleClickBack,
    show,
    colorBase,
  } = props;

  const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
  const sucursalRubenDarioId = process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID;
  const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
  const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;

  const classes = myStyles(colorBase)();

  const fecha = new Date();

  const calcularDescuento = (datos) => {
    const descuentoClinica = datos.descuento_clinica;
    const descuentoDermatologo = (datos.precio - descuentoClinica) * datos.descuento_dermatologo / 100;
    const descuentoTotal = descuentoClinica - descuentoDermatologo;
    return descuentoTotal;
  }

  return (
    <Fragment
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description" >
      <img
        src={sucursal._id === sucursalManuelAcunaId || sucursal._id === sucursalRubenDarioId ? bannerDermastetic : bannerMePiel}
        alt='banner'
        width="360" />
      <Grid container>
        <Grid item xs={12} className={classes.label}>
          <h2 className={classes.label}>{datos.sucursal.nombre}</h2>
        </Grid>
        <Grid item xs={true}>
          <h2 className={classes.label_left}>FOLIO: {datos.folio}</h2>
        </Grid>
        <Grid item xs={true}>
          <h3 className={classes.label_right}>{`${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${addZero(fecha.getFullYear())}`}</h3>
        </Grid>
        <Grid item xs={12} className={classes.label_left}>
          <h4 className={classes.label_left}>PACIENTE: {datos.paciente_nombre}</h4>
        </Grid>
        {
          dermatologoDirectoId !== datos.dermatologo._id
            ? <Grid item xs={12} className={classes.label_left}>
              <h4 className={classes.label_left}>DERMATÓLOGO: {datos.dermatologo_nombre}</h4>
            </Grid>
            : ''
        }
        <hr />
        {
          datos.tratamientos.map(tratamiento => {
            return <Fragment>
              <Grid item xs={12}>
                <h3 className={classes.labelItemLeft}>{`${tratamiento.nombre}:`}</h3>
              </Grid>
              <br />
              {
                tratamiento.areasSeleccionadas.map(area => {
                  return <Fragment>
                    <Grid item xs={9}>
                      <h4 className={classes.labelSubItemLeft}>{`${area.nombre}`}</h4>
                    </Grid>
                    <Grid item xs={3}>
                      <h4 className={classes.labelItemRight}> {toFormatterCurrency(precioAreaBySucursal(sucursal, area))} </h4>
                    </Grid>
                  </Fragment>
                })
              }
            </Fragment>
          })
        }
        <br />
        {
          datos.has_descuento_dermatologo || (datos.descuento_clinica && datos.descuento_clinica !== "0")
            ? <Fragment>
              <Grid item xs={12} className={classes.labelItemRight}>
                <h2 className={classes.labelItemRight}>PRECIO NORMAL: {datos.precio_moneda}</h2>
              </Grid>
              <Grid item xs={12} className={classes.labelItemRight}>
                <h2 className={classes.labelItemRight}>DESCUENTO: {toFormatterCurrency(calcularDescuento(datos))}</h2>
              </Grid>
            </Fragment>
            : ''
        }

        <Grid item xs={12} className={classes.labelItemRight}>
          <h1 className={classes.labelItemRight}>TOTAL A PAGAR: {datos.total_moneda}</h1>
        </Grid>

        <Grid item xs={12}>
          <p className={classes.label_foot}>*ESTE TICKET NO REPRESENTA UN COMPROBANTE FISCAL.*</p>
        </Grid>

        {
          show ?
            <Fragment>
              <Grid item xs={6}>
                <ButtonCustom
                  className={classes.buttonCancel}
                  color="secondary"
                  variant="contained"
                  onClick={hadleClickBack}
                  text='CERRAR' />
              </Grid>

              <Grid item xs={6}>
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
    </Fragment>
  );
}

export default FormTratamiento;