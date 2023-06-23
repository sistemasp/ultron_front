import 'date-fns';
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import { Paper } from '@material-ui/core';
import myStyles from '../../../../css';
import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { Label } from '@material-ui/icons';
import { ButtonCustom } from '../../../../components/basic/ButtonCustom';

export const AlergiasContainer = (props) => {

  const {
    consultorio,
    colorBase,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item xs={6} >
          <Paper className={classes.paper_item}>
            <FormGroup>
              <h3>ALERGIAS MAS COMUNES</h3>
              <FormControlLabel control={<Checkbox />} label="ALERGIAS NEGADAS" />
              <FormControlLabel control={<Checkbox />} label="ACAROS" />
              <FormControlLabel control={<Checkbox />} label="ALIMENTOS" />
              <FormControlLabel control={<Checkbox />} label="CHOCOLATE" />
              <FormControlLabel control={<Checkbox />} label="FRUTOS SECOS" />
              <FormControlLabel control={<Checkbox />} label="HONGOS" />
              <FormControlLabel control={<Checkbox />} label="HUMEDAD" />
              <FormControlLabel control={<Checkbox />} label="LATEX" />
              <FormControlLabel control={<Checkbox />} label="MARISCOS" />
              <FormControlLabel control={<Checkbox />} label="MASCOTAS" />
              <FormControlLabel control={<Checkbox />} label="MOHO" />
              <FormControlLabel control={<Checkbox />} label="NIQUEL" />
              <FormControlLabel control={<Checkbox />} label="PICADURA INSECTOS" />
              <FormControlLabel control={<Checkbox />} label="POLEN" />
              <FormControlLabel control={<Checkbox />} label="POLVO" />
              <FormControlLabel control={<Checkbox />} label="SOL" />
            </FormGroup>
          </Paper>
        </Grid>
        <Grid item xs={6} >
          <Paper className={classes.paper_item}>
            <FormGroup>
              <h3>ALERGIAS A MEDICAMENTOS</h3>
              <TextField 
                id="alergias_medicamentos"
                fullWidth
                multiline />
              <br/>
              <ButtonCustom
                className={classes.button}
                type="submit"
                color="primary"
                variant="contained"
                // onClick={handleSubmit}
                text='GUARDAR' />
            </FormGroup>   
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
}
