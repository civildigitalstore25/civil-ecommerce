const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface VyaparLeadPayload {
  fullName: string;
  mobile: string;
  businessType: string;
  device: string;
  language: string;
  upgradeTimeline: string;
}

export interface VyaparLeadResponse {
  success: boolean;
  message: string;
}

export const submitVyaparLead = async (
  payload: VyaparLeadPayload
): Promise<VyaparLeadResponse> => {
  const response = await fetch(`${API_URL}/api/leads/vyapar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = (await response.json()) as VyaparLeadResponse;

  if (!response.ok) {
    throw new Error(data.message || 'Failed to submit lead.');
  }

  return data;
};
