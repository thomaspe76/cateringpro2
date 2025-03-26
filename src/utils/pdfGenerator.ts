import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Proposal, ProposalItem } from '../types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

// Definiere Typerweiterung für jsPDF mit AutoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable?: {
      finalY: number;
    };
  }
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'dd.MM.yyyy', { locale: de });
};

class ProposalPdfGenerator {
  private doc: jsPDF;
  private proposal: Proposal;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 15;
  private lineHeight: number = 7;
  private colors = {
    primary: [14, 165, 233], // #0ea5e9 (RGB)
    secondary: [100, 116, 139], // #64748b (RGB)
    background: [241, 245, 249], // #f1f5f9 (RGB)
  };
  private fonts = {
    normal: 'helvetica',
    bold: 'helvetica-bold',
    italic: 'helvetica-oblique',
  };
  private fontSizes = {
    title: 18,
    subtitle: 14,
    heading: 12,
    normal: 10,
    small: 8,
  };

  constructor(proposal: Proposal) {
    this.proposal = proposal;
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.width;
    this.pageHeight = this.doc.internal.pageSize.height;
  }

  public async generatePdf(): Promise<Blob> {
    // Header und Meta-Informationen setzen
    this.doc.setProperties({
      title: `Angebot ${this.proposal.number}`,
      subject: `Angebot für ${this.proposal.client.name}`,
      author: 'CateringPro',
      creator: 'CateringPro',
    });

    // Dokument erstellen
    this.addHeader();
    this.addClientInformation();
    this.addEventInformation();
    this.addIntroText();
    this.addItemsTable();
    this.addTotals();
    this.addPaymentTerms();
    this.addFooter();

    // Als Blob zurückgeben
    return this.doc.output('blob');
  }

  private addHeader(): void {
    const currentY = this.margin;
    
    // Unternehmensname und -informationen
    this.doc.setFont(this.fonts.bold);
    this.doc.setFontSize(this.fontSizes.heading);
    this.doc.setTextColor(this.colors.primary[0], this.colors.primary[1], this.colors.primary[2]);
    
    // Position für Unternehmensinfo (rechts oben)
    const companyInfoX = this.pageWidth - this.margin - 80;
    
    // Standard-Unternehmensinformationen
    this.doc.text('CateringPro', companyInfoX, currentY);
    
    this.doc.setFont(this.fonts.normal);
    this.doc.setFontSize(this.fontSizes.small);
    this.doc.setTextColor(this.colors.secondary[0], this.colors.secondary[1], this.colors.secondary[2]);
    
    this.doc.text('Musterstraße 1', companyInfoX, currentY + this.lineHeight);
    this.doc.text('+49 123 456789', companyInfoX, currentY + this.lineHeight * 2);
    this.doc.text('info@cateringpro.de', companyInfoX, currentY + this.lineHeight * 3);
    
    // Angebotsinformationen
    const angebotY = currentY + 35;
    
    this.doc.setDrawColor(this.colors.primary[0], this.colors.primary[1], this.colors.primary[2]);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, angebotY - 5, this.pageWidth - this.margin, angebotY - 5);
    
    this.doc.setFont(this.fonts.bold);
    this.doc.setFontSize(this.fontSizes.title);
    this.doc.setTextColor(this.colors.primary[0], this.colors.primary[1], this.colors.primary[2]);
    this.doc.text('ANGEBOT', this.margin, angebotY);
    
    this.doc.setFont(this.fonts.normal);
    this.doc.setFontSize(this.fontSizes.normal);
    this.doc.setTextColor(0, 0, 0);
    
    const angebotInfoY = angebotY + 10;
    const infoColWidth = 45;
    
    this.doc.text('Angebots-Nr.:', this.margin, angebotInfoY);
    this.doc.text(this.proposal.number, this.margin + infoColWidth, angebotInfoY);
    
    this.doc.text('Datum:', this.margin, angebotInfoY + this.lineHeight);
    this.doc.text(formatDate(this.proposal.createdAt), this.margin + infoColWidth, angebotInfoY + this.lineHeight);
    
    this.doc.text('Gültig bis:', this.margin, angebotInfoY + this.lineHeight * 2);
    this.doc.text(
      this.proposal.validUntil ? formatDate(this.proposal.validUntil) : 'TBD',
      this.margin + infoColWidth,
      angebotInfoY + this.lineHeight * 2
    );
    
