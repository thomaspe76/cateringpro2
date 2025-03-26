import { apiService } from './api';
import { Proposal, ProposalFormData, ProposalFilters } from '../types';

class ProposalService {
  // Alle Angebote abrufen
  async getProposals(filters?: ProposalFilters): Promise<Proposal[]> {
    try {
      const response = await apiService.get<Proposal[]>('/proposals', { params: filters });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching proposals:', error);
      return [];
    }
  }

  // Angebot abrufen
  async getProposal(id: string): Promise<Proposal | null> {
    try {
      const response = await apiService.get<Proposal>(`/proposals/${id}`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching proposal:', error);
      return null;
    }
  }

  // Angebot erstellen
  async createProposal(proposal: Omit<Proposal, 'id'>): Promise<Proposal | null> {
    try {
      const response = await apiService.post<Proposal>('/proposals', proposal);
      return response.data || null;
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
  }

  // Angebot aktualisieren
  async updateProposal(id: string, proposal: Partial<Proposal>): Promise<Proposal | null> {
    try {
      const response = await apiService.put<Proposal>(`/proposals/${id}`, proposal);
      return response.data || null;
    } catch (error) {
      console.error('Error updating proposal:', error);
      throw error;
    }
  }

  // Standard-AGB abrufen
  async getDefaultTermsAndConditions(): Promise<string> {
    try {
      const response = await apiService.get('/settings/terms-and-conditions');
      return response.data?.value || 'Allgemeine Geschäftsbedingungen hier einfügen...';
    } catch (error) {
      console.error('Error fetching default terms:', error);
      return 'Allgemeine Geschäftsbedingungen hier einfügen...';
    }
  }

  // E-Mail-Templates abrufen
  async getEmailTemplates(): Promise<any[]> {
    try {
      const response = await apiService.get('/email-templates');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching email templates:', error);
      // Rückgabe von Mock-Daten, falls keine Templates vorhanden sind
      return [
        {
          id: 'template-1',
          name: 'Standard-Angebot',
          subject: 'Ihr Angebot für Ihre Veranstaltung',
          message: 'Sehr geehrte/r {{clientName}},\n\nanbei finden Sie unser Angebot für Ihre Veranstaltung. Wir freuen uns auf Ihre Rückmeldung.\n\nMit freundlichen Grüßen,\nIhr Catering-Team'
        },
        {
          id: 'template-2',
          name: 'Hochzeit',
          subject: 'Ihr Catering-Angebot für Ihre Hochzeitsfeier',
          message: 'Sehr geehrte/r {{clientName}},\n\nvielen Dank für Ihre Anfrage. Anbei finden Sie unser Angebot für die Bewirtung Ihrer Hochzeitsfeier. Wir würden uns freuen, diesen besonderen Tag mit Ihnen zu gestalten.\n\nMit freundlichen Grüßen,\nIhr Catering-Team'
        }
      ];
    }
  }

  // Angebot per E-Mail senden
  async sendProposalEmail(proposalId: string, emailData: any): Promise<boolean> {
    try {
      const response = await apiService.post(`/proposals/${proposalId}/send-email`, emailData);
      return response.success || false;
    } catch (error) {
      console.error('Error sending proposal email:', error);
      throw error;
    }
  }

  async deleteProposal(id: string): Promise<void> {
    await apiService.delete(`/proposals/${id}`);
  }

  async updateProposalStatus(id: string, status: Proposal['status']): Promise<Proposal> {
    const response = await apiService.patch(`/proposals/${id}/status`, { status });
    return response.data;
  }

  async generatePdf(id: string): Promise<Blob> {
    const response = await apiService.get(`/proposals/${id}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export const proposalService = new ProposalService(); 