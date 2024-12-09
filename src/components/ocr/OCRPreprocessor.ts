export const preprocessImage = (canvas: HTMLCanvasElement, option: string): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  switch (option) {
    case 'grayscale':
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      }
      ctx.putImageData(imageData, 0, 0);
      break;
    case 'highContrast':
      ctx.filter = 'contrast(150%)';
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.filter = 'contrast(150%)';
        tempCtx.drawImage(canvas, 0, 0);
        ctx.drawImage(tempCanvas, 0, 0);
      }
      break;
    default:
      break;
  }
  return canvas;
};