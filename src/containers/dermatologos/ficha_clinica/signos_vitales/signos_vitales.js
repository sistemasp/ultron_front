import 'date-fns';
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import { Paper } from '@material-ui/core';
import myStyles from '../../../../css';
import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { ButtonCustom } from "../../../../components/basic/ButtonCustom";
import TableComponent from '../../../../components/table/TableComponent';


export const SignosVitalesContainer = (props) => {

  const {
    consultorio,
    colorBase,
    titulo,
    columns,
    signosVitales,
    options,
    onClickGuardar,
    onChange,
    onChangePeso,
    onChangeAltura,
    dataComplete,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <Fragment>
      <Paper>
        <Grid container spacing={2}>
          <Grid item xs={true}>
            <TextField 
              id="tension_arterial"
              name="tension_arterial"
              value={signosVitales.tension_arterial}
              onChange={onChange}
              label="TENSION ARTERIAL" />
          </Grid>
          <Grid item xs={true}>
            <TextField 
              id="frecuencia_respiratoria"
              name="frecuencia_respiratoria"
              value={signosVitales.frecuencia_respiratoria}
              onChange={onChange}
              label="FRECUENCIA RESP (RESP/MIN)" />
          </Grid>
          <Grid item xs={true}>
            <TextField 
              id="frecuencia_cardiaca"
              name="frecuencia_cardiaca"
              value={signosVitales.frecuencia_cardiaca}
              onChange={onChange}
              label="FRECUENCIA CARDIACA (LAT/MIN)" />
          </Grid>
          <Grid item xs={true}>
            <TextField 
              id="temperatura"
              name="temperatura"
              value={signosVitales.temperatura}
              onChange={onChange}
              type='Number'
              onInput={(e) => {
								e.target.value = e.target.value < 0 ? 0 : e.target.value;
								e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 2)
							}}
              label="TEMPERATURA (C°)" />
          </Grid>
          <Grid item xs={true}>
            <TextField 
              id="peso"
              name="peso"
              value={signosVitales.peso}
              onChange={onChangePeso}
              type='Number'
              onInput={(e) => {
								e.target.value = e.target.value < 0 ? 0 : e.target.value;
								e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 3)
							}}
              label="PESO (KG)" />
          </Grid>
          <Grid item xs={true}>
            <TextField 
              id="altura"
              name="altura"
              value={signosVitales.altura}
              onChange={onChangeAltura}
              type='Number'
              onInput={(e) => {
								e.target.value = e.target.value < 0 ? 0 : e.target.value;
								e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 3)
							}}
              label="ALTURA (CM)" />
          </Grid>
          <Grid item xs={true}>
            <h2>
              IMC: {signosVitales.imc}
            </h2>
          </Grid>
          <ButtonCustom
							className={classes.button}
							type="submit"
							color="primary"
							variant="contained"
							onClick={onClickGuardar}
							text='GUARDAR'
              disabled={dataComplete} />
        </Grid>

      </Paper>
     
     <br/>

      <TableComponent
          titulo={titulo}
          columns={columns}
          data={signosVitales}
          options={options} />
    </Fragment>
  );
}
