import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

// HORARIO

export const getAllSchedules = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllSchedules', error);
    }
}

export const findSchedulesBySucursalAndServicio = async (idSucursal, idServicio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario/sucursal/${idSucursal}/servicio/${idServicio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSchedulesBySucursalAndServicio', error);
    }
}

export const findScheduleByDate = async (dia, mes, anio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario/${dia}/${mes}/${anio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findScheduleByDate', error);
    }
}

export const findScheduleByDateAndSucursalAndService = async (dia, mes, anio, sucursalId, servicio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario/${dia}/${mes}/${anio}/${sucursalId}/${servicio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findScheduleByDateAndSucursalAndService', error);
    }
}

export const findScheduleInConsultByDateAndSucursal = async (consultaId, dia, mes, anio, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario/consulta/${consultaId}/${dia}/${mes}/${anio}/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findScheduleInConsultByDateAndSucursal', error);
    }
}

// CITAS

export const getAllDates = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllDates', error);
    }
}

export const getAllDatesBySucursal = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllDatesBySucursal', error);
    }
}

export const showAllDatesBySucursalAsistio = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/sucursal/${sucursalId}/asistio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllDatesBySucursalAsistio', error);
    }
}

export const findDatesByDate = async (dia, mes, anio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${dia}/${mes}/${anio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByDate', error);
    }
}

export const findDatesByDateAndSucursal = async (dia, mes, anio, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByDateAndSucursal', error);
    }
}

export const findDatesByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByRangeDateAndSucursal', error);
    }
}

export const findDatesByRangeDateAndSucursalAndService = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, serviceId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}/service/${serviceId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByRangeDateAndSucursalAndService', error);
    }
}

export const findHistoricByPaciente = async (pacienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/historic/${pacienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricByPaciente', error);
    }
}

export const findHistoricByPacienteAndService = async (pacienteId, serviceId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/historic/${pacienteId}/servicio/${serviceId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricByPacienteAndService', error);
    }
}

export const findDateById = async (citaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${citaId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDateById', error);
    }
}

export const createDate = async (cita) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita`,
            method: 'POST',
            data: cita
        });
        return response;
    } catch (error) {
        console.log('createDate', error);
    }
}

export const updateDate = async (dateId, cita) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${dateId}`,
            method: 'PUT',
            data: cita
        });
        return response;
    } catch (error) {
        console.log('updateDate', error);
    }
}

export const waitingListTratamiento = async (sucursalId, statusAsistioId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('waitingListTratamiento', error);
    }
}
export const findDatesByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, dermatologoId, atendidoId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByPayOfDoctorTurno', error);
    }
}

// RECEPCIONISTAS

export const findRecepcionistByEmployeeNumber = async (employeeNumber) => {
    try {
        const response = await axios({
            url: `${baseUrl}/recepcionista/number/${employeeNumber}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findRecepcionistByEmployeeNumber', error);
    }
}

// SUCURSALES

export const showAllOffices = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/sucursal`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllOffices', error);
    }
}

export const findOfficeById = async (idSucursal) => {
    try {
        const response = await axios({
            url: `${baseUrl}/sucursal/${idSucursal}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findOfficeById', error);
    }
}

// SALA DE CURACIÓN

export const findSalaCuracionBySucursalId = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSalaCuracionBySucursalId', error);
    }
}

export const findSalaCuracionBySucursalIdWaitingList = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia/waitinglist/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSalaCuracionBySucursalIdWaitingList', error);
    }
}

export const findSalaCuracionBySucursalIdAndFree = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia/sucursal/${sucursalId}/libre`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSalaCuracionBySucursalIdAndFree', error);
    }
}

export const createSalaCuracion = async (consultorio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia`,
            method: 'POST',
            data: consultorio
        });
        return response;
    } catch (error) {
        console.log('createSalaCuracion', error);
    }
}

export const updateSalaCuracion = async (salaCuracionId, surgery) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia/${salaCuracionId}`,
            method: 'PUT',
            data: surgery
        });
        return response;
    } catch (error) {
        console.log('updateSalaCuracion', error);
    }
}

export const breakFreeSalaCuracionByIdPaciente = async (salaCuracionId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia/liberar/paciente/${salaCuracionId}`,
            method: 'PUT'
        });
        return response;
    } catch (error) {
        console.log('breakFreeSalaCuracionByIdPaciente', error);
    }
}

export const breakFreeSalaCuracionByIdDermatologo = async (salaCuracionId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia/liberar/dermatologo/${salaCuracionId}`,
            method: 'PUT'
        });
        return response;
    } catch (error) {
        console.log('breakFreeSalaCuracionByIdDermatologo', error);
    }
}

// CABINAS

export const findCabinaBySucursalId = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCabinaBySucursalId', error);
    }
}

export const findCabinaBySucursalIdWaitingList = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina/waitinglist/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCabinaBySucursalIdWaitingList', error);
    }
}

export const findCabinaBySucursalIdAndFree = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina/sucursal/${sucursalId}/libre`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCabinaBySucursalIdAndFree', error);
    }
}

export const createCabina = async (cabina) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina`,
            method: 'POST',
            data: cabina
        });
        return response;
    } catch (error) {
        console.log('createCabina', error);
    }
}

export const updateCabina = async (surgeryId, surgery) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina/${surgeryId}`,
            method: 'PUT',
            data: surgery
        });
        return response;
    } catch (error) {
        console.log('updateCabina', error);
    }
}

export const breakFreeCabinaByIdPaciente = async (surgeryId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina/liberar/paciente/${surgeryId}`,
            method: 'PUT'
        });
        return response;
    } catch (error) {
        console.log('breakFreeCabinaByIdPaciente', error);
    }
}

export const breakFreeCabinaByIdDermatologo = async (surgeryId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina/liberar/dermatologo/${surgeryId}`,
            method: 'PUT'
        });
        return response;
    } catch (error) {
        console.log('breakFreeCabinaByIdDermatologo', error);
    }
}

// TIPO CITAS

export const showAllTipoCitas = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipocita`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllTipoCitas', error);
    }
}

// MEDIO

export const showAllMedios = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/medio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllMedios', error);
    }
}

// BANCOS

export const showAllBanco = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/banco`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllBanco', error);
    }
}

// FORMA DE PAGO

export const showAllMetodoPago = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/formapago`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllMetodoPago', error);
    }
}

// TIPO TARJETA

export const showAllTipoTarjeta = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipotarjeta`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllTipoTarjeta', error);
    }
}

// USO CFDI

export const showAllUsoCfdis = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/usocfdi`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllUsoCfdis', error);
    }
}

// FRECUENCIAS

export const showAllFrecuencias = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/frecuencia`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllFrecuencias', error);
    }
}

// SEXOS

export const showAllSexos = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/sexo`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllSexos', error);
    }
}

// MATERIALES

export const showAllMaterials = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/material`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllMaterials', error);
    }
}

// TIPO ESTÉTICA

export const showAllTipoEsteticas = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipoestetica`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllTipoEsteticas', error);
    }
}

// TIPO SALIDAS

export const showAllTipoSalidas = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tiposalida`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllTipoSalidas', error);
    }
}

export const findTipoSalidaById = async (tipoSalidaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/tiposalida/${tipoSalidaId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findTipoSalidaById', error);
    }
}