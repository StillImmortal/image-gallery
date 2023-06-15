import { encode } from "blurhash"

// eslint-disable-next-line import/no-anonymous-default-export
const ctx: Worker = self as any

async function getBlurhashFromImage(file: File): Promise<any> {
  const image = await createImageBitmap(file); // Создаем объект изображения из файла
  const offscreen = new OffscreenCanvas(200, 200);
  const context = offscreen.getContext('2d');
  if (context) {
    context.drawImage(image, 0, 0, 200, 200); // Отрисовываем изображение на OffscreenCanvas
    const imageData = context.getImageData(0, 0, 200, 200); // Получаем данные пикселей изображения
    const blurhash = encode(imageData.data, 200, 200, 4, 4); // Создаем blurhash
    return blurhash;
  }
  throw new Error('Не удалось получить контекст OffscreenCanvas');
}

ctx.addEventListener("message", (event) => {
  const image = event.data as File
  getBlurhashFromImage(image).then((blurhash) => {
    postMessage(blurhash)
  })
})