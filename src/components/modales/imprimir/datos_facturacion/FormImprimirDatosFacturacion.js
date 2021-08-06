import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Grid } from '@material-ui/core';
import bannerMePiel from './../../../../bannerMePiel.PNG';
import bannerDermastetic from './../../../../bannerDermastetic.jpeg';
import { addZero } from '../../../../utils/utils';
import { ButtonCustom } from '../../../basic/ButtonCustom';
import myStyles from '../../../../css';

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

const FormImprimirDatosFacturacion = (props) => {

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    datos,
    sucursal,
    onClose,
    onClickImprimir,
    open,
    servicio,
    show,
    colorBase,
  } = props;

  const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
  const sucursalRubenDarioId = process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID;
  const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
  const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;

  const classes = myStyles(colorBase)();

  const fecha = new Date();

  console.log("KAOZ", datos);

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper_95}>
          <Grid container>
            <Grid item xs={12} className={classes.label}>
              <h2 className={classes.label}>{`RAZON SOCIAL: ${datos.nombre_completo}`}</h2>
            </Grid>
            <Grid item xs={12} className={classes.label}>
              <h2 className={classes.label}>{`DOMICILIO: ${datos.domicilio_completo}`}</h2>
            </Grid>
            <Grid item xs={12} className={classes.label}>
              <h2 className={classes.label}>{`COLONIA: ${datos.colonia}`}</h2>
            </Grid>
            <Grid item xs={12} className={classes.label}>
              <h2 className={classes.label}>{`MUNUCIPIO: ${datos.municipio}`}</h2>
            </Grid>
            <Grid item xs={12} className={classes.label}>
              <h2 className={classes.label}>{`ESTADO: ${datos.estado}`}</h2>
            </Grid>
            <Grid item xs={12} className={classes.label}>
              <h2 className={classes.label}>{`CP: ${datos.codigo_postal}`}</h2>
            </Grid>
            <Grid item xs={12} className={classes.label}>
              <h2 className={classes.label}>{`TELEFONO: ${datos.telefono}`}</h2>
            </Grid>
            <Grid item xs={12} className={classes.label}>
              <h2 className={classes.label}>{`RFC: ${datos.rfc}`}</h2>
            </Grid>
            <Grid item xs={12} className={classes.label}>
              <h2 className={classes.label}>{`CORREO: ${datos.email}`}</h2>
            </Grid>

            {
              show ?

                <Fragment>
                  <Grid item xs={6}>
                    <ButtonCustom
                      className={classes.buttonCancel}
                      color="secondary"
                      variant="contained"
                      onClick={onClose}
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
        </div>
      </Modal>
    </div>
  );
}

export default FormImprimirDatosFacturacion;