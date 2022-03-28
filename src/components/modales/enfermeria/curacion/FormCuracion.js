import React, { Fragment } from 'react';
import Modal from '@material-ui/core/Modal';
import { TextField, FormControl, InputLabel, Select, MenuItem, Grid } from '@material-ui/core';
import { ButtonCustom } from '../../../basic/ButtonCustom';
import { ComboCustom } from "../../../../components/basic/ComboCustom";
import myStyles from '../../../../css';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    overflow: 'scroll',
  };
}

const FormCuracion = (props) => {
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    onClose,
    onClickGurardar,
    open,
    onChangeMotivos,
    onChangeNombre,
    onChangeTipo,
    onChangeArea,
    motivos,
    curacionNombres,
    curacionTipos,
    areas,
    onChange,
    curacion,
    colorBase,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper_95}>

          <Grid container spacing={1}>
            <Grid item xs={12}>
              <h1 className={classes.label}>CURACIÓN </h1>
            </Grid>
            <Grid item xs={12}>
              <h2 className={classes.label}>{`${curacion.paciente.nombres} ${curacion.paciente.apellidos}`} </h2>
            </Grid>

            <Grid item xs={12} >
              <FormControl variant="outlined" className={classes.formControl}>
                <ComboCustom
                  label='NOMBRE DE LA CURACIÓN'
                  value={values.curacion_nombre}
                  onChange={onChangeNombre}
                  options={curacionNombres} />
              </FormControl>
            </Grid>

            <Grid item xs={12} >
              <FormControl variant="outlined" className={classes.formControl}>
                <ComboCustom
                  label='TIPO DE LA CURACIÓN'
                  value={values.curacion_tipo}
                  onChange={onChangeTipo}
                  options={curacionTipos} />
              </FormControl>
            </Grid>

            <Grid item xs={12} >
              <FormControl variant="outlined" className={classes.formControl}>
                <ComboCustom
                  label='ÁREA'
                  value={values.curacion_area}
                  onChange={onChangeArea}
                  options={areas} />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                className={classes.textField}
                name="observaciones"
                label="OBSERVACIONES"
                value={values.observaciones}
                onChange={onChange}
                variant="outlined" />
            </Grid>

            <Grid item xs={12}>
            </Grid>

            <Grid item xs={12} sm={6}>
              <ButtonCustom
                className={classes.buttonCancel}
                color="secondary"
                variant="contained"
                onClick={() => onClose(curacion.create_date)}
                text="CANCELAR" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ButtonCustom
                className={classes.button}
                color="primary"
                variant="contained"
                disabled={!values.curacion_nombre || !values.curacion_tipo || !values.curacion_area}
                onClick={() => onClickGurardar(values)}
                text="GUARDAR" />
            </Grid>
          </Grid>
        </div>
      </Modal>
    </div>
  );
}

export default FormCuracion;