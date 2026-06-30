import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendDoctorApprovedEmail = async (doctorEmail, doctorName) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: doctorEmail,
      subject: "Your Medivox profile has been approved",
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: #0C447C; padding: 24px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Medivox</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 13px;">AI Health Platform</p>
          </div>
          <div style="background: white; padding: 32px; border: 1px solid #E6F1FB; border-top: none; border-radius: 0 0 16px 16px;">
            <div style="background: #E1F5EE; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
              <p style="color: #085041; font-size: 32px; margin: 0;">✓</p>
              <h2 style="color: #085041; margin: 8px 0 0; font-size: 20px;">Profile Approved</h2>
            </div>
            <p style="color: #042C53; font-size: 16px;">Dear Dr. ${doctorName},</p>
            <p style="color: #5F5E5A; line-height: 1.6;">
              Congratulations! Your Medivox doctor profile has been reviewed and
              <strong style="color: #1D9E75;">approved</strong> by our admin team.
              You are now visible to patients on the platform.
            </p>
            <p style="color: #5F5E5A; line-height: 1.6;">
              Patients in your area can now find and book appointments with you.
              Make sure your profile is complete with your consultancy details and available hours.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://medivox-two.vercel.app/login"
                style="background: #1D9E75; color: white; padding: 14px 32px; border-radius: 10px;
                       text-decoration: none; font-weight: 600; font-size: 15px;">
                Go to your dashboard
              </a>
            </div>
            <p style="color: #888780; font-size: 13px; margin-top: 24px;">
              If you have any questions, feel free to contact our support team.
            </p>
          </div>
          <p style="text-align: center; color: #888780; font-size: 12px; margin-top: 20px;">
            2026 Medivox · AI Health Platform
          </p>
        </div>
      `,
    });
    console.log("Approval email sent to:", doctorEmail);
  } catch (err) {
    console.error("Email send failed:", err);
  }
};

export const sendDoctorRejectedEmail = async (
  doctorEmail,
  doctorName,
  reason,
) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: doctorEmail,
      subject: "Update on your Medivox profile application",
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: #0C447C; padding: 24px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Medivox</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 13px;">AI Health Platform</p>
          </div>
          <div style="background: white; padding: 32px; border: 1px solid #E6F1FB; border-top: none; border-radius: 0 0 16px 16px;">
            <div style="background: #FCEBEB; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
              <p style="color: #A32D2D; font-size: 32px; margin: 0;">✗</p>
              <h2 style="color: #A32D2D; margin: 8px 0 0; font-size: 20px;">Application Not Approved</h2>
            </div>
            <p style="color: #042C53; font-size: 16px;">Dear Dr. ${doctorName},</p>
            <p style="color: #5F5E5A; line-height: 1.6;">
              Thank you for applying to join Medivox. After reviewing your application,
              our admin team was unable to approve your profile at this time.
            </p>
            ${
              reason
                ? `
            <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #854F0B; font-weight: 600; margin: 0 0 4px;">Reason:</p>
              <p style="color: #854F0B; margin: 0;">${reason}</p>
            </div>
            `
                : ""
            }
            <p style="color: #5F5E5A; line-height: 1.6;">
              You can update your documents and information and resubmit your application
              through your dashboard.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://medivox-two.vercel.app/login"
                style="background: #0C447C; color: white; padding: 14px 32px; border-radius: 10px;
                       text-decoration: none; font-weight: 600; font-size: 15px;">
                Update your profile
              </a>
            </div>
          </div>
          <p style="text-align: center; color: #888780; font-size: 12px; margin-top: 20px;">
            2026 Medivox · AI Health Platform
          </p>
        </div>
      `,
    });
    console.log("Rejection email sent to:", doctorEmail);
  } catch (err) {
    console.error("Email send failed:", err);
  }
};
