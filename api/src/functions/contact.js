const { app } = require('@azure/functions');
const postmark = require('postmark');

const FROM_EMAIL = 'Humaloom Contact Us <noreply@humaloom.ai>';
const TO_EMAIL = 'contact@humaloom.ai';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.http('contact', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        let body;
        try {
            body = await request.json();
        } catch {
            return { status: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Invalid request body' }) };
        }

        const { name, email, company, message, website } = body;

        // Honeypot: bots fill hidden fields, humans don't
        if (website) {
            return { status: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: true }) };
        }

        // Server-side validation
        if (!name || typeof name !== 'string' || !name.trim()) {
            return { status: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Name is required' }) };
        }
        if (!email || !EMAIL_RE.test(email)) {
            return { status: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Valid email is required' }) };
        }
        if (!message || typeof message !== 'string' || !message.trim()) {
            return { status: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Message is required' }) };
        }

        const safeName = name.trim().substring(0, 200);
        const safeCompany = (company || '').trim().substring(0, 200);
        const safeMessage = message.trim().substring(0, 5000);

        const subject = `New contact: ${safeName}${safeCompany ? ` from ${safeCompany}` : ''}`;
        const textBody = [
            `Name: ${safeName}`,
            `Email: ${email}`,
            safeCompany ? `Company: ${safeCompany}` : null,
            '',
            safeMessage,
        ].filter(line => line !== null).join('\n');

        const htmlBody = `
<p><strong>Name:</strong> ${esc(safeName)}</p>
<p><strong>Email:</strong> ${esc(email)}</p>
${safeCompany ? `<p><strong>Company:</strong> ${esc(safeCompany)}</p>` : ''}
<p><strong>Message:</strong></p>
<p>${esc(safeMessage).replace(/\n/g, '<br>')}</p>
`.trim();

        try {
            const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);
            await client.sendEmail({
                From: FROM_EMAIL,
                To: TO_EMAIL,
                ReplyTo: email,
                Subject: subject,
                TextBody: textBody,
                HtmlBody: htmlBody,
                MessageStream: 'outbound',
            });

            return { status: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: true }) };
        } catch (err) {
            context.error('Postmark error:', err);
            return { status: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Failed to send message. Please try again.' }) };
        }
    }
});

function esc(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
