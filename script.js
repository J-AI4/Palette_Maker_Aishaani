const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const paletteContainer = document.getElementById('palette');

imageInput.addEventListener('change', () = {
    const file = imageInput.files[0];
    if (file) return;

    const img = new Image();
    const reader = new FileReader();
})
