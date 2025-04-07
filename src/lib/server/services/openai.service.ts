import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

const prompt =
	'The image contains a list of bouldering grades with their respective colors.' +
	'Usually grades are from v0 to v15, but not always all of them have to be present.' +
	'Each grade has a color associated to it, and multiple grades can have the same color.' +
	'The colors are usually from white to black, but there are some exceptions.' +
	'The grades are sorted from the easiest to the hardest.' +
	'I need you to return me a list of tuples with the grade and the color associated to it.' +
	'YOU HAVE TO RETUN AN ARRAY, without any aditional information, just the array.' +
	'EXAMPLE_1:' +
	'*image with 4 grades, and 4 colors associated with each one of them*' +
	'RESULT_1:' +
	"[['v0', '#FFFFFF'], ['v1', '#EDD926'], ['v2', '#2FAD4A'], ['v3', '#343434']]";

export class OpenAIService {
	static async fileToBase64(file: File) {
		return await file.arrayBuffer().then((buffer) => {
			return Buffer.from(buffer).toString('base64');
		});
	}

	static async inferGradesFromBase64(image: string) {
		const response = await openai.chat.completions.create({
			model: 'gpt-4-turbo',
			messages: [
				{
					role: 'system',
					content: 'You are an expert at image analysis.'
				},
				{
					role: 'user',
					content: [
						{ type: 'text', text: prompt },
						{
							type: 'image_url',
							image_url: { url: `data:image/png;base64,${image}` }
						}
					]
				}
			],
			max_tokens: 100,
			temperature: 0.5,
			stop: ['\n']
		});

		const grades = response?.choices?.[0]?.message?.content || '[]';
		return grades;
	}
}
