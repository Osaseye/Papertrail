const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Resend } = require("resend");

admin.initializeApp();
const db = admin.firestore();

// Use process.env for modern Firebase Functions config (via .env file)
const RESEND_API_KEY = process.env.RESEND_API_KEY; 
const resend = new Resend(RESEND_API_KEY);

/**
 * Trigger: When a newsletter document is written.
 * Listens for status change to 'sent'.
 */
exports.sendNewsletter = functions.firestore
  .document("newsletters/{newsletterId}")
  .onWrite(async (change, context) => {
    const newData = change.after.exists ? change.after.data() : null;
    const oldData = change.before.exists ? change.before.data() : null;

    if (!newData) return; // Document deleted

    // Trigger only when status changes to 'sent'
    // AND it hasn't been processed yet (check for deliveryStatus to be safe)
    if (newData.status === 'sent' && (!oldData || oldData.status !== 'sent')) {
      
      const newsletterId = context.params.newsletterId;
      const creatorId = newData.creatorId;
      const subject = newData.subject || "New Newsletter";
      // Fallback content if empty
      const htmlContent = newData.content || "<p>No content provided.</p>";

      console.log(`[Function] Starting delivery for Newsletter ${newsletterId} by Creator ${creatorId}`);

      try {
        // 1. Fetch Creator Profile (for "From" name)
        const creatorBrandSnap = await db.collection('creator-brands').doc(creatorId).get();
        const brandName = creatorBrandSnap.exists ? creatorBrandSnap.data().brandName : "Papertrail Creator";
        
        // 2. Fetch Subscribers
        const subsSnap = await db.collection('creator-brands')
                                .doc(creatorId)
                                .collection('subscribers')
                                .where('status', '==', 'active') // Only active subs
                                .get();

        if (subsSnap.empty) {
           console.log("[Function] No active subscribers found.");
           return change.after.ref.update({ 
               deliveryStatus: 'completed',
               'stats.sentCount': 0
           });
        }

        const recipients = [];
        subsSnap.forEach(doc => {
            const data = doc.data();
            if (data.email) recipients.push(data.email);
        });

        console.log(`[Function] Found ${recipients.length} recipients.`);

        // 3. Send via Resend
        // NOTE: In Production, verify your domain on Resend to use a custom 'from' address.
        // For 'onboarding@resend.dev', you can only send to your own tested email.
        const fromAddress = `${brandName.replace(/[^a-zA-Z0-9]/g, "")} <onboarding@resend.dev>`; 

        // Batching: Resend recommends sending individually for transactional, 
        // or using their Broadcasts API. For a simple implementation:
        // We will loop through recipients. 
        // WARNING: Cloud Functions max timeout is 60s (default) to 9 mins. 
        // Sending 1000s of emails sequentially will timeout. 
        // For MVP (small scale), we use Promise.all in chunks.
        
        const chunkSize = 20; 
        for (let i = 0; i < recipients.length; i += chunkSize) {
            const chunk = recipients.slice(i, i + chunkSize);
            
            // Send parallel requests for the chunk
            const promises = chunk.map(email => {
                return resend.emails.send({
                    from: "onboarding@resend.dev", // Enforced by Free Tier unless domain verified
                    to: email,
                    subject: subject,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h1>${brandName}</h1>
                            <hr/>
                            ${htmlContent}
                            <hr/>
                            <p style="font-size: 12px; color: #888;">
                                You received this because you subscribed to ${brandName} on Papertrail.
                                <a href="#">Unsubscribe</a>
                            </p>
                        </div>
                    `
                });
            });
            
            await Promise.all(promises);
            console.log(`[Function] Sent batch ${i} - ${i + chunk.length}`);
        }

        // 4. Update Newsletter Document
        await change.after.ref.update({
            deliveryStatus: 'completed',
            deliveredAt: admin.firestore.FieldValue.serverTimestamp(),
            'stats.sentCount': recipients.length
        });

      } catch (error) {
        console.error("[Function] Error sending newsletter:", error);
        await change.after.ref.update({
            deliveryStatus: 'failed',
            error: error.message
        });
      }
    }
  });
