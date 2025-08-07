export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

export const filesToBase64 = async (files: File[]): Promise<string[]> => {
  const base64Promises = files.map(file => fileToBase64(file));
  return Promise.all(base64Promises);
};