    // Angebot-Typ Badge
    this.addOrderTypeBadge(this.pageWidth - this.margin - 60, angebotInfoY);
  }

  private addOrderTypeBadge(x: number, y: number): void {
    const orderTypeLabels: Record<string, string> = {
      'self_pickup': 'Selbstabholung',
      'delivery': 'Lieferung',
      'delivery_with_staff': 'Lieferung mit Personal',
      'with_staff': 'Mit Personal vor Ort'
    };
    
    const label = orderTypeLabels[this.proposal.orderType] || 'Unbekannt';
    
    // Badge-Hintergrund
    this.doc.setFillColor(this.colors.primary[0], this.colors.primary[1], this.colors.primary[2]);
    this.doc.roundedRect(x, y - 5, 60, 10, 2, 2, 'F');
    
    // Badge-Text
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont(this.fonts.bold);
    this.doc.setFontSize(this.fontSizes.small);
    
    // Text zentrieren
    const textWidth = this.doc.getTextWidth(label);
    this.doc.text(label, x + (60 - textWidth) / 2, y);
    
    // Zurück zu normalen Farben
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont(this.fonts.normal);
    this.doc.setFontSize(this.fontSizes.normal);
  }

  private addClientInformation(): void {
    const startY = 80;
    
    this.doc.setFont(this.fonts.bold);
    this.doc.setFontSize(this.fontSizes.heading);
    this.doc.text('KUNDE', this.margin, startY);
    
    this.doc.setFont(this.fonts.normal);
    this.doc.setFontSize(this.fontSizes.normal);
    
    let yPos = startY + 7;
    
    this.doc.text(this.proposal.client.name, this.margin, yPos);
    yPos += this.lineHeight;
    
    if (this.proposal.client.email) {
      this.doc.text(this.proposal.client.email, this.margin, yPos);
      yPos += this.lineHeight;
    }
    
    if (this.proposal.client.phone) {
      this.doc.text(this.proposal.client.phone, this.margin, yPos);
      yPos += this.lineHeight;
    }
    
    if (this.proposal.client.street) {
      this.doc.text(
        `${this.proposal.client.street}, ${this.proposal.client.postalCode} ${this.proposal.client.city}`,
        this.margin,
        yPos
      );
    }
  }

  private addEventInformation(): void {
    const startY = 80;
    const rightColumnX = this.pageWidth / 2 + 10;
    
    this.doc.setFont(this.fonts.bold);
    this.doc.setFontSize(this.fontSizes.heading);
    this.doc.text('VERANSTALTUNG', rightColumnX, startY);
    
    this.doc.setFont(this.fonts.normal);
    this.doc.setFontSize(this.fontSizes.normal);
    
    let yPos = startY + 7;
    
    // Event-Name und Typ
    this.doc.text(this.proposal.eventName || 'Keine Bezeichnung', rightColumnX, yPos);
    yPos += this.lineHeight;
    
    // Datum und Uhrzeit
    this.doc.text(
      `${formatDate(this.proposal.eventDate)}, ${this.proposal.eventStartTime} - ${this.proposal.eventEndTime} Uhr`,
      rightColumnX,
      yPos
    );
    yPos += this.lineHeight;
    
    // Ort
    this.doc.text(this.proposal.eventLocation, rightColumnX, yPos);
    yPos += this.lineHeight;
    
    if (this.proposal.eventAddress) {
      this.doc.text(this.proposal.eventAddress, rightColumnX, yPos);
      yPos += this.lineHeight;
    }
    
    // Gästeanzahl
    yPos += this.lineHeight / 2;
    this.doc.text(`Anzahl Gäste: ${this.proposal.guests} Personen`, rightColumnX, yPos);
  }

  private addIntroText(): void {
    const startY = 140;
    
    this.doc.setDrawColor(this.colors.secondary[0], this.colors.secondary[1], this.colors.secondary[2]);
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, startY - 5, this.pageWidth - this.margin, startY - 5);
    
    this.doc.setFont(this.fonts.normal);
    this.doc.setFontSize(this.fontSizes.normal);
    
    const introText = this.proposal.introText || "Vielen Dank für Ihre Anfrage. Wir freuen uns, Ihnen folgendes Angebot unterbreiten zu können.";
    
    // Text-Wrapping für den Intro-Text
    const splitText = this.doc.splitTextToSize(
      introText,
      this.pageWidth - (this.margin * 2)
    );
    
    this.doc.text(splitText, this.margin, startY);
    
    this.doc.setDrawColor(this.colors.secondary[0], this.colors.secondary[1], this.colors.secondary[2]);
    this.doc.setLineWidth(0.3);
    this.doc.line(
      this.margin,
      startY + splitText.length * this.lineHeight + 5,
      this.pageWidth - this.margin,
      startY + splitText.length * this.lineHeight + 5
    );
  }

  private addItemsTable(): void {
    const startY = 180;
    
    this.doc.setFont(this.fonts.bold);
    this.doc.setFontSize(this.fontSizes.heading);
    this.doc.text('ANGEBOTSPOSITIONEN', this.margin, startY);
    
    // Gruppiere Items nach Kategorie
    const groupedItems = this.groupItemsByCategory();
    
    let currentY = startY + 10;
    
    // Tabelle für jede Kategorie
    Object.entries(groupedItems).forEach(([category, items]) => {
      // Kategorie-Header
      this.doc.setFont(this.fonts.bold);
      this.doc.setFontSize(this.fontSizes.subtitle);
      this.doc.text(category.toUpperCase(), this.margin, currentY);
      currentY += 8;
      
      // Tabellen-Header
      this.doc.setFont(this.fonts.bold);
      this.doc.setFontSize(this.fontSizes.normal);
      this.doc.text('Pos.', this.margin, currentY);
      this.doc.text('Bezeichnung', this.margin + 20, currentY);
      this.doc.text('Menge', this.pageWidth - this.margin - 80, currentY);
      this.doc.text('Einheit', this.pageWidth - this.margin - 60, currentY);
      this.doc.text('Einzelpreis', this.pageWidth - this.margin - 40, currentY);
      this.doc.text('Gesamtpreis', this.pageWidth - this.margin - 20, currentY);
      
      currentY += 6;
      
      // Tabellenzeilen
      this.doc.setFont(this.fonts.normal);
      items.forEach((item, index) => {
        // Position
        this.doc.text((index + 1).toString(), this.margin, currentY);
        
        // Bezeichnung
        const itemContent = this.formatItemContent(item);
        const splitContent = this.doc.splitTextToSize(itemContent, 100);
        this.doc.text(splitContent, this.margin + 20, currentY);
        
        // Menge
        this.doc.text(item.quantity.toString(), this.pageWidth - this.margin - 80, currentY);
        
        // Einheit
        this.doc.text(item.unit || '', this.pageWidth - this.margin - 60, currentY);
        
        // Einzelpreis
        this.doc.text(formatCurrency(item.unitPrice), this.pageWidth - this.margin - 40, currentY);
        
        // Gesamtpreis
        this.doc.text(formatCurrency(item.totalPrice), this.pageWidth - this.margin - 20, currentY);
        
        currentY += Math.max(splitContent.length * this.lineHeight, this.lineHeight * 1.5);
      });
      
      currentY += 5;
    });
  }

  private formatItemContent(item: ProposalItem): string {
    let content = item.name;
    if (item.description) {
      content += '\n' + item.description;
    }
    return content;
  }

  private addTotals(): void {
    const startY = (this.doc.lastAutoTable?.finalY ?? 200) + 10;
    
    this.doc.setDrawColor(this.colors.secondary[0], this.colors.secondary[1], this.colors.secondary[2]);
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, startY, this.pageWidth - this.margin, startY);
    
    const totalsY = startY + 10;
    
    // Zwischensumme
    this.doc.setFont(this.fonts.normal);
    this.doc.setFontSize(this.fontSizes.normal);
    this.doc.text('Zwischensumme:', this.pageWidth - this.margin - 100, totalsY);
    this.doc.text(formatCurrency(this.proposal.subtotal), this.pageWidth - this.margin - 20, totalsY);
    
    // MwSt.
    const mwstY = totalsY + this.lineHeight;
    this.doc.text(`MwSt. (${this.proposal.taxRate}%):`, this.pageWidth - this.margin - 100, mwstY);
    this.doc.text(formatCurrency(this.proposal.taxAmount), this.pageWidth - this.margin - 20, mwstY);
    
    // Gesamtbetrag
    const totalY = mwstY + this.lineHeight;
    this.doc.setFont(this.fonts.bold);
    this.doc.setFontSize(this.fontSizes.heading);
    this.doc.text('Gesamtbetrag:', this.pageWidth - this.margin - 100, totalY);
    this.doc.text(formatCurrency(this.proposal.total), this.pageWidth - this.margin - 20, totalY);
  }

  private addPaymentTerms(): void {
    const startY = (this.doc.lastAutoTable?.finalY ?? 200) + 60;
    
    this.doc.setFont(this.fonts.bold);
    this.doc.setFontSize(this.fontSizes.heading);
    this.doc.text('ZAHLUNGSBEDINGUNGEN', this.margin, startY);
    
    this.doc.setFont(this.fonts.normal);
    this.doc.setFontSize(this.fontSizes.normal);
    
    const termsY = startY + 10;
    const splitTerms = this.doc.splitTextToSize(
      this.proposal.paymentTerms,
      this.pageWidth - (this.margin * 2)
    );
    
    this.doc.text(splitTerms, this.margin, termsY);
  }

  private addFooter(): void {
    const startY = this.pageHeight - 40;
    
    this.doc.setDrawColor(this.colors.secondary[0], this.colors.secondary[1], this.colors.secondary[2]);
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, startY, this.pageWidth - this.margin, startY);
    
    this.doc.setFont(this.fonts.normal);
    this.doc.setFontSize(this.fontSizes.small);
    this.doc.setTextColor(this.colors.secondary[0], this.colors.secondary[1], this.colors.secondary[2]);
    
    const footerY = startY + 5;
    this.doc.text('CateringPro - Ihr Partner für Catering und Events', this.margin, footerY);
    this.doc.text('www.cateringpro.de', this.pageWidth - this.margin - 40, footerY);
  }

  private groupItemsByCategory(): Record<string, ProposalItem[]> {
    return this.proposal.items.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, ProposalItem[]>);
  }
}

export const generateProposalPdf = async (proposal: Proposal): Promise<Blob> => {
  const generator = new ProposalPdfGenerator(proposal);
  return generator.generatePdf();
}; 