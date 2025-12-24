import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de la instancia de Axios para el backend
const client = axios.create({
    baseURL: 'http://192.168.40.81:4000', // TODO: Move to Env Config
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token CSRF automáticamente a las solicitudes
client.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('csrfToken');
            if (token) {
                config.headers['X-CSRF-Token'] = token;
            }
        } catch (error) {
            console.error('Error al obtener el token CSRF para el interceptor:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

client.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Error de API:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default client;
