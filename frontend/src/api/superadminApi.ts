import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Raw API calls
export const fetchAdminsAPI = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/superadmin/admins`, {
        headers: getAuthHeaders(),
    });
    return res.data.admins;
};

export const createAdminAPI = async (payload: any) => {
    const res = await axios.post(`${API_BASE_URL}/api/superadmin/admins`, payload, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

export const deleteAdminAPI = async (id: string) => {
    const res = await axios.delete(`${API_BASE_URL}/api/superadmin/admins/${id}`, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

export const updateAdminPermissionsAPI = async ({ id, permissions }: { id: string; permissions: string[] }) => {
    const res = await axios.put(`${API_BASE_URL}/api/superadmin/admins/${id}/permissions`, { permissions }, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

// React Query hooks
export const useAdmins = () => {
    return useQuery({ queryKey: ['admins'], queryFn: fetchAdminsAPI, staleTime: 1000 * 60 * 2 });
};

export const useCreateAdmin = () => {
    const qc = useQueryClient();
    return useMutation<any, Error, any>({
        mutationFn: (payload: any) => createAdminAPI(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admins'] }),
    });
};

export const useDeleteAdmin = () => {
    const qc = useQueryClient();
    return useMutation<any, Error, string>({
        mutationFn: (id: string) => deleteAdminAPI(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admins'] }),
    });
};

export const useUpdateAdminPermissions = () => {
    const qc = useQueryClient();
    return useMutation<any, Error, { id: string; permissions: string[] }>({
        mutationFn: (data: { id: string; permissions: string[] }) => updateAdminPermissionsAPI(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admins'] }),
    });
};
