import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Grid } from '@material-ui/core';
import bannerMePiel from './../../../bannerMePiel.PNG';
import bannerDermastetic from './../../../bannerDermastetic.jpeg';
import { dateToString, toFormatterCurrency } from '../../../utils/utils';
import { ButtonCustom } from '../../../components/basic/ButtonCustom';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: 10
  },
  textField: {
    width: '100%',
  },
  formControl: {
    minWidth: 120,
    width: '100%',
  },
  button: {
    width: '100%',
    color: '#FFFFFF',
  },
  buttonCancel: {
    width: '100%',
    color: '#FFFFFF',
    backgroundColor: "#FF2233",
  },
  label: {
    marginTop: '0px',
    marginBottom: '0px',
  },
  label_title: {
    //backgroundColor: colorBase,
    color: '#000000',
    textAlign: 'center',
  },
  label_title_descripcion: {
    textAlign: 'center',
    marginTop: '0px',
    marginBottom: '0px',
  },
  label_utilidad_perdida: {
    textAlign: 'center',
    marginTop: '0px',
    marginBottom: '0px',
    fontSize: '38px',
  },
  label_title_entradas: {
    //backgroundColor: colorBase,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '13px',
    paddingTop: 1,
    paddingBottom: 1,
    marginTop: 0,
    marginBottom: 0,
    color: '#000000',
  },
  label_cells: {
    textAlign: 'center',
    fontSize: '12px',
    marginTop: '0px',
    marginBottom: '0px',
  },
  label_cells_concepto: {
    textAlign: 'left',
    fontSize: '12px',
    marginTop: '0px',
    marginBottom: '0px',
    marginLeft: 10
  },
  label_cells_total: {
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    marginTop: '0px',
    marginBottom: '0px',
  },
  label_cells_totales: {
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: '0px',
    marginBottom: '0px',
  },
  grid_left: {
    marginTop: '10px',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
  },
  grid_right: {
    marginTop: '10px',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
  }
}));

