import { Template } from '../types';

class TemplateService {
  private baseUrl = '/api/templates';

  async getTemplates(searchQuery?: string): Promise<Template[]> {
    const url = searchQuery 
      ? `${this.baseUrl}?search=${encodeURIComponent(searchQuery)}`
      : this.baseUrl;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Vorlagen');
    }
    return response.json();
  }

  async getTemplate(id: string): Promise<Template> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Vorlage');
    }
    return response.json();
  }

  async createTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });
    if (!response.ok) {
      throw new Error('Fehler beim Erstellen der Vorlage');
    }
    return response.json();
  }

  async updateTemplate(id: string, template: Partial<Template>): Promise<Template> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });
    if (!response.ok) {
      throw new Error('Fehler beim Aktualisieren der Vorlage');
    }
    return response.json();
  }

  async deleteTemplate(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Fehler beim Löschen der Vorlage');
    }
  }
}

export const templateService = new TemplateService(); 

class TemplateService {
  private baseUrl = '/api/templates';

  async getTemplates(searchQuery?: string): Promise<Template[]> {
    const url = searchQuery 
      ? `${this.baseUrl}?search=${encodeURIComponent(searchQuery)}`
      : this.baseUrl;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Vorlagen');
    }
    return response.json();
  }

  async getTemplate(id: string): Promise<Template> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Vorlage');
    }
    return response.json();
  }

  async createTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });
    if (!response.ok) {
      throw new Error('Fehler beim Erstellen der Vorlage');
    }
    return response.json();
  }

  async updateTemplate(id: string, template: Partial<Template>): Promise<Template> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });
    if (!response.ok) {
      throw new Error('Fehler beim Aktualisieren der Vorlage');
    }
    return response.json();
  }

  async deleteTemplate(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Fehler beim Löschen der Vorlage');
    }
  }
}

export const templateService = new TemplateService(); 

class TemplateService {
  private baseUrl = '/api/templates';

  async getTemplates(searchQuery?: string): Promise<Template[]> {
    const url = searchQuery 
      ? `${this.baseUrl}?search=${encodeURIComponent(searchQuery)}`
      : this.baseUrl;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Vorlagen');
    }
    return response.json();
  }

  async getTemplate(id: string): Promise<Template> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Vorlage');
    }
    return response.json();
  }

  async createTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });
    if (!response.ok) {
      throw new Error('Fehler beim Erstellen der Vorlage');
    }
    return response.json();
  }

  async updateTemplate(id: string, template: Partial<Template>): Promise<Template> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });
    if (!response.ok) {
      throw new Error('Fehler beim Aktualisieren der Vorlage');
    }
    return response.json();
  }

  async deleteTemplate(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Fehler beim Löschen der Vorlage');
    }
  }
}

export const templateService = new TemplateService(); 

class TemplateService {
  private baseUrl = '/api/templates';

  async getTemplates(searchQuery?: string): Promise<Template[]> {
    const url = searchQuery 
      ? `${this.baseUrl}?search=${encodeURIComponent(searchQuery)}`
      : this.baseUrl;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Vorlagen');
    }
    return response.json();
  }

  async getTemplate(id: string): Promise<Template> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Vorlage');
    }
    return response.json();
  }

  async createTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });
    if (!response.ok) {
      throw new Error('Fehler beim Erstellen der Vorlage');
    }
    return response.json();
  }

  async updateTemplate(id: string, template: Partial<Template>): Promise<Template> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });
    if (!response.ok) {
      throw new Error('Fehler beim Aktualisieren der Vorlage');
    }
    return response.json();
  }

  async deleteTemplate(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Fehler beim Löschen der Vorlage');
    }
  }
}

export const templateService = new TemplateService(); 

class TemplateService {
  private baseUrl = '/api/templates';

  async getTemplates(searchQuery?: string): Promise<Template[]> {
    const url = searchQuery 
      ? `${this.baseUrl}?search=${encodeURIComponent(searchQuery)}`
      : this.baseUrl;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Vorlagen');
    }
    return response.json();
  }

  async getTemplate(id: string): Promise<Template> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Vorlage');
    }
    return response.json();
  }

  async createTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });
    if (!response.ok) {
      throw new Error('Fehler beim Erstellen der Vorlage');
    }
    return response.json();
  }

  async updateTemplate(id: string, template: Partial<Template>): Promise<Template> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });
    if (!response.ok) {
      throw new Error('Fehler beim Aktualisieren der Vorlage');
    }
    return response.json();
  }

  async deleteTemplate(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Fehler beim Löschen der Vorlage');
    }
  }
}

export const templateService = new TemplateService(); 

class TemplateService {
  private baseUrl = '/api/templates';

  async getTemplates(searchQuery?: string): Promise<Template[]> {
    const url = searchQuery 
      ? `${this.baseUrl}?search=${encodeURIComponent(searchQuery)}`
      : this.baseUrl;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Vorlagen');
    }
    return response.json();
  }

  async getTemplate(id: string): Promise<Template> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Vorlage');
    }
    return response.json();
  }

  async createTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });
    if (!response.ok) {
      throw new Error('Fehler beim Erstellen der Vorlage');
    }
    return response.json();
  }

  async updateTemplate(id: string, template: Partial<Template>): Promise<Template> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });
    if (!response.ok) {
      throw new Error('Fehler beim Aktualisieren der Vorlage');
    }
    return response.json();
  }

  async deleteTemplate(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Fehler beim Löschen der Vorlage');
    }
  }
}

export const templateService = new TemplateService(); 