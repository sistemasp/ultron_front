import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { Fragment } from 'react';
import { Grid } from '@material-ui/core';
import { CheckCustom } from '../../../components/basic/CheckCustom';

const localizer = momentLocalizer(moment);

export const CalendarioContainer = (props) => {

    const {
        values,
        checkAparatologias,
        events,
        onChangeAparatologias,
        onChangeConsultas,
        onChangeFaciales,
    } = props;

    const messages = {
        allDay: 'TODO EL DIA',
        previous: '<',
        next: '>',
        today: 'HOY',
        month: 'MES',
        week: 'SEMANA',
        work_week: 'SEMANA DE TRABAJO',
        day: 'DIA',
        agenda: 'AGENDA',
        date: 'FECHA',
        time: 'HORA',
        event: 'EVENTO',
    };

    const textColor = "#FFFFFF";

    const eventPropGetter = (event, start, end, isSelected) => {

        let newStyle = {
            backgroundColor: event.servicio.color,
            color: textColor,
            borderRadius: "5px",
        };

        return {
            className: "",
            style: newStyle
        };
    }

    const views = { day: true, week: true, month: true };

    return (
        <Fragment>
            <Grid container>
                <Grid item xs={true} sm={true}>
                    <CheckCustom
                        checked={values.aparatologias}
                        onChange={onChangeAparatologias}
                        name="checkedAparatologia"
                        label="APARATOLOGÍAS" />
                </Grid>
                <Grid item xs={true} sm={true}>
                    <CheckCustom
                        checked={values.consultas}
                        onChange={onChangeConsultas}
                        name="checkedAparatologia"
                        label="CONSULTAS" />
                </Grid>
                <Grid item xs={true} sm={true}>
                    <CheckCustom
                        checked={values.faciales}
                        onChange={onChangeFaciales}
                        name="checkedAparatologia"
                        label="FACIALES" />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <div style={{ height: '950pt' }}>
                        <Calendar
                            events={events}
                            defaultView={Views.WEEK}
                            startAccessor="start"
                            endAccessor="end"
                            defaultDate={moment().toDate()}
                            views={views}
                            step={30}
                            localizer={localizer}
                            messages={messages}
                            eventPropGetter={eventPropGetter} />
                    </div>
                </Grid>

            </Grid>
        </Fragment>

    );
}
