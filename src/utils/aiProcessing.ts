import { pipeline } from '@huggingface/transformers';
import { extractFieldsFromText } from './ocrUtils';

interface ImageToTextResult {
  generated_text: string;
}

export const processImageWithAI = async (imageData: string) => {
  try {
    const recognizer = await pipeline(
      'image-to-text',
      'Xenova/vit-gpt2-image-captioning',
      { device: 'webgpu' }
    );
    
    const result = await recognizer(imageData);
    let fullText = '';
    
    if (Array.isArray(result)) {
      (result as ImageToTextResult[]).forEach(item => {
        fullText += item.generated_text + '\n';
      });
    } else {
      const singleResult = result as ImageToTextResult;
      fullText += singleResult.generated_text + '\n';
    }
    
    console.log('AI processed text:', fullText);
    return fullText;
  } catch (error) {
    console.error('AI processing error:', error);
    throw error;
  }
};

export const processAndExtractFields = async (imageData: string) => {
  const text = await processImageWithAI(imageData);
  return extractFieldsFromText(text);
};