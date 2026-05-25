import nodemailer from "nodemailer";

const DEFAULT_CONTACT_TO = "msutsho55@gmail.com";

const SUBJECT_LABELS: Record<string, string> = {
  order: "Order Inquiry",
  product: "Product Question",
  return: "Return / Exchange",
  wholesale: "Wholesale",
  other: "Other",
};

export interface ContactEmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export function getContactRecipient(): string {
  return process.env.CONTACT_EMAIL_TO?.trim() || DEFAULT_CONTACT_TO;
}

export function isMailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

export async function sendContactEmail(
  payload: ContactEmailPayload
): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error("MAIL_NOT_CONFIGURED");
  }

  const to = getContactRecipient();
  const from = process.env.GMAIL_USER!;
  const subjectLabel =
    SUBJECT_LABELS[payload.subject] || payload.subject || "General";

  await transporter.sendMail({
    from: `"TVibeFlex Contact" <${from}>`,
    to,
    replyTo: payload.email,
    subject: `[TVibeFlex] ${subjectLabel} — ${payload.name}`,
    text: [
      `New contact form message`,
      ``,
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Topic: ${subjectLabel}`,
      ``,
      `Message:`,
      payload.message,
    ].join("\n"),
    html: `
      <h2>New contact form message</h2>
      <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></p>
      <p><strong>Topic:</strong> ${escapeHtml(subjectLabel)}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>
    `,
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
