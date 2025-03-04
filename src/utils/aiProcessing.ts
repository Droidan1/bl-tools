
import { pipeline } from '@huggingface/transformers';
import { extractFieldsFromText } from './ocrUtils';

interface ImageToTextResult {
  generated_text: string;
}

// Process a single image with AI model
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

// Process an image with multiple image processing settings
export const processAndExtractFields = async (imageData: string) => {
  try {
    // We'll create variations of the image with different processing for better results
    const imageVariations = await createImageVariations(imageData);
    
    // Process each variation and collect results
    const results = await Promise.all(
      imageVariations.map(async (imgData) => {
        try {
          const text = await processImageWithAI(imgData);
          const fields = extractFieldsFromText(text);
          return { text, fields };
        } catch (error) {
          console.error('Error processing image variation:', error);
          return { text: '', fields: {} };
        }
      })
    );
    
    // Merge the results to get the best data
    return mergeExtractedFields(results.map(r => r.fields));
  } catch (error) {
    console.error('Error in multi-processing:', error);
    // Fallback to single image processing
    const text = await processImageWithAI(imageData);
    return extractFieldsFromText(text);
  }
};

// Create variations of the image with different processing settings
const createImageVariations = async (imageData: string): Promise<string[]> => {
  const variations: string[] = [imageData]; // Original image
  
  try {
    const img = new Image();
    img.src = imageData;
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return variations;
    
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Create high contrast variation
    ctx.filter = 'brightness(110%) contrast(130%)';
    ctx.drawImage(img, 0, 0);
    variations.push(canvas.toDataURL('image/jpeg', 0.95));
    
    // Create sharp, balanced variation
    ctx.filter = 'brightness(105%) contrast(120%) saturate(90%)';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    variations.push(canvas.toDataURL('image/jpeg', 0.95));
    
    // Create grayscale variation (sometimes better for OCR)
    ctx.filter = 'grayscale(100%) brightness(110%) contrast(120%)';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    variations.push(canvas.toDataURL('image/jpeg', 0.95));
    
    return variations;
  } catch (error) {
    console.error('Error creating image variations:', error);
    return variations; // Return at least the original image
  }
};

// Merge results from multiple processed images
const mergeExtractedFields = (fieldsArray: Array<{
  sapNumber?: string;
  barcode?: string;
  storeLocation?: string;
  bolNumber?: string;
  quantity?: number;
}>) => {
  const stringFieldNames = ['sapNumber', 'barcode', 'storeLocation', 'bolNumber'] as const;
  type StringFieldName = typeof stringFieldNames[number];
  
  const result: {
    sapNumber?: string;
    barcode?: string;
    storeLocation?: string;
    bolNumber?: string;
    quantity?: number;
  } = {};
  
  // Handle string fields
  for (const fieldName of stringFieldNames) {
    const values = fieldsArray
      .map(fields => fields[fieldName])
      .filter((val): val is string => val !== undefined && val !== '');
    
    if (values.length > 0) {
      // Use the most common value or the first one
      const valueCounts = values.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mostCommonValue = Object.entries(valueCounts)
        .sort((a, b) => b[1] - a[1])[0][0];
      
      result[fieldName] = mostCommonValue;
    }
  }
  
  // Handle quantity field separately since it's a number
  const quantities = fieldsArray
    .map(fields => fields.quantity)
    .filter((val): val is number => val !== undefined);
  
  if (quantities.length > 0) {
    // Use the most common quantity or the median
    const sortedQuantities = [...quantities].sort((a, b) => a - b);
    const medianIndex = Math.floor(sortedQuantities.length / 2);
    result.quantity = sortedQuantities[medianIndex];
  }
  
  return result;
};
