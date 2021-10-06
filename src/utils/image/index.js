// @flow
export const cropImage = (
  event: ?SyntheticEvent<any, any>,
  file: File,
  width: number,
  height: number,
  posX: number = 0,
  posY: number = 0,
  quality?: number,
  maxWidth?: number,
  maxHeight?: number
): Promise<[string, File]> => {
  return new Promise((res, rej) => {
    if (event) event.persist();
    var fileName = file.name.split('.')[0];
    const imageElement = new Image();
    imageElement.src = URL.createObjectURL(file);
    imageElement.onload = e => {
      const canvas = document.createElement('canvas');
      let scaleSizeHorizontal = 1;
      let scaleSizeVertical = 1;
      if (maxWidth && maxHeight) {
        scaleSizeHorizontal = maxWidth / width;
        scaleSizeVertical = maxHeight / height;
        if (width < maxWidth && height < maxHeight) {
          canvas.width = width;
          canvas.height = height;
          scaleSizeHorizontal = 1;
          scaleSizeVertical = 1;
        } else if (scaleSizeHorizontal > scaleSizeVertical) {
          canvas.width = width * scaleSizeVertical;
          canvas.height = maxHeight;
          scaleSizeHorizontal = 1;
        } else {
          canvas.width = maxWidth;
          canvas.height = height * scaleSizeHorizontal;
          scaleSizeVertical = 1;
        }
      } else {
        canvas.height = height;
        canvas.width = width;
      }

      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        imageElement, // image
        posX * scaleSizeHorizontal, // sourceImageX
        posY * scaleSizeVertical, // sourceImageY
        width, // sourceImageX
        height, // sourceImageY
        0, // destinationHeight
        0, // destinationHeight
        canvas.width, // destinationHeight
        canvas.height // destinationWidth
      );
      canvas.toBlob(
        blob => {
          const croppedFile = new File([blob], fileName + '.jpeg');
          res([canvas.toDataURL(), croppedFile]);
        },
        'image/jpeg',
        quality
      );
    };
  });
};

export const crop = (
  event: ?SyntheticEvent<any, any>,
  file: File,
  width: number,
  height: number
): Promise<[string, File]> => {
  return new Promise((res, rej) => {
    if (event) event.persist();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = readerEvent => {
      const target = readerEvent.target;
      const imageElement = document.createElement('img');
      imageElement.src = (target: any).result;
      imageElement.onload = e => {
        const canvas = document.createElement('canvas');
        const scaleSizeHorizontal = width / e.target.width;
        const scaleSizeVertical = height / e.target.height;
        if (e.target.width < width && e.target.height < height) {
          canvas.width = e.target.width;
          canvas.height = e.target.height;
        } else if (scaleSizeHorizontal > scaleSizeVertical) {
          canvas.width = e.target.width * scaleSizeVertical;
          canvas.height = height;
        } else {
          canvas.width = width;
          canvas.height = e.target.height * scaleSizeHorizontal;
        }
        /*canvas.width = e.target.width < width ? e.target.width : width;
          canvas.height =
            typeof height === 'number' ? height : e.target.height * scaleSize;*/
        // const newImage = new Image();
        const ctx = canvas.getContext('2d');
        ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
        // res(canvas.toDataURL());
        canvas.toBlob(blob => {
          const croppedFile = new File([blob], file.name);
          // const srcEncoded = ctx.canvas.toDataURL(e.target, file.type);
          res([canvas.toDataURL(), croppedFile]);
        }, file.type);
      };
    };
    reader.onerror = _ => {
      reader.abort();
      rej(new Error('There was an error compressing the image'));
    };
  });
};

export const compressImage = (
  event: ?SyntheticEvent<any, any>,
  file: File,
  quality: number,
  maxWidth?: number,
  maxHeight?: number
): Promise<[string, File]> => {
  return new Promise((res, rej) => {
    if (event) event.persist();
    var fileName = file.name.split('.')[0];
    const imageElement = new Image();
    imageElement.src = URL.createObjectURL(file);
    imageElement.onload = e => {
      const canvas = document.createElement('canvas');

      if (maxWidth && maxHeight) {
        const scaleSizeHorizontal = maxWidth / imageElement.width;
        const scaleSizeVertical = maxHeight / imageElement.height;
        if (imageElement.width < maxWidth && imageElement.height < maxHeight) {
          canvas.width = imageElement.width;
          canvas.height = imageElement.height;
        } else if (scaleSizeHorizontal > scaleSizeVertical) {
          canvas.width = imageElement.width * scaleSizeVertical;
          canvas.height = maxHeight;
        } else {
          canvas.width = maxWidth;
          canvas.height = imageElement.height * scaleSizeHorizontal;
        }
      } else {
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;
      }

      const ctx = canvas.getContext('2d');
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        blob => {
          const compressedFile = new File([blob], fileName + '.jpeg');
          res([canvas.toDataURL(), compressedFile]);
        },
        'image/jpeg',
        quality
      );
    };
  });
};

export const cropImageEvent = (
  event: SyntheticEvent<any, any>,
  width: number,
  height: number
): Promise<[string, File]> => {
  if (event.target instanceof HTMLInputElement) {
    const file = event.target.files[0];
    if (!file) return Promise.reject(new Error('No file was provided'));
    return crop(event, file, width, height);
  } else {
    return Promise.reject('Input was not a valid DOM element');
  }
};

export const cropImageFile = (
  file: File,
  width: number,
  height: number
): Promise<[string, File]> => {
  return crop(undefined, file, width, height);
};

export function getImage(
  url: string
): Promise<{image: Image, width: number, height: number}> {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = function() {
      resolve({image: img, width: this.width, height: this.height});
    };
    img.onerror = function() {
      reject();
    };
  });
}
