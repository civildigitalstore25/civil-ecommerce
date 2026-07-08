import { Request, Response } from 'express';
import { appendVyaparLeadToSheet } from '../services/googleSheetsService';

type VyaparLeadBody = {
  fullName?: string;
  mobile?: string;
  businessType?: string;
  device?: string;
  language?: string;
  upgradeTimeline?: string;
};

const sanitizeValue = (value: string | undefined) => (value || '').trim();

export const createVyaparLead = async (
  req: Request<unknown, unknown, VyaparLeadBody>,
  res: Response
) => {
  try {
    const fullName = sanitizeValue(req.body.fullName);
    const mobile = sanitizeValue(req.body.mobile);
    const businessType = sanitizeValue(req.body.businessType);
    const device = sanitizeValue(req.body.device);
    const language = sanitizeValue(req.body.language);
    const upgradeTimeline = sanitizeValue(req.body.upgradeTimeline);

    if (!fullName) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }

    if (!/^\d{10}$/.test(mobile)) {
      return res
        .status(400)
        .json({ success: false, message: 'Mobile number must be a valid 10-digit number.' });
    }

    await appendVyaparLeadToSheet({
      fullName,
      mobile,
      businessType,
      device,
      language,
      upgradeTimeline,
      submittedAt: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: 'Lead submitted successfully.'
    });
  } catch (error) {
    console.error('Error while storing Vyapar lead in Google Sheets:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to save lead details right now. Please try again.'
    });
  }
};
