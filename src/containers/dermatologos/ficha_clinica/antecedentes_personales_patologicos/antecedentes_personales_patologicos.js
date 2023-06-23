import 'date-fns';
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import { Paper } from '@material-ui/core';
import myStyles from '../../../../css';
import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { Label } from '@material-ui/icons';
import { ButtonCustom } from '../../../../components/basic/ButtonCustom';

export const AntecedentesPersonalesPatologicosContainer = (props) => {

  const {
    consultorio,
    colorBase,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper className={classes.paper_item}>
            <FormGroup>
              <h3>GENERALES</h3>
              <FormControlLabel control={<Checkbox />} label="HOSPITALIZACIONES" />
              <FormControlLabel control={<Checkbox />} label="QUIRÚRGICOS" />
              <FormControlLabel control={<Checkbox />} label="TRAUMÁTICOS" />
              <FormControlLabel control={<Checkbox />} label="TRANSFUSIONALES" />
            </FormGroup>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper_item}>
            <FormGroup>
              <h3>PATOLOGÍAS INFECTOCONTAGIOSAS</h3>
              <FormControlLabel control={<Checkbox />} label="FARINGOMIGDALITIS" />
              <FormControlLabel control={<Checkbox />} label="FIEBRE REUMÁTICA" />
              <FormControlLabel control={<Checkbox />} label="HEPATITIS" />
              <FormControlLabel control={<Checkbox />} label="PARASITOSIS" />
              <FormControlLabel control={<Checkbox />} label="TIFOIDEA" />
              <FormControlLabel control={<Checkbox />} label="TRANSMISIÓN SEXUAL" />
              <FormControlLabel control={<Checkbox />} label="TUBERCULOSIS" />
            </FormGroup>   
          </Paper>
        </Grid>
        <Grid item xs={true}>
          <Paper className={classes.paper_item}>
            <FormGroup>
              <h3>PATOLOGÍAS CRÓNICO-DEGENETATIVAS</h3>
              <FormControlLabel control={<Checkbox />} label="DIABETES MELITUS" />
              <FormControlLabel control={<Checkbox />} label="HIPERTENSIÓN ARTERIAL SISTÉMICA" />
              <FormControlLabel control={<Checkbox />} label="DISLIPIDEMIAS" />
              <FormControlLabel control={<Checkbox />} label="OBESIDAD" />
              <FormControlLabel control={<Checkbox />} label="NEOPLÁSICAS" />
              <FormControlLabel control={<Checkbox />} label="ENFERMEDADES REUMATOLÓGICAS" />
            </FormGroup>   
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper_item}>
            <FormGroup>
              <h3>PATOLOGÍAS EXANTEMÁTICAS</h3>
              <FormControlLabel control={<Checkbox />} label="EXANTEMA SÚBITO" />
              <FormControlLabel control={<Checkbox />} label="ROSÉOLA ESCARLATINA" />
              <FormControlLabel control={<Checkbox />} label="ROSÉOLA" />
              <FormControlLabel control={<Checkbox />} label="SARAMPIÓN" />
              <FormControlLabel control={<Checkbox />} label="VARICELA" />
              <FormControlLabel control={<Checkbox />} label="OTRA PATOLOGÍA EXANTEMÁTICA" />
            </FormGroup>
          </Paper>
        </Grid>
        <Grid item xs={true}>
          <Paper className={classes.paper_item}>
            <h3>OTROS ANTECEDENTES</h3>
            <TextField 
              id="fullWidth"
              fullWidth 
              multiline />
            <br/>
            <br/>
            <ButtonCustom
							className={classes.button}
							type="submit"
							color="primary"
							variant="contained"
							// onClick={handleSubmit}
							text='GUARDAR' />
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
}
