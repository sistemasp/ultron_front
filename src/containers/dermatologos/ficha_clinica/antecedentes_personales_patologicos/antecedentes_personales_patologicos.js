import 'date-fns';
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import { Paper } from '@material-ui/core';
import myStyles from '../../../../css';
import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { Label } from '@material-ui/icons';
import { ButtonCustom } from '../../../../components/basic/ButtonCustom';
import { CheckCustom } from '../../../../components/basic/CheckCustom';

export const AntecedentesPersonalesPatologicosContainer = (props) => {

  const {
    consultorio,
    colorBase,
    antecedentesPersonalesPatologicos,
    app_generales,
    app_patologias_infectocontagiosas,
    app_patologias_cronico_degenerativas,
    app_patologias_exantematicas,
    onChangeCheckGenerales,
    onChangeCheckPatologiasInfectocontagiosas,
    onChangeCheckPatologiasCronicoDegenerativas,
    onChangeCheckPatologiasExantematicas,
    onChange,
    onClickGuardar,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper className={classes.paper_item}>
              <h3>GENERALES</h3>
              <FormGroup>
                <CheckCustom checked={app_generales.hospitalizaciones} onChange={onChangeCheckGenerales} name="hospitalizaciones" label="HOSPITALIZACIONES" />
                <CheckCustom checked={app_generales.quirurgicos} onChange={onChangeCheckGenerales} name="quirurgicos" label="QUIRÚRGICOS" />
                <CheckCustom checked={app_generales.traumaticos} onChange={onChangeCheckGenerales} name="traumaticos" label="TRAUMÁTICOS" />
                <CheckCustom checked={app_generales.transfusionales} onChange={onChangeCheckGenerales} name="transfusionales" label="TRANSFUSIONALES" />
              </FormGroup>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper_item}>
            <FormGroup>
              <h3>PATOLOGÍAS INFECTOCONTAGIOSAS</h3>
              <CheckCustom checked={app_patologias_infectocontagiosas.faringomigdalitis} onChange={onChangeCheckPatologiasInfectocontagiosas} name="faringomigdalitis" label="FARINGOMIGDALITIS" />
              <CheckCustom checked={app_patologias_infectocontagiosas.fiebre_reumatica} onChange={onChangeCheckPatologiasInfectocontagiosas} name="fiebre_reumatica" label="FIEBRE REUMÁTICA" />
              <CheckCustom checked={app_patologias_infectocontagiosas.hepatitis} onChange={onChangeCheckPatologiasInfectocontagiosas} name="hepatitis" label="HEPATITIS" />
              <CheckCustom checked={app_patologias_infectocontagiosas.parasitosis} onChange={onChangeCheckPatologiasInfectocontagiosas} name="parasitosis" label="PARASITOSIS" />
              <CheckCustom checked={app_patologias_infectocontagiosas.tifoidea} onChange={onChangeCheckPatologiasInfectocontagiosas} name="tifoidea" label="TIFOIDEA" />
              <CheckCustom checked={app_patologias_infectocontagiosas.transmision_sexual} onChange={onChangeCheckPatologiasInfectocontagiosas} name="transmision_sexual" label="TRANSMISIÓN SEXUAL" />
              <CheckCustom checked={app_patologias_infectocontagiosas.tuberculosis} onChange={onChangeCheckPatologiasInfectocontagiosas} name="tuberculosis" label="TUBERCULOSIS" />
            </FormGroup>   
          </Paper>
        </Grid>
        <Grid item xs={true}>
          <Paper className={classes.paper_item}>
            <FormGroup>
              <h3>PATOLOGÍAS CRÓNICO-DEGENETATIVAS</h3>
              <CheckCustom checked={app_patologias_cronico_degenerativas.diabetes_melitus} onChange={onChangeCheckPatologiasCronicoDegenerativas} name="diabetes_melitus" label="DIABETES MELITUS" />
              <CheckCustom checked={app_patologias_cronico_degenerativas.hipertension_arterial_sistemica} onChange={onChangeCheckPatologiasCronicoDegenerativas} name="hipertension_arterial_sistemica" label="HIPERTENSIÓN ARTERIAL SISTÉMICA" />
              <CheckCustom checked={app_patologias_cronico_degenerativas.dislipidemias} onChange={onChangeCheckPatologiasCronicoDegenerativas} name="dislipidemias" label="DISLIPIDEMIAS" />
              <CheckCustom checked={app_patologias_cronico_degenerativas.obesidad} onChange={onChangeCheckPatologiasCronicoDegenerativas} name="obesidad" label="OBESIDAD" />
              <CheckCustom checked={app_patologias_cronico_degenerativas.neoplasias} onChange={onChangeCheckPatologiasCronicoDegenerativas} name="neoplasias" label="NEOPLÁSIAS" />
              <CheckCustom checked={app_patologias_cronico_degenerativas.enfermedades_reumatologicas} onChange={onChangeCheckPatologiasCronicoDegenerativas} name="enfermedades_reumatologicas" label="ENFERMEDADES REUMATOLÓGICAS" />
            </FormGroup>   
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper_item}>
            <FormGroup>
              <h3>PATOLOGÍAS EXANTEMÁTICAS</h3>
              <CheckCustom checked={app_patologias_exantematicas.exantema_subito} onChange={onChangeCheckPatologiasExantematicas} name="exantema_subito" label="EXANTEMA SÚBITO" />
              <CheckCustom checked={app_patologias_exantematicas.roseola_escarlatina} onChange={onChangeCheckPatologiasExantematicas} name="roseola_escarlatina" label="ROSÉOLA ESCARLATINA" />
              <CheckCustom checked={app_patologias_exantematicas.rubeola} onChange={onChangeCheckPatologiasExantematicas} name="rubeola" label="RUBÉOLA" />
              <CheckCustom checked={app_patologias_exantematicas.sarampion} onChange={onChangeCheckPatologiasExantematicas} name="sarampion" label="SARAMPIÓN" />
              <CheckCustom checked={app_patologias_exantematicas.varicela} onChange={onChangeCheckPatologiasExantematicas} name="varicela" label="VARICELA" />
              <CheckCustom checked={app_patologias_exantematicas.otra_patologia_exantematica} onChange={onChangeCheckPatologiasExantematicas} name="otra_patologia_exantematica" label="OTRA PATOLOGÍA EXANTEMÁTICA" />
            </FormGroup>
          </Paper>
        </Grid>
        <Grid item xs={true}>
          <Paper className={classes.paper_item}>
            <h3>OTROS ANTECEDENTES</h3>
            <TextField 
              id="otros_antecedentes"
              name="otros_antecedentes"
              value={antecedentesPersonalesPatologicos.otros_antecedentes}
              onChange={onChange}
              fullWidth 
              multiline />
            <br/>
            <br/>
            <ButtonCustom
							className={classes.button}
							type="submit"
							color="primary"
							variant="contained"
							onClick={onClickGuardar}
							text='GUARDAR' />
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
}
