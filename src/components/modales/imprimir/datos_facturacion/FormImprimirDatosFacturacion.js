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
  const top = 20;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${50}%, -${50}%)`,
  };
}

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

  const classes = myStyles(colorBase)();

  const fecha = new Date();
  
  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper_factura}>
          <Grid container>
            <Grid item xs={true} className={classes.label_left}>
              <h4 className={classes.label_left}>{`PACIENTE: ${datos.paciente_nombre}`}</h4>
            </Grid>
            <Grid item xs={true} className={classes.label_right}>
              <h4 className={classes.label_right}>{`RFC: ${datos.factura.razon_social.rfc}`}</h4>
            </Grid>
            <Grid item xs={12} className={classes.label_left}>
              <h4 className={classes.label_left}>{`RAZON SOCIAL: ${datos.factura.razon_social.nombre_completo}`}</h4>
            </Grid>
            <Grid item xs={true} className={classes.label_left}>
              <h4 className={classes.label_left}>{`ESTADO: ${datos.factura.razon_social.estado}`}</h4>
            </Grid>
            <Grid item xs={true} className={classes.label}>
              <h4 className={classes.label}>{`MUNUCIPIO: ${datos.factura.razon_social.municipio}`}</h4>
            </Grid>            
            <Grid item xs={true} className={classes.label_right}>
              <h4 className={classes.label_right}>{`CP: ${datos.factura.razon_social.codigo_postal}`}</h4>
            </Grid>
            <Grid item xs={12} className={classes.label_left}>
              <h4 className={classes.label_left}>{`COLONIA: ${datos.factura.razon_social.colonia}`}</h4>
            </Grid>
            <Grid item xs={12} className={classes.label_left}>
              <h4 className={classes.label_left}>{`DOMICILIO: ${datos.domicilio_completo}`}</h4>
            </Grid>
            <Grid item xs={true} className={classes.label_left}>
              <h4 className={classes.label_left}>{`TELEFONO: ${datos.factura.razon_social.telefono}`}</h4>
            </Grid>
            <Grid item xs={true} className={classes.label_right}>
              <h4 className={classes.label_right}>{`CORREO: ${datos.factura.razon_social.email}`}</h4>
            </Grid>
            <Grid item xs={12} className={classes.label_left}>
              <h4 className={classes.label_left}>{`USO CFDI: ${datos.uso_cfdi}`}</h4>
            </Grid>
            <Grid item xs={12} className={classes.label_left}>
              <h4 className={classes.label_left}>{`SERVICIO: ${datos.servicio.nombre}`}</h4>
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