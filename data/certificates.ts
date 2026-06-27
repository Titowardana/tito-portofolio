export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  credentialId: string;
  issueDate: string;
  expiryDate: string;
  image: string;
  credentialUrl: string;
  featured: boolean;
  active: boolean;
  order: number;
}

// TODO: Isi data sertifikat setelah diverifikasi
export const certificates: Certificate[] = [];
