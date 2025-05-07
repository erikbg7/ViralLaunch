import { preferences } from './../server/db/schema';
import type { GenerateReportHtmlParams } from './index.d';
import { generateWeeklyEmailHtml } from '$lib/email-templates/weekly-template';
import { generateDailyEmailHtml } from './daily-template';

/**
 * Generate HTML email based on template type
 */
export function generateEmailHtml(params: GenerateReportHtmlParams): string {
	if (params.templateType === 'daily') {
		if (!params.date) {
			throw new Error('Date is required for daily template');
		}

		return generateDailyEmailHtml(params);
	}
	return '';
	// } else {
	// 	if (!params.dateRange) {
	// 		throw new Error('Date range is required for weekly template');
	// 	}

	// 	return generateWeeklyEmailHtml(params);
	// }
}
