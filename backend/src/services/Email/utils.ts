import type { EmailContentType } from "./EmailContentType";

export function generateEmailText(data: EmailContentType): string {
    let emailText = '';

    // Agrega los párrafos superiores
    data.paragraphs_u.forEach(paragraph => {
        emailText += `${paragraph}\n`;
    });

    // Agrega el código o el enlace, según esté disponible
    if (data.code) {
        emailText += `${data.code}\n`;
    } else if (data.link) {
        emailText += `${data.link}\n`;
    }

    // Agrega los párrafos inferiores
    data.paragraphs_d.forEach(paragraph => {
        emailText += `${paragraph}\n`;
    });

    // Agrega el texto adicional
    emailText += `${data.text}`;

    return emailText;
}