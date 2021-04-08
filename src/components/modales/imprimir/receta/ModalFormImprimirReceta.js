import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Grid } from '@material-ui/core';
import bannerMePiel from './../../../../bannerMePiel.PNG';
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
    consultorio,
    receta,
    today,
    edad,
    onClickImprimir,
    open,
    show,
  } = props;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>

          <Grid container>
            <Grid item xs={12} className={classes.label_right}>
              <h3 >{`${edad} ${dateToString(today)}`}</h3>
            </Grid>
            <Grid item xs={12} sm={8} className={classes.label_left}>
              <h3>{`${consultorio.paciente.nombres} ${consultorio.paciente.apellidos}`}</h3>
            </Grid>
            <Grid item xs={12} sm={true} className={classes.label_right}>
              <h3>{`${dateToString(consultorio.consulta.fecha_hora)}`}</h3>
            </Grid>
            <h1><br /></h1>
            {
              receta.productos.map((producto, index) => {
                return <Fragment>
                  <Grid item xs={12} className={classes.label}>
                    <h2 className={classes.label}>
                      {`${index + 1}- (${producto.laboratorio.nombre}) ${producto.producto.nombre}`}
                    </h2>
                  </Grid>
                  <Grid item xs={12} className={classes.label}>
                    <h2 className={classes.label}>
                      {`${producto.recomendacion}`}
                    </h2>
                  </Grid>
                  <Grid item xs={12}>
                    <br />
                  </Grid>

                </Fragment>
              })
            }

            {
              show ?
                <Fragment>
                  <Grid item xs={12} sm={6}>
                    <ButtonCustom
                      className={classes.button}
                      color="primary"
                      variant="contained"
                      onClick={onClickImprimir}
                      text='IMPRIMIR' />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <ButtonCustom
                      className={classes.button}
                      color="secondary"
                      variant="contained"
                      onClick={onClose}
                      text='CERRAR' />
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