const FormImprimirCorte = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    corte,
    sucursal,
    onClose,
    onClickImprimir,
    onReturn,
    open,
    show,
    tipoEntradas,
    tipoSalidas,
    formaPagos,
    dataEntradas,
    dataPagosAnticipados,
    dataSalidas,
    empleado,
  } = props;

  const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
  const sucursalRubenDarioId = process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID;
  const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
  const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;

  let totalEntradas = 0;
  let totalPagosAnticipados = 0;
  let totalEfectivo = 0;
  let pagoDermatologos = 0;
  let retirosParciales = 0;
  let otrasSalidas = 0;

  let totalesEntradas = [0, 0, 0, 0, 0, 0, 0];
  let totalesPagosAnticipados = [0, 0, 0, 0, 0, 0, 0, 0];

  return (
    <Fragment
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description" >
      <Grid container>
        {
          show ?
            <Fragment>
              <Grid container>
                <Grid item xs={6}>
                  <ButtonCustom
                    className={classes.buttonCancel}
                    color="secondary"
                    variant="contained"
                    onClick={onReturn}
                    text='REGRESAR' />
                </Grid>
                <Grid item xs={6}>
                  <ButtonCustom
                    className={classes.button}
                    color="primary"
                    variant="contained"
                    onClick={onClickImprimir}
                    text='IMPRIMIR' />
                </Grid>
              </Grid>
            </Fragment>
            : ''
        }
        <Grid item xs={3}>
          <img
            src={sucursal === sucursalManuelAcunaId || sucursal === sucursalRubenDarioId ? bannerDermastetic : bannerMePiel}
            alt='banner'
            width='100%'
            height='100%' />
        </Grid>
        <Grid container xs={9}>
          <Grid item xs={12} className={classes.label}>
            <h2 className={classes.label_title}>CENTRO DERMATOLÓGICO M. E. PIEL S. C.</h2>
          </Grid>
          <Grid item xs={8}>
            <h3 className={classes.label}>RECEPCIONISTA: {empleado.nombre}</h3>
          </Grid>
          <Grid item xs={4} >
            <h3 className={classes.label}>FECHA: {dateToString(corte.create_date)} </h3>
          </Grid>
          <Grid item xs={8} >
            <h3 className={classes.label}>SUCURSAL: {corte.sucursal.nombre}</h3>
          </Grid>
          <Grid item xs={4} >
            <h3 className={classes.label}>TURNO: {corte.turno === 'm' ? 'MATUTINO' : 'VESPERTINO'} </h3>
          </Grid>
        </Grid>

        <Grid container xs={12} className={classes.grid_left}>
          <Grid item xs={12} className={classes.label}>
            <h2 className={classes.label_title_descripcion} >ENTRADAS</h2>
          </Grid>
          <Grid container>
            <Grid item xs={true} className={classes.label}>
              <p className={classes.label_title_entradas}>FORMA PAGO</p>
            </Grid>

            {
              tipoEntradas.map(tipoEntrada => {
                return (
                  <Grid item xs={true} className={classes.label}>
                    <p className={classes.label_title_entradas}>{tipoEntrada.nombre}</p>
                  </Grid>
                )
              })
            }
            <Grid item xs={true} className={classes.label}>
              <p className={classes.label_title_entradas}>TOTAL</p>
            </Grid>
          </Grid>

          {
            formaPagos.map(formaPago => {
              return (
                <Fragment>
                  <Grid container>
                    <Grid item xs={true} className={classes.label}>
                      <h3 className={classes.label_cells_concepto}>{formaPago.nombre}</h3>
                    </Grid>
                    {
                      dataEntradas ? dataEntradas.filter(dataEntrada => {
                        return dataEntrada.forma_pago === formaPago.nombre
                      }).map((dataEntrada) => {
                        totalEntradas += dataEntrada.forma_pago !== 'NO PAGA' ? dataEntrada.total : 0;
                        totalEfectivo += dataEntrada.forma_pago === 'EFECTIVO' ? dataEntrada.total : 0;

                        return (
                          <Fragment>
                            {
                              tipoEntradas.map((tipoEntrada, index) => {
                                const entrada = dataEntrada.tipo_entradas_detalles.find(detalle => {
                                  return detalle.tipo_entrada === tipoEntrada.nombre;
                                });
                                totalesEntradas[index] += entrada ? Number(entrada.total) : Number(0);
                                return (
                                  <Grid item xs={true} className={classes.label}>
                                    <p className={classes.label_cells}>{entrada ? entrada.total_moneda : '-'}</p>
                                  </Grid>
                                )
                              })
                            }
                            <Grid item xs={true} className={classes.label_cells_total}>
                              <h3 className={classes.label_cells}>{dataEntrada.total_moneda}</h3>
                            </Grid>
                          </Fragment>

                        )
                      }) : ''
                    }
                  </Grid>
                </Fragment>
              )
            })
          }
          <Grid item xs={true} className={classes.label}>
            <h3 className={classes.label_cells_totales}>TOTALES</h3>
          </Grid>
          {
            totalesEntradas.map(val => {
              return (
                <Grid item xs={true} className={classes.label}>
                  <h3 className={classes.label_cells_totales}>{toFormatterCurrency(val)}</h3>
                </Grid>
              )
            })
          }
          <Grid item xs={true} className={classes.label}>
            <h3 className={classes.label_cells_totales}>{toFormatterCurrency(totalEntradas)}</h3>
          </Grid>
        </Grid>

        {
          dataPagosAnticipados.length > 0 ?
            <Grid container xs={12} className={classes.grid_left}>
              <Grid item xs={12} className={classes.label}>
                <h2 className={classes.label_title_descripcion} >PAGOS ANTICIPADOS</h2>
              </Grid>
              <Grid container>
                <Grid item xs={true} className={classes.label}>
                  <p className={classes.label_title_entradas}>FORMA PAGO</p>
                </Grid>

                {
                  tipoEntradas.map(tipoEntrada => {
                    return (
                      <Grid item xs={true} className={classes.label}>
                        <p className={classes.label_title_entradas}>{tipoEntrada.nombre}</p>
                      </Grid>
                    )
                  })
                }
                <Grid item xs={true} className={classes.label}>
                  <p className={classes.label_title_entradas}>TOTAL</p>
                </Grid>
              </Grid>

              {
                formaPagos.map(formaPago => {
                  return (
                    <Fragment>
                      <Grid container>
                        <Grid item xs={true} className={classes.label}>
                          <h3 className={classes.label_cells_concepto}>{formaPago.nombre}</h3>
                        </Grid>
                        {
                          dataPagosAnticipados ? dataPagosAnticipados.filter(dataPagoAnticipado => {
                            return dataPagoAnticipado.forma_pago === formaPago.nombre
                          }).map((dataPagoAnticipado) => {
                            totalPagosAnticipados += dataPagoAnticipado.total;
                            //totalEfectivo += dataPagoAnticipado.forma_pago === 'EFECTIVO' ? dataPagoAnticipado.total : 0;

                            return (
                              <Fragment>
                                {
                                  tipoEntradas.map((tipoEntrada, index) => {
                                    const entrada = dataPagoAnticipado.tipo_entradas_detalles.find(detalle => {
                                      return detalle.tipo_entrada === tipoEntrada.nombre;
                                    });
                                    totalesPagosAnticipados[index] += entrada ? Number(entrada.total) : Number(0);
                                    return (
                                      <Grid item xs={true} className={classes.label}>
                                        <p className={classes.label_cells}>{entrada ? entrada.total_moneda : '-'}</p>
                                      </Grid>
                                    )
                                  })
                                }
                                <Grid item xs={true} className={classes.label_cells_total}>
                                  <h3 className={classes.label_cells}>{dataPagoAnticipado.total_moneda}</h3>
                                </Grid>
                              </Fragment>

                            )
                          }) : ''
                        }
                      </Grid>
                    </Fragment>
                  )
                })
              }
              <Grid item xs={true} className={classes.label}>
                <h3 className={classes.label_cells_totales}>TOTALES</h3>
              </Grid>
              {
                totalesPagosAnticipados.map(val => {
                  return (
                    <Grid item xs={true} className={classes.label}>
                      <h3 className={classes.label_cells_totales}>{toFormatterCurrency(val)}</h3>
                    </Grid>
                  )
                })
              }
              <Grid item xs={true} className={classes.label}>
                <h3 className={classes.label_cells_totales}>{toFormatterCurrency(totalPagosAnticipados)}</h3>
              </Grid>
            </Grid>
            : ''
        }

        {
          dataSalidas.map(dataSalida => {
            console.log("KAOZ", dataSalida);
            {
              switch (dataSalida.tipo_salida) {
                case 'PAGO DERMATÓLOGOS':
                  pagoDermatologos += dataSalida.total;
                  break;
                case 'RETIRO PARCIAL':
                  retirosParciales += dataSalida.total;
                  break;
                default:
                  otrasSalidas += dataSalida.total;
                  break
              }
            }
            return (
              <Grid container xs={4} className={classes.grid_left}>
                <Grid item xs={12} className={classes.label}>
                  <h2 className={classes.label_title_descripcion} > {dataSalida.tipo_salida}</h2>
                </Grid>
                <Grid item xs={9} className={classes.label}>
                  <p className={classes.label_title_entradas}>CONCEPTO</p>
                </Grid>
                <Grid item xs={3} className={classes.label}>
                  <p className={classes.label_title_entradas}>CANTIDAD</p>
                </Grid>
                {
                  dataSalida.salidas_por_tipo.map((salida) => {
                    return (
                      <Fragment>
                        <Grid item xs={9} className={classes.label}>
                          <h3 className={classes.label_cells_concepto}>{salida.concepto}</h3>
                        </Grid>
                        <Grid item xs={3} className={classes.label}>
                          <p className={classes.label_cells_total}>{salida.cantidad_moneda}</p>
                        </Grid>
                      </Fragment>

                    )
                  })
                }
              </Grid>
            );
          })
        }
        <Grid container xs={6} className={classes.grid_left}>
          <Grid item xs={12} className={classes.label}>
            <h2 className={classes.label_title_descripcion}> DETALLE DE EFECTIVO </h2>
          </Grid>
          <Grid item xs={8} className={classes.label}>
            <p className={classes.label_title_entradas}>CONCEPTO</p>
          </Grid>
          <Grid item xs={4} className={classes.label}>
            <p className={classes.label_title_entradas}>CANTIDAD</p>
          </Grid>

          <Grid item xs={8} className={classes.label}>
            <h3 className={classes.label_cells_concepto}>TOTAL EN EFECTIVO</h3>
          </Grid>
          <Grid item xs={4} className={classes.label}>
            <h3 className={classes.label_cells}>{toFormatterCurrency(totalEfectivo)}</h3>
          </Grid>

          <Grid item xs={8} className={classes.label}>
            <h3 className={classes.label_cells_concepto}>TOTAL PAGO DERMATÓLOGOS</h3>
          </Grid>
          <Grid item xs={4} className={classes.label}>
            <h3 className={classes.label_cells}>{`-${toFormatterCurrency(pagoDermatologos)}`}</h3>
          </Grid>

          <Grid item xs={8} className={classes.label}>
            <h3 className={classes.label_cells_concepto}>TOTAL RETIROS PARCIALES</h3>
          </Grid>
          <Grid item xs={4} className={classes.label}>
            <h3 className={classes.label_cells}>{`-${toFormatterCurrency(retirosParciales)}`}</h3>
          </Grid>

          <Grid item xs={8} className={classes.label}>
            <h3 className={classes.label_cells_concepto}>TOTAL OTRAS SALIDAS</h3>
          </Grid>
          <Grid item xs={4} className={classes.label}>
            <h3 className={classes.label_cells}>{`-${toFormatterCurrency(otrasSalidas)}`}</h3>
          </Grid>
        </Grid>

        <Grid container xs={6} className={classes.grid_right}>
          <Grid item xs={12} className={classes.label}>
            <h1 className={classes.label_utilidad_perdida}>{`TOTAL CORTE EFECTIVO: ${toFormatterCurrency((pagoDermatologos + retirosParciales + otrasSalidas) - totalEfectivo)}`}<br /><br /></h1>
          </Grid>

          <Grid item xs={12} className={classes.label}>
            <h2 className={classes.label_utilidad_perdida}><br /></h2>
          </Grid>

          <Grid container>
            <Grid item xs={true}>
              <h3 className={classes.label_title_descripcion}>_____________________________</h3>
              <h3 className={classes.label_title_descripcion}>REALIZÓ</h3>
            </Grid>

            <Grid item xs={true} className={classes.label}>
              <h3 className={classes.label_title_descripcion}>_____________________________</h3>
              <h3 className={classes.label_title_descripcion}>RECIBIÓ</h3>
            </Grid>
          </Grid>
        </Grid>

      </Grid>
    </Fragment>
  );
}

export default FormImprimirCorte;