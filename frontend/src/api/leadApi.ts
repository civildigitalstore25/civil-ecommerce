import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface WelcomeLeadData {
    name: string;
    email: string;
    whatsappNumber: string;
}

export interface WelcomeLeadResponse {
    success: boolean;
    message: string;
    data: {
        name: string;
        email: string;
        discountCode: string;
        discountValue: number;
        discountType: string;
        validUntil: Date;
    };
}

// Create welcome lead and get discount code
export const createWelcomeLead = async (data: WelcomeLeadData): Promise<WelcomeLeadResponse> => {
    const response = await axios.post(`${API_URL}/api/leads/welcome`, data);
    return response.data;
};
