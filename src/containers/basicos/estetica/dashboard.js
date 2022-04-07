import React from "react";
import {
  makeStyles,
  Paper,
  Grid,
} from "@material-ui/core";

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { ButtonCustom } from "../../../components/basic/ButtonCustom";
import { Fragment } from "react";
import myStyles from "../../../css";
import { toFormatterCurrency } from "../../../utils/utils";
import { CheckCustom } from "../../../components/basic/CheckCustom";


export const DashboardContainer = (props) => {

  const {
    sucursales,
    startDate,
    onChangeStartDate,
    endDate,
    onChangeEndDate,
    onClickReportes,
    colorBase,
    isDirecto,
    onChangeDirecto,
    //setFieldTouched
  } = props;
  // console.table(props);
  /*
  const change = (name, e) => {
    e.persist();
    handleChange(e);
    setFieldTouched(name, true, false);
  };*/

  const classes = myStyles(colorBase)();

  return (
    <Fragment>
      <Paper>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12} sm={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid
                container
                justify="center"
                alignItems="center" >
                <KeyboardDatePicker
                  disableToolbar
                  loadingIndicator
                  autoOk
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="date-picker-inline-filter"
                  label="FECHA INICIAL"
                  value={startDate}
                  onChange={onChangeStartDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }} />
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12} sm={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid
                container
                justify="center"
                alignItems="center" >
                <KeyboardDatePicker
                  disableToolbar
                  loadingIndicator
                  autoOk
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="date-picker-inline-filter"
                  label="FECHA FINAL"
                  value={endDate}
                  onChange={onChangeEndDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }} />
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12} sm={3} className={classes.grid_center}>
            <CheckCustom
              checked={isDirecto}
              onChange={onChangeDirecto}
              name="checkedF"
              label="DIRECTOS"
            />
          </Grid>
          <Grid item xs={12} sm={3} className={classes.grid_center}>
            <ButtonCustom
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={() => onClickReportes()}
              text="OBTENER DATOS" />
          </Grid>
        </Grid>

      </Paper>

      <Grid container spacing={3}>
        {/* <Grid item xs={4} sm={4}>
          <Paper>
            <h1>
              GRAFICA
            </h1>
          </Paper>
        </Grid> */}

        <Grid item xs={12} sm={12}>
          <Grid container spacing={2}>
            {
              sucursales.map(sucursal => {
                return <Grid item xs={6} sm={6}>
                  <Paper>
                    <h1>
                      {`${sucursal.nombre}`}
                    </h1>
                    <Grid container>
                      {
                        sucursal.pagos.map(pago => {
                          return <Fragment>
                            <Grid item xs={7} sm={7} className={classes.label_left}>
                              <h3 className={classes.label_left}>{`${pago.nombre}: `}</h3>
                            </Grid>
                            <Grid item xs={4} sm={4} className={classes.label_right}>
                              <h3 className={classes.label_right}>{`${toFormatterCurrency(pago.total_pago)}`}</h3>
                            </Grid>
                          </Fragment>
                        })
                      }
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12} className={classes.label_right}>
                        <h2 className={classes.label_right}>{`${toFormatterCurrency(sucursal.total_pagos)}`}</h2>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              })
            }
          </Grid>
        </Grid>


      </Grid>


    </Fragment>
  );
};
