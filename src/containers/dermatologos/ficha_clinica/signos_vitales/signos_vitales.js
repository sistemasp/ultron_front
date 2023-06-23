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
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <Fragment>
      <Paper>
        <Grid container spacing={2}>
          <Grid item xs={true}>
            <TextField 
              id="tension_arterial"
              className={classes.formControl}
              name="observaciones"
              label="TENSION ARTERIAL" />
          </Grid>
          <Grid item xs={true}>
            <TextField 
              id="frecuencia_resp"
              label="FRECUENCIA RESP (RESP/MIN)" />
          </Grid>
          <Grid item xs={true}>
            <TextField 
              id="frecuencia_cardiaca"
              label="FRECUENCIA CARDIACA (LAT/MIN)" />
          </Grid>
          <Grid item xs={true}>
            <TextField 
              id="temperatura"
              label="TEMPERATURA (C°)" />
          </Grid>
          <Grid item xs={true}>
            <TextField 
              id="peso"
              label="PESO (KG)" />
          </Grid>
          <Grid item xs={true}>
            <TextField 
              id="altura"
              label="ALTURA (M)" />
          </Grid>
          <Grid item xs={true}>
            <TextField 
              id="imc"
              label="IMC (SE GENERA POR PESO Y ALTURA)"
              disabled />
          </Grid>
          <ButtonCustom
							className={classes.button}
							type="submit"
							color="primary"
							variant="contained"
							// onClick={handleSubmit}
							text='GUARDAR' />
        </Grid>

      </Paper>
     
     <br/>

      <TableComponent
          titulo={titulo}
          columns={columns}
          // data={signosVitales}
          options={options} />
    </Fragment>
  );
}
