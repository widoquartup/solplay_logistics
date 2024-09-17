export interface EmailContentType {
    code?: string;
    link?: string;
    paragraphs_u: string[];
    paragraphs_d: string[];
    text: string;
    subject: string;
    to: string
    preheader: string
}
