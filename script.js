const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const paletteContainer = document.getElementById('palette');

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
        img.src = e.target.result;
    }

    img.onload = () => {
        const maxSize = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
            if (width > maxSize) {
                height = Math.round((height * maxSize) / width);
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width = Math.round((width * maxSize) / height);
                height = maxSize;
            }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height);
        const colors = getDominantColors(imageData, 4);

        displayPalette(colors);
    };

    reader.readAsDataURL(file);
});

function getDominantColors(imageData, count) {
    const data = imageData.data;
    const colorMap = new Map();

    for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha < 128) continue;

        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const key = `${Math.round(r / 32) * 32},${Math.round(g / 32) * 32},${Math.round(b / 32) * 32}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }

    const sortedColors = [...colorMap.entries()].sort((a, b) => b[1] - a[1]);

    const topColors = sortedColors.slice(0, count).map(c => c[0]);

    while (topColors.length < count) {
        topColors.push('0,0,0');
    }

    return topColors.map(rgbToHex);
}

function rgbToHex(rgbStr) {
    const [r, g, b] = rgbStr.split(',').map(Number);
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function displayPalette(colors) {
    paletteContainer.innerHTML = '';

    colors.forEach((color) => {
        const swatch = document.createElement('div');
        swatch.classList.add('color-swatch');
        swatch.style.backgroundColor = color;

        const hexLabel = document.createElement('div');
        hexLabel.classList.add('color-hex');
        hexLabel.textContent = color.toUpperCase();

        swatch.appendChild(hexLabel);
        paletteContainer.appendChild(swatch);

        swatch.addEventListener('click', () => {
            navigator.clipboard.writeText(color).then(() => {
                alert(`Copied ${color} to clipboard!`);
            });
        });
    });
}