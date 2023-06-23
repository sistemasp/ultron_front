import 'date-fns';
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import { Paper } from '@material-ui/core';
import myStyles from '../../../../css';
import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { Label } from '@material-ui/icons';
import { ButtonCustom } from '../../../../components/basic/ButtonCustom';

export const AntecedentesPersonalesNoPatologicosContainer = (props) => {

  const {
    consultorio,
    colorBase,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12} className={classes.gridItemRight}>
          <Paper className={classes.paper_item}>
            <Grid item xs={12} className={classes.textFieldFullWidth}>
              <TextField 
                id="fullWidth"
                fullWidth
                multiline
                label="TABAQUISMO (CIG/DIA/AÑOS)" />
            </Grid>
            <Grid item xs={12} className={classes.textFieldFullWidth}>
              <TextField 
                id="fullWidth"
                fullWidth
                multiline
                label="ALCOHOLISMO (BEB/FREC)" />
            </Grid>
            <Grid item xs={12} className={classes.textFieldFullWidth}>
              <TextField 
                id="fullWidth"
                fullWidth
                multiline
                label="TOXICOMANIAS (ESP/DIA/AÑOS)" />
            </Grid>
            <Grid item xs={12} className={classes.textFieldFullWidth}>
              <TextField 
                id="fullWidth"
                fullWidth
                multiline
                label="ALIMENTACIÓN (F/TIPO)" />
            </Grid>
            <Grid item xs={12} className={classes.textFieldFullWidth}>
              <TextField 
                id="fullWidth"
                fullWidth
                multiline
                label="DEPORTES (ACT. FISICA/FREC)" />
            </Grid>
            <Grid item xs={12} className={classes.textFieldFullWidth}>
              <TextField 
                id="fullWidth"
                fullWidth
                multiline
                label="INMUNIZACIONES" />
            </Grid>
            <Grid item xs={12} className={classes.textFieldFullWidth}>
              <ButtonCustom
                className={classes.button}
                type="submit"
                color="primary"
                variant="contained"
                // onClick={handleSubmit}
                text='GUARDAR' />
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
}
