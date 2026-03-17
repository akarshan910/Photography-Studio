import { supabase } from './supabaseClient';

export interface BookingEnquiry {
  name: string;
  email: string;
  date: string;
  type: string;
  guests: string;
  style: string;
  message: string;
}

export const enquiryService = {
  submitEnquiry: async (data: BookingEnquiry): Promise<{ success: boolean; message: string }> => {
    if (!data.name || !data.email || !data.message) {
      throw new Error("Missing required fields");
    }

    const { error } = await supabase.from('enquiries').insert({
      name: data.name,
      email: data.email,
      event_date: data.date ? data.date : null,
      event_type: data.type,
      guests: data.guests,
      style: data.style,
      message: data.message,
    });

    if (error) throw error;
    
    return {
      success: true,
      message: "Your enquiry has been securely logged in our system. Our team will review and respond within 24 hours."
    };
  },

  getEnquiries: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
};