import { TemplateType } from './index.d';
import { type Preferences } from './../server/db/schema';
import type { TimeFormat, TimeZone } from '$lib/constants';
import { DailyRecord } from '../records/records.map';
// Types for the templates

export type TemplateType = 'daily' | 'weekly';

export enum TemplateTypeEnum {
	DAILY = 'daily',
	WEEKLY = 'weekly'
}

export type SubredditReportData = {
	name: string;
	bestTimes: DailyRecord[];
	subscribers: number;
	category: string;
};

export type GenerateDailyReportHtmlParams = {
	templateType: TemplateTypeEnum.DAILY;
	timezone: TimeZone;
	hourFormatter: (d: Date) => string;
	notificationEmail: string;
	subreddits: SubredditReportData[];
	date: string; // For daily template
};

export type GenerateWeeklyReportHtmlParams = {
	templateType: TemplateTypeEnum.WEEKLY;
	hourFormatter: (d: Date) => string;
	notificationEmail: string;
	subreddits: SubredditReportData[];
	dateRange: {
		start: string;
		end: string;
	}; // For weekly template
};

// discriminated union type for the template types
export type GenerateReportHtmlParams =
	| GenerateDailyReportHtmlParams
	| GenerateWeeklyReportHtmlParams;
