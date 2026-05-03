from flask import Flask, render_template, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

app = Flask(__name__)

# ===== GoDaddy SMTP Config =====
SMTP_HOST  = "smtpout.secureserver.net"
SMTP_PORT  = 465
EMAIL_USER = "ali_aadly@cairologistics.net"
EMAIL_PASS = os.environ.get("EMAIL_PASS", "YOUR_PASSWORD_HERE")
EMAIL_TO   = "ali_aadly@cairologistics.net"


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.get_json()

    name    = data.get('name', '').strip()
    email   = data.get('email', '').strip()
    subject = data.get('subject', 'New Message from Website').strip()
    message = data.get('message', '').strip()

    if not name or not email or not message:
        return jsonify({'success': False, 'error': 'Missing required fields'}), 400

    try:
        msg = MIMEMultipart('alternative')
        msg['Subject']  = f"[CLC Website] {subject}"
        msg['From']     = EMAIL_USER
        msg['To']       = EMAIL_TO
        msg['Reply-To'] = email

        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px;
                      padding: 30px; border-top: 5px solid #1a8c3c;">
            <h2 style="color: #1a8c3c; margin-bottom: 20px;">
              New Message — Cairo Logistics Website
            </h2>
            <table style="width:100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #555; width: 120px;">Name</td>
                <td style="padding: 10px; color: #222;">{name}</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Email</td>
                <td style="padding: 10px; color: #222;">
                  <a href="mailto:{email}" style="color: #1a8c3c;">{email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #555;">Subject</td>
                <td style="padding: 10px; color: #222;">{subject}</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding: 10px; font-weight: bold; color: #555; vertical-align: top;">Message</td>
                <td style="padding: 10px; color: #222; white-space: pre-wrap;">{message}</td>
              </tr>
            </table>
            <p style="margin-top: 30px; font-size: 12px; color: #aaa; text-align: center;">
              Cairo Logistics CLC — Heliopolis, Cairo, Egypt
            </p>
          </div>
        </body>
        </html>
        """

        msg.attach(MIMEText(html_body, 'html'))

        # محاولة أولى: SSL على port 465
        try:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
                server.login(EMAIL_USER, EMAIL_PASS)
                server.sendmail(EMAIL_USER, EMAIL_TO, msg.as_string())

        except Exception:
            # محاولة تانية: TLS على port 587
            with smtplib.SMTP(SMTP_HOST, 587, timeout=15) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(EMAIL_USER, EMAIL_PASS)
                server.sendmail(EMAIL_USER, EMAIL_TO, msg.as_string())

        return jsonify({'success': True})

    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)