// src/hooks/useAuth.js
import { useNavigate } from 'react-router-dom';
import api from '../config/axios'; // Importa la instancia de Axios configurada

const useAuthLogout = () => {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            // Llama al endpoint de logout en el backend
            await api.post('/auth/logout');
            
            // Redirige al usuario a la página de login
            navigate('/auth/login');

        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Si hay un error, aún así redirige para garantizar que la sesión se borre en el cliente
            navigate('/auth/login'); 
        }
    };

    return { logout };
};

export default useAuthLogout;