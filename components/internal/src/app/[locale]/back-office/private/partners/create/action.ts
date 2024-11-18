"use server"

import { IPartner, IPartnerResponse } from '@/app/[locale]/back-office/graphql/types.ts';

const API_URL = process.env.OL_BFF_PARTNER_SERVICE_BASE_URL;  
  
export async function createPartner(partner: IPartner) {
    try {
      partner.bank_account.swift_code ||= ""
      const body = JSON.stringify(partner);
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
  
      return {
        data: data as IPartnerResponse,
        error: null,
        code: data.code ? data.code : null,
        message: data.message ? data.message : null,
      };
    } catch (err) {
      console.error(err);
      let errorMessage = 'Failed to create a partner';
      if (err instanceof Error) errorMessage = err.message;
      return { error: errorMessage, data: null, code: null, message: null };
    }
  }

