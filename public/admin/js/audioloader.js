
function LoadAudio(path) {
  // Створюємо новий об'єкт AudioContext
  const audioContext = new AudioContext();

  // Асинхронно завантажуємо аудіофайл
  fetch(path)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      // Створюємо джерело звуку
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Підключаємо джерело до виходу
      source.connect(audioContext.destination);

      // Відтворюємо звук
      source.start();
    })
    .catch(error => console.error(error));
}