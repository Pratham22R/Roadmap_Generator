
interface EmailLayoutProps {
  previewText: string;
  heading: string;
  content: string;
  actionText?: string;
  actionUrl?: string;
  accentColor?: string; // Hex code, defaults to primary blue/purple
}

export const emailLayout = ({
  previewText,
  heading,
  content,
  actionText,
  actionUrl,
  accentColor = "#d0d0d0ff",
}: EmailLayoutProps) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${heading}</title>
  <style>
    /* Base Reset */
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; color: #1f2937; line-height: 1.6; }
    a { text-decoration: none; }
    
    /* Container */
    .wrapper { width: 100%; table-layout: fixed; background-color: #f3f4f6; padding-bottom: 40px; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
    
    /* Header */
    .header { padding: 30px 40px; text-align: center; background: linear-gradient(135deg, ${accentColor} 0%, ${adjustColor(accentColor, -20)} 100%); }
    .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    
    /* Content */
    .body { padding: 40px 40px 20px; }
    .body p { margin-bottom: 16px; font-size: 16px; color: #4b5563; }
    
    /* Button */
    .cta-container { text-align: center; margin: 30px 0; }
    .button { display: inline-block; padding: 14px 32px; background-color: ${accentColor}; color: #ffffff !important; font-weight: 600; border-radius: 50px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s; }
    
    /* Footer */
    .footer { padding: 20px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb; font-size: 14px; color: #9ca3af; }
    .footer p { margin: 5px 0; }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .header, .body { padding: 20px !important; }
      .header h1 { font-size: 20px !important; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
      ${previewText}
    </div>
    
    <div style="height: 40px;"></div>

    <div class="email-container">
      <!-- Header with Gradient -->
      <div class="header">
        <h1>${heading}</h1>
      </div>

      <!-- Main Content -->
      <div class="body">
        ${content}

        ${actionText && actionUrl ? `
        <div class="cta-container">
          <a href="${actionUrl}" class="button">${actionText}</a>
        </div>
        ` : ''}
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Roadmap Generator. All rights reserved.</p>
        <p>Helping you master your career journey.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Simple color helper to darken hex for gradient
function adjustColor(color: string, amount: number) {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}
