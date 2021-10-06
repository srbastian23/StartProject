// @flow
export const generateWhatsappLink = (whatsappNumber: string, text?: string) =>
  !text
    ? `https://wa.me/${whatsappNumber}`
    : `https://wa.me/${whatsappNumber}?text=${text}`;
