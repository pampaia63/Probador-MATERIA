
async function cargarModelosFaceAPI() {
  await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/');
  await faceapi.nets.faceLandmark68TinyNet.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/');
}
cargarModelosFaceAPI();

async function detectarYSuperponerAnteojos(imagenUsuario, modeloAnteojoURL) {
  const detecciones = await faceapi.detectSingleFace(imagenUsuario, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true);
  if (!detecciones) {
    alert('No se detectó un rostro válido. Usá una foto bien iluminada y de frente.');
    return null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = imagenUsuario.width;
  canvas.height = imagenUsuario.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(imagenUsuario, 0, 0);

  const landmarks = detecciones.landmarks;
  const ojoIzq = landmarks.getLeftEye();
  const ojoDer = landmarks.getRightEye();

  const xOjos = (ojoIzq[0].x + ojoDer[3].x) / 2;
  const yOjos = (ojoIzq[0].y + ojoDer[3].y) / 2;
  const anchoLentes = Math.abs(ojoDer[3].x - ojoIzq[0].x) * 2.1;

  const imgLentes = new Image();
  imgLentes.src = modeloAnteojoURL;
  await new Promise((res) => imgLentes.onload = res);

  ctx.drawImage(imgLentes, xOjos - anchoLentes / 2, yOjos - anchoLentes * 0.25, anchoLentes, anchoLentes * 0.4);

  return canvas.toDataURL('image/png');
}

async function iniciarPruebaVirtual() {
  const archivo = document.getElementById('inputImagen').files[0];
  if (!archivo) return alert('Subí una imagen primero.');
  const modeloURL = document.getElementById('selectorModelo').value;

  const img = new Image();
  img.src = URL.createObjectURL(archivo);
  await new Promise((res) => img.onload = res);

  const resultado = await detectarYSuperponerAnteojos(img, modeloURL);
  if (resultado) {
    document.getElementById('preview').innerHTML = `<img src="${resultado}" style="max-width:100%;">`;
  }
}
