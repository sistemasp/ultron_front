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
    antecedentesPersonalesNoPatologicos,
    onChange,
    onClickGuardar,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12} className={classes.gridItemRight}>
          <Paper className={classes.paper_item}>
            <Grid item xs={12} className={classes.textFieldFullWidth}>
              <TextField 
                id="tabaquismo"
                name="tabaquismo"
                value={antecedentesPersonalesNoPatologicos.tabaquismo}
                onChange={onChange}
                fullWidth
                multiline
                label="TABAQUISMO (CIG/DIA/AÑOS)" />
            </Grid>
            <Grid item xs={12} className={classes.textFieldFullWidth}>
              <TextField 
                id="alcoholismo"
                name="alcoholismo"
                value={antecedentesPersonalesNoPatologicos.alcoholismo}
                onChange={onChange}
                fullWidth
                multiline
                label="ALCOHOLISMO (BEB/FREC)" />
            </Grid>
            <Grid item xs={12} className={classes.textFieldFullWidth}>
              <TextField 
                id="toxicomanias"
                name="toxicomanias"
                value={antecedentesPersonalesNoPatologicos.toxicomanias}
                onChange={onChange}
                fullWidth
                multiline
                label="TOXICOMANIAS (ESP/DIA/AÑOS)" />
            </Grid>
            <Grid item xs={12} className={classes.textFieldFullWidth}>
              <TextField 
                id="alimentacion"
                name="alimentacion"
                value={antecedentesPersonalesNoPatologicos.alimentacion}
                onChange={onChange}
                fullWidth
                multiline
                label="ALIMENTACIÓN (F/TIPO)" />
            </Grid>
            <Grid item xs={12} className={classes.textFieldFullWidth}>
              <TextField 
                id="deportes"
                name="deportes"
                value={antecedentesPersonalesNoPatologicos.deportes}
                onChange={onChange}
                fullWidth
                multiline
                label="DEPORTES (ACT. FISICA/FREC)" />
            </Grid>
            <Grid item xs={12} className={classes.textFieldFullWidth}>
              <TextField 
                id="inmunizaciones"
                name="inmunizaciones"
                value={antecedentesPersonalesNoPatologicos.inmunizaciones}
                onChange={onChange}
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
                onClick={onClickGuardar}
                text='GUARDAR' />
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
}
