import 'date-fns';
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import { Paper } from '@material-ui/core';
import myStyles from '../../../../css';
import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { Label } from '@material-ui/icons';
import { CheckCustom } from '../../../../components/basic/CheckCustom';

export const AntecedentesHeredofamiliaresContainer = (props) => {

  const {
    consultorio,
    colorBase,
    antecedentesHeredofamiliares,
    onChangeCheck,
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
                  <CheckCustom checked={antecedentesHeredofamiliares.padre_diabetes_mellitus} onChange={onChangeCheck} name="padre_diabetes_mellitus" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.madre_diabetes_mellitus} onChange={onChangeCheck} name="madre_diabetes_mellitus" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_p_diabetes_mellitus} onChange={onChangeCheck} name="abuelos_p_diabetes_mellitus" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_m_diabetes_mellitus} onChange={onChangeCheck} name="abuelos_m_diabetes_mellitus" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.hermanos_diabetes_mellitus} onChange={onChangeCheck} name="hermanos_diabetes_mellitus" label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                HIPERTENSIÓN ARTERIAL SISTÉMICA
              </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.padre_hipertension_arterial_sistemica} onChange={onChangeCheck} name="padre_hipertension_arterial_sistemica" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.madre_hipertension_arterial_sistemica} onChange={onChangeCheck} name="madre_hipertension_arterial_sistemica" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_p_hipertension_arterial_sistemica} onChange={onChangeCheck} name="abuelos_p_hipertension_arterial_sistemica" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_m_hipertension_arterial_sistemica} onChange={onChangeCheck} name="abuelos_m_hipertension_arterial_sistemica" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.hermanos_hipertension_arterial_sistemica} onChange={onChangeCheck} name="hermanos_hipertension_arterial_sistemica" label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                DISLIPIDEMIAS
              </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.padre_dislipidemias} onChange={onChangeCheck} name="padre_dislipidemias" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.madre_dislipidemias} onChange={onChangeCheck} name="madre_dislipidemias" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_p_dislipidemias} onChange={onChangeCheck} name="abuelos_p_dislipidemias" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_m_dislipidemias} onChange={onChangeCheck} name="abuelos_m_dislipidemias" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.hermanos_dislipidemias} onChange={onChangeCheck} name="hermanos_dislipidemias" label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                NEOPLÁSIAS
              </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.padre_neoplasias} onChange={onChangeCheck} name="padre_neoplasias" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.madre_neoplasias} onChange={onChangeCheck} name="madre_neoplasias" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_p_neoplasias} onChange={onChangeCheck} name="abuelos_p_neoplasias" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_m_neoplasias} onChange={onChangeCheck} name="abuelos_m_neoplasias" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.hermanos_neoplasias} onChange={onChangeCheck} name="hermanos_neoplasias" label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                MALFORMAICONES HEREDITARIAS / CONGÉNITAS
              </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.padre_malformaicones_hereditarias} onChange={onChangeCheck} name="padre_malformaicones_hereditarias" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.madre_malformaicones_hereditarias} onChange={onChangeCheck} name="madre_malformaicones_hereditarias" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_p_malformaicones_hereditarias} onChange={onChangeCheck} name="abuelos_p_malformaicones_hereditarias" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_m_malformaicones_hereditarias} onChange={onChangeCheck} name="abuelos_m_malformaicones_hereditarias" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.hermanos_malformaicones_hereditarias} onChange={onChangeCheck} name="hermanos_malformaicones_hereditarias" label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                ALERGIAS
              </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.padre_alergias} onChange={onChangeCheck} name="padre_alergias" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.madre_alergias} onChange={onChangeCheck} name="madre_alergias" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_p_alergias} onChange={onChangeCheck} name="abuelos_p_alergias" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_m_alergias} onChange={onChangeCheck} name="abuelos_m_alergias" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.hermanos_alergias} onChange={onChangeCheck} name="hermanos_alergias" label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                ENFERMEDADES PSIQUIATRICAS
              </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.padre_enf_psiquiatricas} onChange={onChangeCheck} name="padre_enf_psiquiatricas" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.madre_enf_psiquiatricas} onChange={onChangeCheck} name="madre_enf_psiquiatricas" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_p_enf_psiquiatricas} onChange={onChangeCheck} name="abuelos_p_enf_psiquiatricas" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_m_enf_psiquiatricas} onChange={onChangeCheck} name="abuelos_m_enf_psiquiatricas" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.hermanos_enf_psiquiatricas} onChange={onChangeCheck} name="hermanos_enf_psiquiatricas" label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                ENFERMEDADES NEUROLÓGICAS
              </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.padre_enf_neurologicas} onChange={onChangeCheck} name="padre_enf_neurologicas" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.madre_enf_neurologicas} onChange={onChangeCheck} name="madre_enf_neurologicas" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_p_enf_neurologicas} onChange={onChangeCheck} name="abuelos_p_enf_neurologicas" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_m_enf_neurologicas} onChange={onChangeCheck} name="abuelos_m_enf_neurologicas" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.hermanos_enf_neurologicas} onChange={onChangeCheck} name="hermanos_enf_neurologicas" label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                ENFERMEDADES CARDIOVASCULARES
              </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.padre_enf_cardiovasculares} onChange={onChangeCheck} name="padre_enf_cardiovasculares" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.madre_enf_cardiovasculares} onChange={onChangeCheck} name="madre_enf_cardiovasculares" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_p_enf_cardiovasculares} onChange={onChangeCheck} name="abuelos_p_enf_cardiovasculares" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_m_enf_cardiovasculares} onChange={onChangeCheck} name="abuelos_m_enf_cardiovasculares" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.hermanos_enf_cardiovasculares} onChange={onChangeCheck} name="hermanos_enf_cardiovasculares" label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                ENFERMEDADES BRONCOPULMONARES
              </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.padre_enf_broncopulmonares} onChange={onChangeCheck} name="padre_enf_broncopulmonares" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.madre_enf_broncopulmonares} onChange={onChangeCheck} name="madre_enf_broncopulmonares" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_p_enf_broncopulmonares} onChange={onChangeCheck} name="abuelos_p_enf_broncopulmonares" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_m_enf_broncopulmonares} onChange={onChangeCheck} name="abuelos_m_enf_broncopulmonares" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.hermanos_enf_broncopulmonares} onChange={onChangeCheck} name="hermanos_enf_broncopulmonares" label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                ENFERMEDADES TIROIDEAS
              </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.padre_enf_tiroideas} onChange={onChangeCheck} name="padre_enf_tiroideas" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.madre_enf_tiroideas} onChange={onChangeCheck} name="madre_enf_tiroideas" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_p_enf_tiroideas} onChange={onChangeCheck} name="abuelos_p_enf_tiroideas" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_m_enf_tiroideas} onChange={onChangeCheck} name="abuelos_m_enf_tiroideas" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.hermanos_enf_tiroideas} onChange={onChangeCheck} name="hermanos_enf_tiroideas" label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                ENFERMEDADES RENALES
              </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.padre_enf_renales} onChange={onChangeCheck} name="padre_enf_renales" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.madre_enf_renales} onChange={onChangeCheck} name="madre_enf_renales" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_p_enf_renales} onChange={onChangeCheck} name="abuelos_p_enf_renales" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_m_enf_renales} onChange={onChangeCheck} name="abuelos_m_enf_renales" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.hermanos_enf_renales} onChange={onChangeCheck} name="hermanos_enf_renales" label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                ENFERMEDADES OSTEOARTICULARES
              </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.padre_enf_osteoarticulares} onChange={onChangeCheck} name="padre_enf_osteoarticulares" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.madre_enf_osteoarticulares} onChange={onChangeCheck} name="madre_enf_osteoarticulares" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_p_enf_osteoarticulares} onChange={onChangeCheck} name="abuelos_p_enf_osteoarticulares" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_m_enf_osteoarticulares} onChange={onChangeCheck} name="abuelos_m_enf_osteoarticulares" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.hermanos_enf_osteoarticulares} onChange={onChangeCheck} name="hermanos_enf_osteoarticulares" label="" />
                </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                ENFERMEDADES INFECTOCONTAGIOSAS
              </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.padre_enf_infectocontagiosas} onChange={onChangeCheck} name="padre_enf_infectocontagiosas" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.madre_enf_infectocontagiosas} onChange={onChangeCheck} name="madre_enf_infectocontagiosas" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_p_enf_infectocontagiosas} onChange={onChangeCheck} name="abuelos_p_enf_infectocontagiosas" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.abuelos_m_enf_infectocontagiosas} onChange={onChangeCheck} name="abuelos_m_enf_infectocontagiosas" label="" />
                </Grid>
                <Grid item xs={true}>
                  <CheckCustom checked={antecedentesHeredofamiliares.hermanos_enf_infectocontagiosas} onChange={onChangeCheck} name="hermanos_enf_infectocontagiosas" label="" />
                </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
}
