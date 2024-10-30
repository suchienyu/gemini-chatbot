// app/api/translate/route.ts
import { OpenAIStream } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';
import { openaiModel } from '@/ai';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  try {
    const { text, targetLanguage } = await req.json();

    const prompt = `
      Translate the following text to ${targetLanguage}. 
      Keep any placeholders like {rate}, {time} unchanged.
      Only return the translated text without any additional context or explanation.
      
      Text: ${text}
    `;

    const response = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: "system",
          content: "You are a professional translator. Translate text while maintaining the original formatting and placeholders.",
        },
        {
          role: "user",
          content: prompt,
        }
      ],
      temperature: 0.3, // 較低的溫度以確保翻譯準確性
      stream: false,
    });

    const data = await response.json();
    const translation = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ translation }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Translation failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}