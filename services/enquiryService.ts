import { db } from './storage';

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
    await db.simulateNetwork(1200); // Realistic processing time
    
    // Server-side style validation
    if (!data.name || !data.email || !data.message) {
      throw new Error("Missing required fields");
    }

    db.save('enquiries', data);
    console.log('Backend: Enquiry processed and saved to persistent storage.');
    
    return {
      success: true,
      message: "Your enquiry has been securely logged in our system. Our team will review and respond within 24 hours."
    };
  },

  getEnquiries: (): BookingEnquiry[] => {
    return db.getAll<BookingEnquiry>('enquiries');
  }
};