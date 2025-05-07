import type { GenerateWeeklyReportHtmlParams } from '$lib/email-templates/index.d';

/**
 * Format hour to 12-hour format with AM/PM
 */
function formatHour(hour: number): string {
	const period = hour >= 12 ? 'PM' : 'AM';
	const displayHour = hour % 12 === 0 ? 12 : hour % 12;
	return `${displayHour}:00 ${period}`;
}

/**
 * Format number with commas
 */
function formatNumber(num: number): string {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Generate HTML for a subreddit section
 */
function generateSubredditSectionsHtml(
	index: number,
	params: GenerateWeeklyReportHtmlParams
): string {
	// Sort best times by users (highest first)
	const bestTimes = params.subreddits[index].bestTimes;
	const sortedTimes = [...bestTimes].sort((a, b) => b.users - a.users);

	// Find the maximum users for scaling the bars
	const maxUsers = sortedTimes[0].users;
	const subreddit = params.subreddits[index];

	// Generate rows for each best time
	const timeRows = sortedTimes
		.map((time, index) => {
			const percentage = Math.min((time.users / maxUsers) * 100, 100);

			const day = new Date(time.date).toLocaleString('en-US', {
				weekday: 'long',
				timeZone: 'UTC'
			});

			const hour = new Date(time.date).getHours();

			return `
      <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f9f9f9'};">
        <td style="padding: 10px 15px; border: 1px solid #eeeeee;">${day}</td>
        <td style="padding: 10px 15px; border: 1px solid #eeeeee;">${formatHour(hour)}</td>
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
        <td colspan="3" style="padding: 10px 15px; background-color: #FF5700; color: white; border-top-left-radius: 5px; border-top-right-radius: 5px;">
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
        <td width="25%" style="padding: 8px 15px; font-weight: bold; border: 1px solid #eeeeee;">Day</td>
        <td width="25%" style="padding: 8px 15px; font-weight: bold; border: 1px solid #eeeeee;">Time</td>
        <td width="50%" style="padding: 8px 15px; font-weight: bold; border: 1px solid #eeeeee;">Active Users</td>
      </tr>
      ${timeRows}
      <tr>
        <td colspan="3" style="padding: 8px 15px; background-color: #f9f9f9; font-size: 14px; color: #666666; border: 1px solid #eeeeee; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;">
          Category: ${subreddit.category}
        </td>
      </tr>
    </table>
    `;
}

/**
 * Generate a complete HTML email template for subreddit best times
 */
export function generateWeeklyEmailHtml(
	params: GenerateWeeklyReportHtmlParams
): string {
	// Generate HTML for each subreddit
	const subredditSections = params.subreddits
		.map((_, index) => generateSubredditSectionsHtml(index, params))
		.join('');

	return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Your Weekly Subreddit Best Posting Times</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; background-color: #f5f5f5;">
      <!-- Email Container -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <tr>
          <td style="padding: 20px; text-align: center; background-color: #FF5700;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Subreddit Best Posting Times</h1>
          </td>
        </tr>
        
        <!-- Introduction -->
        <tr>
          <td style="padding: 20px;">
            <p style="margin-top: 0;">Hello there,</p>
            <p>Here are the best times to post on your tracked subreddits for maximum engagement. This analysis is based on data from the previous week (${params.dateRange.start} - ${params.dateRange.end}).</p>
            <p>Each subreddit shows the 4 best times to post based on user activity patterns.</p>
          </td>
        </tr>
        
        <!-- Subreddits Section -->
        <tr>
          <td style="padding: 0 20px 20px 20px;">
            <h2 style="color: #FF5700; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">Your Tracked Subreddits</h2>
            
            ${subredditSections}
            
            <p style="margin-top: 20px;">For best results, try to schedule your posts during these recommended times. Our algorithm analyzes thousands of posts to determine when your content is most likely to receive upvotes and comments.</p>
          </td>
        </tr>
        
        <!-- Tips Section -->
        <tr>
          <td style="padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #FF5700; margin-top: 0;">Posting Tips</h2>
            <ul style="padding-left: 20px; margin-bottom: 0;">
              <li style="margin-bottom: 10px;">Craft clear, concise titles that accurately represent your content</li>
              <li style="margin-bottom: 10px;">Follow each subreddit's specific rules and formatting guidelines</li>
              <li style="margin-bottom: 10px;">Engage with comments on your posts to boost visibility</li>
              <li style="margin-bottom: 0;">Quality content matters more than perfect timing</li>
            </ul>
          </td>
        </tr>
        
        <!-- Data Explanation -->
        <tr>
          <td style="padding: 20px;">
            <h3 style="color: #FF5700; margin-top: 0;">About This Data</h3>
            <p style="margin-top: 0; font-size: 14px; color: #666666;">
              This report shows the 4 best times to post on each subreddit based on user activity from ${params.dateRange.start} to ${params.dateRange.end}. 
              The "Active Users" metric represents the average number of users online during that hour on that day of the week.
              Higher user counts typically correlate with better engagement for your posts.
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
