import 'date-fns';
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import { Paper } from '@material-ui/core';
import myStyles from '../../../../css';
import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { Label } from '@material-ui/icons';

export const AntecedentesHeredofamiliaresContainer = (props) => {

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
            <Grid container>
              <Grid item xs={4}>
                
              </Grid>
              <Grid item xs={true}>
                <h3>PADRE</h3>
              </Grid>
              <Grid item xs={true}>
                <h3>MADRE</h3>
              </Grid>
              <Grid item xs={true}>
                <h3>ABUELOS PATERNOS</h3>
              </Grid>
              <Grid item xs={true}>
                <h3>ABUELOS MATERNOS</h3>
              </Grid>
              <Grid item xs={true}>
                <h3>HERMANOS</h3>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                DIABETES MELLITUS
              </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_padre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_madre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_ap"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_am"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_hermanos"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                HIPERTENSIÓN ARTERIAL SISTÉMICA
              </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_padre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_madre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_ap"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_am"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_hermanos"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                DISLIPIDEMIAS
              </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_padre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_madre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_ap"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_am"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_hermanos"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                NEOPLÁSIAS
              </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_padre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_madre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_ap"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_am"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_hermanos"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                MALFORMAICONES HEREDITARIAS / CONGÉNITAS
              </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_padre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_madre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_ap"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_am"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_hermanos"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                ALERGIAS
              </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_padre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_madre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_ap"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_am"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_hermanos"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                ENFERMEDADES PSIQUIATRICAS
              </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_padre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_madre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_ap"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_am"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_hermanos"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                ENFERMEDADES NEUROLÓGICAS
              </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_padre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_madre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_ap"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_am"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_hermanos"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                ENFERMEDADES CARDIOVASCULARES
              </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_padre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_madre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_ap"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_am"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_hermanos"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                ENFERMEDADES BRONCOPULMONARES
              </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_padre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_madre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_ap"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_am"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_hermanos"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                ENFERMEDADES TIROIDEAS
              </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_padre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_madre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_ap"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_am"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_hermanos"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                ENFERMEDADES RENALES
              </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_padre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_madre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_ap"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_am"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_hermanos"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                ENFERMEDADES OSTEOARTICULARES
              </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_padre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_madre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_ap"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_am"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_hermanos"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                ENFERMEDADES INFECTOCONTAGIOSAS
              </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_padre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_madre"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_ap"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_am"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
                <Grid item xs={true}>
                  <FormControlLabel 
                    id="diabetes_mellitus_hermanos"
                    control={<Checkbox />} 
                    label="" />
                </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
}
