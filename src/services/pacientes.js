import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

// PACIENTES

export const getAllPatients = async (token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('getAllPatients', error);
        return error;
    }
}

export const findPatientByPhoneNumber = async (telefono, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente/phonenumber/${telefono}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findPatientByPhoneNumber', error);
        return error;
    }
}

export const updatePatient = async (pacienteId, paciente, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente/${pacienteId}`,
            method: 'PUT',
            data: paciente,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('updatePatient', error);
        return error;
    }
}

export const createPatient = async (paciente, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente`,
            method: 'POST',
            data: paciente,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('createPatient', error);
        return error;
    }
}