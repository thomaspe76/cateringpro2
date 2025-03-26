import { Proposal } from '../types/proposal';
import { generateProposalPDF } from './pdfGenerator';

export const sendProposalEmail = async (proposal: Proposal): Promise<void> => {
  try {
    // Hier würde die tatsächliche E-Mail-Versand-Logik implementiert werden
    // Zum Beispiel mit nodemailer oder einem E-Mail-Service wie SendGrid
    
    // 1. PDF generieren
    await generateProposalPDF(proposal);
    
    // 2. E-Mail-Template erstellen
    const emailTemplate = {
      to: 'kunde@example.com', // Dies würde aus den Kundendaten kommen
      subject: `Ihr Angebot ${proposal.number} für ${proposal.eventName}`,
      html: `
        <h1>Ihr Angebot von CateringPro</h1>
        <p>Sehr geehrte Damen und Herren,</p>
        <p>vielen Dank für Ihr Interesse an unseren Dienstleistungen. Anbei finden Sie unser Angebot für Ihre Veranstaltung:</p>
        <ul>
          <li>Veranstaltung: ${proposal.eventName}</li>
          <li>Datum: ${new Date(proposal.eventDate).toLocaleDateString()}</li>
          <li>Zeit: ${proposal.eventStartTime} - ${proposal.eventEndTime}</li>
          <li>Ort: ${proposal.eventLocation}</li>
          <li>Anzahl Gäste: ${proposal.guests}</li>
        </ul>
        <p>Der Gesamtbetrag beläuft sich auf ${proposal.finalAmount.toFixed(2)} € inkl. ${proposal.taxRate}% MwSt.</p>
        <p>Für Rückfragen stehen wir Ihnen gerne zur Verfügung.</p>
        <p>Mit freundlichen Grüßen<br>Ihr CateringPro Team</p>
      `,
      attachments: [
        {
          filename: `Angebot_${proposal.number}.pdf`,
          path: `./temp/Angebot_${proposal.number}.pdf` // Der tatsächliche Pfad würde konfiguriert werden
        }
      ]
    };
    
    // 3. E-Mail senden (Beispiel-Implementation)
    console.log('E-Mail würde gesendet werden:', emailTemplate);
    
    // Hier würde der tatsächliche E-Mail-Versand implementiert werden
    // await sendEmail(emailTemplate);
    
  } catch (error) {
    console.error('Fehler beim E-Mail-Versand:', error);
    throw new Error('E-Mail konnte nicht gesendet werden');
  }
}; 