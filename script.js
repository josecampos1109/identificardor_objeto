let net;
let videoStream;

async function setupCamera() {
    const video = document.getElementById('video');
    videoStream = await navigator.mediaDevices.getUserMedia({
        video: true
    });
    video.srcObject = videoStream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function loadModel() {
    net = await mobilenet.load();
    console.log('Modelo cargado');
}

async function classifyVideo() {
    const video = document.getElementById('video');
    const resultElement = document.getElementById('result');

    const predictions = await net.classify(video);
    resultElement.innerText = `Predicción: ${predictions[0].className} - Confianza: ${predictions[0].probability.toFixed(2)}`;
}

function stopCamera() {
    const video = document.getElementById('video');
    video.srcObject.getTracks().forEach(track => track.stop());
    video.srcObject = null;
    document.getElementById('result').innerText = 'Cámara detenida.';
}

document.getElementById('classify-button').addEventListener('click', classifyVideo);
document.getElementById('stop-button').addEventListener('click', stopCamera);

async function main() {
    await loadModel();
    await setupCamera();
    console.log('Cámara lista');
}

main();

