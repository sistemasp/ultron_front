import 'date-fns';
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import { Paper } from '@material-ui/core';
import myStyles from '../../../../css';
import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { Label } from '@material-ui/icons';
import { ButtonCustom } from '../../../../components/basic/ButtonCustom';
import { CheckCustom } from '../../../../components/basic/CheckCustom';

export const AlergiasContainer = (props) => {

  const {
    consultorio,
    colorBase,
    alergias,
    onChangeCheck,
    onChange,
    onClickGuardar,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item xs={6} >
          <Paper className={classes.paper_item}>
            <FormGroup>
              <h3>ALERGIAS MAS COMUNES</h3>
              <CheckCustom checked={alergias.alergias_negadas} onChange={onChangeCheck} name="alergias_negadas" label="ALERGIAS NEGADAS" />
              <CheckCustom checked={alergias.acaros} onChange={onChangeCheck} name="acaros" label="ACAROS" />
              <CheckCustom checked={alergias.alimentos} onChange={onChangeCheck} name="alimentos" label="ALIMENTOS" />
              <CheckCustom checked={alergias.chocolate} onChange={onChangeCheck} name="chocolate" label="CHOCOLATE" />
              <CheckCustom checked={alergias.frutos_secos} onChange={onChangeCheck} name="frutos_secos" label="FRUTOS SECOS" />
              <CheckCustom checked={alergias.hongos} onChange={onChangeCheck} name="hongos" label="HONGOS" />
              <CheckCustom checked={alergias.humedad} onChange={onChangeCheck} name="humedad" label="HUMEDAD" />
              <CheckCustom checked={alergias.latex} onChange={onChangeCheck} name="latex" label="LATEX" />
              <CheckCustom checked={alergias.mariscos} onChange={onChangeCheck} name="mariscos" label="MARISCOS" />
              <CheckCustom checked={alergias.mascotas} onChange={onChangeCheck} name="mascotas" label="MASCOTAS" />
              <CheckCustom checked={alergias.moho} onChange={onChangeCheck} name="moho" label="MOHO" />
              <CheckCustom checked={alergias.niquel} onChange={onChangeCheck} name="niquel" label="NIQUEL" />
              <CheckCustom checked={alergias.picadura_insectos} onChange={onChangeCheck} name="picadura_insectos" label="PICADURA INSECTOS" />
              <CheckCustom checked={alergias.polen} onChange={onChangeCheck} name="polen" label="POLEN" />
              <CheckCustom checked={alergias.polen} onChange={onChangeCheck} name="polen" label="POLVO" />
              <CheckCustom checked={alergias.sol} onChange={onChangeCheck} name="sol" label="SOL" />
            </FormGroup>
          </Paper>
        </Grid>
        <Grid item xs={6} >
          <Paper className={classes.paper_item}>
            <FormGroup>
              <h3>ALERGIAS A MEDICAMENTOS</h3>
              <TextField 
                id="alergias_a_medicamentos"
                name="alergias_a_medicamentos"
                value={alergias.alergias_a_medicamentos}
                fullWidth
                onChange={onChange}
                multiline />
              <br/>
              <ButtonCustom
                className={classes.button}
                type="submit"
                color="primary"
                variant="contained"
                onClick={onClickGuardar}
                text='GUARDAR' />
            </FormGroup>   
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
}
