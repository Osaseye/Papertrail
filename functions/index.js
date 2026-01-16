const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();
const db = admin.firestore();

// Initialize SendGrid
// Ensure you set this in your Firebase config or environment: 
// firebase functions:config:set sendgrid.key="YOUR_API_KEY"
// OR use a .env file locally.
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || functions.config().sendgrid?.key;
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn("SendGrid API Key is missing! Emails will not send.");
}

// TODO: Update this to your PRODUCTION domain when deploying
// const BASE_URL = "https://papertrail.app"; 
const BASE_URL = "http://localhost:5173"; 

/**
 * Trigger: When a newsletter document is written.
 * Only triggers if status changes to 'sent'.
 * Respects user delivery preferences (Instant only).
 */
exports.sendNewsletter = functions.firestore
  .document("newsletters/{newsletterId}")
  .onWrite(async (change, context) => {
    const newData = change.after.exists ? change.after.data() : null;
    const oldData = change.before.exists ? change.before.data() : null;

    if (!newData) return; // Document was deleted

    // Check if status changed to 'sent'
    // Also ensuring it wasn't already 'sent' (prevent double trigger on minor edits after send)
    const isNowSent = newData.status === 'sent';
    const wasNotSent = !oldData || oldData.status !== 'sent';

    if (isNowSent && wasNotSent) {
      const newsletterId = context.params.newsletterId;
      const creatorId = newData.creatorId;
      const subject = newData.subject || "New Post";
      const previewText = newData.previewText || "Read the latest update on Papertrail";

      console.log(`[Function] Preparing delivery for Newsletter ${newsletterId} by Creator ${creatorId}`);

      try {
        // 1. Fetch Creator Brand Details
        const brandSnap = await db.collection('creator-brands').doc(creatorId).get();
        const brandName = brandSnap.exists ? brandSnap.data().brandName : "Papertrail Creator";
        // const brandAvatar = brandSnap.exists ? brandSnap.data().avatar : null; 

        // 2. Fetch All Active Subscribers
        const subscribersSnap = await db.collection('creator-brands')
            .doc(creatorId)
            .collection('subscribers')
            .where('status', '==', 'active')
            .get();

        if (subscribersSnap.empty) {
          console.log("[Function] No active subscribers found.");
          return change.after.ref.update({ 
            deliveryStatus: 'completed',
            'stats.sentCount': 0
          });
        }

        const subscribers = subscribersSnap.docs.map(doc => doc.data());
        const recipients = [];

        // 3. Filter Subscribers based on Delivery Preferences
        // We need to check the 'users' collection for each subscriber (if they have a userId)
        // to see if they prefer "Instant", "Daily", or "Weekly".
        // This function ONLY handles "Instant".

        // Optimisation: We fetch users in parallel batches
        const USER_FETCH_BATCH = 10;
        
        // Helper to check preference
        const checkPreferenceAndAdd = async (sub) => {
             if (!sub.userId) {
                 // Guest subscriber (no account) -> Default to Instant
                 recipients.push(sub.email);
                 return;
             }

             try {
                 const userSnap = await db.collection('users').doc(sub.userId).get();
                 if (!userSnap.exists) {
                     // User deleted account? fallback to email if available, or skip. 
                     // Let's safe fallback to Instant if they are in subscriber list
                     recipients.push(sub.email); 
                     return;
                 }

                 const userData = userSnap.data();
                 const frequency = userData.deliverySettings?.frequency || 'instant'; // Default to instant

                 if (frequency === 'instant') {
                     recipients.push(sub.email);
                 } else {
                     console.log(`[Function] Skipping ${sub.email} - Preference: ${frequency}`);
                     // TODO: In a real system, these would be picked up by a Scheduled Function
                 }
             } catch (err) {
                 console.error(`Error checking user ${sub.userId} preferences:`, err);
                 // Fallback to sending if error? Or fail safe? 
                 // Let's send to ensure delivery.
                 recipients.push(sub.email);
             }
        };

        // Process subscribers in chunks
        for (let i = 0; i < subscribers.length; i += USER_FETCH_BATCH) {
             const chunk = subscribers.slice(i, i + USER_FETCH_BATCH);
             await Promise.all(chunk.map(sub => checkPreferenceAndAdd(sub)));
        }

        console.log(`[Function] Sending instant emails to ${recipients.length} recipients (Total subs: ${subscribers.length})`);

        if (recipients.length === 0) {
            return change.after.ref.update({ 
                deliveryStatus: 'completed',
                'stats.skippedCount': subscribers.length 
            });
        }

        // 4. Generate HTML Template
        const htmlEmail = generateCardTemplate({
            brandName,
            subject,
            previewText,
            link: `${BASE_URL}/read/${newsletterId}`
        });

        // 5. Send via SendGrid
        const msg = {
          to: recipients, 
          from: 'updates@papertrail.app', // Validate this sender in SendGrid!
          subject: `${brandName}: ${subject}`,
          html: htmlEmail,
          isMultiple: true // VERY IMPORTANT: Hides other recipients
        };

        if (SENDGRID_API_KEY) {
            await sgMail.send(msg);
            console.log("[Function] Emails sent via SendGrid");
        } else {
            console.log("[Function] Dry Run - No API Key. Email Content:", htmlEmail);
        }

        // 6. Update Newsletter Stats
        return change.after.ref.update({
            deliveryStatus: 'completed',
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
            'stats.sentCount': recipients.length
        });

      } catch (error) {
        console.error("[Function] Error sending newsletter:", error);
        return change.after.ref.update({
            deliveryStatus: 'failed',
            error: error.message
        });
      }
    }
  });


/**
 * Generates the "Card" style email HTML
 */
function generateCardTemplate({ brandName, subject, previewText, link }) {
    return `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>
    body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f1f5f9; }
    .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); text-align: center; }
    .brand { font-size: 24px; font-weight: bold; color: #0f172a; margin-bottom: 30px; letter-spacing: -0.5px; }
    .subject { font-size: 20px; font-weight: 600; color: #1e293b; margin: 0 0 16px 0; line-height: 1.4; }
    .preview { font-size: 16px; color: #64748b; margin: 0 0 32px 0; line-height: 1.6; }
    .button { background-color: #000000; color: #ffffff; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: 500; font-size: 16px; display: inline-block; transition: background-color 0.2s; }
    .button:hover { background-color: #334155; }
    .footer { margin-top: 32px; font-size: 12px; color: #94a3b8; text-align: center; }
    @media (max-width: 600px) {
        .card { padding: 24px; }
        .brand { font-size: 20px; }
    }
</style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="brand">${brandName}</div>
            <h2 class="subject">${subject}</h2>
            <p class="preview">${previewText}</p>
            <a href="${link}" class="button">Read Online</a>
            <div class="footer">
                <p>You received this because you are subscribed to ${brandName}.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
}
