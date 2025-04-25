import { TimeFormat } from '$lib/constants';

export function formatTime(hour: number, timeFormat: TimeFormat): string {
	if (timeFormat === TimeFormat.H24) {
		return `${hour.toString().padStart(2, '0')}:00`;
	} else {
		const period = hour < 12 ? 'AM' : 'PM';
		const displayHour = hour % 12 === 0 ? 12 : hour % 12;
		return `${displayHour}:00 ${period}`;
	}
}

export function formatHour(hour: number, timeFormat: TimeFormat): string {
	if (timeFormat === TimeFormat.H24) {
		return `${hour.toString().padStart(2, '0')}h`;
	} else {
		const period = hour < 12 ? 'AM' : 'PM';
		const displayHour = hour % 12 === 0 ? 12 : hour % 12;
		return `${displayHour}${period}`;
	}
}

export function formatTimeFromString(
	timeString: string,
	timeFormat: TimeFormat
): string {
	const [hours, minutes] = timeString.split(':').map(Number);

	if (timeFormat === TimeFormat.H24) {
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
	} else {
		const period = hours < 12 ? 'AM' : 'PM';
		const displayHour = hours % 12 === 0 ? 12 : hours % 12;
		return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
	}
}
