import type { GenerateDailyReportHtmlParams } from '$lib/email-templates/index.d';
import type { DailyRecord } from '$lib/records/records.map';

type Subreddit = {
	name: string;
	bestTimes: DailyRecord[];
	subscribers: number;
	category: string;
};

/**
 * Format number with commas
 */
function formatNumber(num: number): string {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Generate HTML for a subreddit section
 */
function generateSubredditHtml(
	subreddit: Subreddit,
	timezone: string,
	params: GenerateDailyReportHtmlParams
): string {
	// Sort best times by users (highest first)
	const sortedTimes = [...subreddit.bestTimes].sort(
		(a, b) => b.users - a.users
	);

	// Find the maximum users for scaling the bars
	const maxUsers = sortedTimes[0].users;

	// Generate rows for each best time
	const timeRows = sortedTimes
		.map((time, index) => {
			const percentage = Math.min((time.users / maxUsers) * 100, 100);

			const hour = new Date(time.date).getHours();

			// <td style="padding: 10px 15px; border: 1px solid #eeeeee;">${params.hourFormatter(time.date)}</td>
			return `
      <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f9f9f9'};">
        <td style="padding: 10px 15px; border: 1px solid #eeeeee;">${time.hhmm}</td>
        <td style="padding: 10px 15px; border: 1px solid #eeeeee;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="${percentage}%" style="background-color: #FF5700; height: 20px; border-radius: 10px;"></td>
              <td style="padding-left: 10px;">${formatNumber(time.users)}</td>
            </tr>
          </table>
        </td>
      </tr>
      `;
		})
		.join('');

	return `
    <!-- Subreddit: ${subreddit.name} -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px; border-collapse: collapse;">
      <tr>
        <td colspan="2" style="padding: 10px 15px; background-color: #FF5700; color: white; border-top-left-radius: 5px; border-top-right-radius: 5px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td>
                <h3 style="margin: 0; color: #ffffff; font-size: 18px;">${subreddit.name}</h3>
              </td>
              <td style="text-align: right;">
                <span style="font-size: 14px; color: #ffffff;">${subreddit.subscribers} subscribers</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr style="background-color: #f9f9f9;">
        <td width="30%" style="padding: 8px 15px; font-weight: bold; border: 1px solid #eeeeee;">Time</td>
        <td width="70%" style="padding: 8px 15px; font-weight: bold; border: 1px solid #eeeeee;">Active Users</td>
      </tr>
      ${timeRows}
      <tr>
        <td colspan="2" style="padding: 8px 15px; background-color: #f9f9f9; font-size: 14px; color: #666666; border: 1px solid #eeeeee; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;">
          Timezone: ${timezone}
        </td>
      </tr>
    </table>
    `;
}

/**
 * Generate a complete HTML email template for subreddit best times today
 */
export function generateDailyEmailHtml(
	params: GenerateDailyReportHtmlParams
): string {
	// Generate HTML for each subreddit
	const subredditSections = params.subreddits
		.map((subreddit) =>
			generateSubredditHtml(subreddit, params.timezone, params)
		)
		.join('');

	return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Today's Subreddit Best Posting Times</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; background-color: #f5f5f5;">
      <!-- Email Container -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <tr>
          <td style="padding: 20px; text-align: center; background-color: #FF5700;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Today's Best Posting Times</h1>
          </td>
        </tr>
        
        <!-- Introduction -->
        <tr>
          <td style="padding: 20px;">
            <p style="margin-top: 0;">Hello there,</p>
            <p>Here are the best times to post on your tracked subreddits for maximum engagement today (${params.date}).</p>
            <p>Each subreddit shows the 4 best hours to post based on today's projected user activity patterns.</p>
          </td>
        </tr>
        
        <!-- Subreddits Section -->
        <tr>
          <td style="padding: 0 20px 20px 20px;">
            <h2 style="color: #FF5700; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">Your Tracked Subreddits</h2>
            
            ${subredditSections}
            
            <p style="margin-top: 20px;">For best results, try to schedule your posts during these recommended times. Our algorithm analyzes real-time user activity to determine when your content is most likely to receive upvotes and comments.</p>
          </td>
        </tr>
        
        <!-- Tips Section -->
        <tr>
          <td style="padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #FF5700; margin-top: 0;">Today's Posting Tips</h2>
            <ul style="padding-left: 20px; margin-bottom: 0;">
              <li style="margin-bottom: 10px;">Post during peak hours to maximize initial visibility</li>
              <li style="margin-bottom: 10px;">Respond quickly to early comments to boost engagement</li>
              <li style="margin-bottom: 10px;">Consider the current trending topics in each subreddit</li>
              <li style="margin-bottom: 0;">Monitor your post performance and adjust your strategy for tomorrow</li>
            </ul>
          </td>
        </tr>
        
        <!-- Data Explanation -->
        <tr>
          <td style="padding: 20px;">
            <h3 style="color: #FF5700; margin-top: 0;">About This Data</h3>
            <p style="margin-top: 0; font-size: 14px; color: #666666;">
              This report shows the 4 best times to post on each subreddit based on projected user activity for today (${params.date}). 
              The "Active Users" metric represents the estimated number of users online during each hour.
              These projections are based on historical patterns and current trends.
            </p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="padding: 20px; text-align: center; font-size: 14px; color: #666666; background-color: #eeeeee;">
            <p style="margin: 0 0 10px 0;">You're receiving this email because you subscribed to Reddit Posting Times updates.</p>
            <p style="margin: 0 0 10px 0;">Email sent to: ${params.notificationEmail}</p>
            <p style="margin: 0;">
              <a href="#" style="color: #FF5700; text-decoration: none;">Unsubscribe</a> | 
              <a href="#" style="color: #FF5700; text-decoration: none;">Update Preferences</a> | 
              <a href="#" style="color: #FF5700; text-decoration: none;">View in Browser</a>
            </p>
            <p style="margin: 20px 0 0 0; font-size: 12px;">© ${new Date().getFullYear()} Reddit Posting Times. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
}
