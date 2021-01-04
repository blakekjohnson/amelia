const { ipcRenderer } = require('electron');

const imgEl = document.getElementById('current-img');

var files = [];
var currentImage = 0;
var timer = 0;

ipcRenderer.send('files');

ipcRenderer.on('files', (event, incomingFiles) => {
	incomingFiles.forEach((file) => {
		files.push(file);
	});
	updateImage();
	setInterval(imageCarousel, 100);
});

const updateImage = () => {
	if (currentImage >= files.length || currentImage < 0) {
		imgEl.src = 'placeholder.png';
		return;
	}

	imgEl.src = `file://${files[currentImage]}`;
};

const imageCarousel = () => {
	timer++;

	if (timer === 50) {
		timer = 0;
		nextImage();
	}
};

const nextImage = () => {
	currentImage++;
	if (currentImage >= files.length) currentImage = 0;
	timer = 0;
	updateImage();
};

const previousImage = () => {
	currentImage--;
	if (currentImage < 0) currentImage = files.length - 1;
	timer = 0;
	updateImage();
};

document.getElementById('next').addEventListener('click', nextImage);
document.getElementById('previous').addEventListener('click', previousImage);
