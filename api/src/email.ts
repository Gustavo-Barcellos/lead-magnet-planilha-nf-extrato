import type { LeadRecord } from './db';

export async function sendEmail(
  lead: LeadRecord,
  template: string,
  attachmentPath?: string
): Promise<void> {
  console.info('sendEmail called', {
    leadId: lead.id,
    template,
    attachmentPath
  });
}
