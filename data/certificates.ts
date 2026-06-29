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

export const certificates: Certificate[] = [
];
