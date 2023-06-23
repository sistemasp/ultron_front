import 'date-fns';
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import { Paper } from '@material-ui/core';
import myStyles from '../../../../css';
import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { Label } from '@material-ui/icons';
import ECTReactComponent from '../../../../components/ect/ect';

export const ExpedienteElectronicoContainer = (props) => {

  const {
    consultorio,
    colorBase,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12} >
          <Paper className={classes.paper_item}>
            <Grid item xs={12} className={classes.textFieldFullWidth}>
              <TextField 
                id="fullWidth"
                fullWidth
                multiline
                label="MOTIVO DE LA CONSULTA" />
            </Grid>
            <Grid item xs={12} className={classes.textFieldFullWidth}>
              <TextField 
                id="fullWidth"
                fullWidth
                multiline
                label="INTERROGATORIO" />
            </Grid>
            <Grid item xs={12} className={classes.textFieldFullWidth}>
              <TextField 
                id="fullWidth"
                fullWidth
                multiline
                label="TOPOLOGÍA" />
            </Grid>
            <Grid item xs={12} className={classes.textFieldFullWidth}>
              <TextField 
                id="fullWidth"
                fullWidth
                multiline
                label="MORFOLOGÍA" />
            </Grid>
            <Grid item xs={12} className={classes.textFieldFullWidth}>
              <TextField 
                id="fullWidth"
                fullWidth
                multiline
                label="DIAGNOSTICO CIE-11" />
            </Grid>
            <Grid item xs={12} >
              <ECTReactComponent />
            </Grid>
            <Grid item xs={12} className={classes.textFieldFullWidth}>
              <TextField 
                id="fullWidth"
                fullWidth
                multiline
                label="NOTAS DE EVOLUCIÓN" />
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
}
