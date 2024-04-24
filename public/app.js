window.onload = loadImages;

window.upload = async function() {
    let fileInput = document.getElementById('file-input');
    for (let file of fileInput.files) {
        let url = URL.createObjectURL(file);
        addImageElement(url);

        let formData = new FormData();
        formData.append('image', file);
        await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        loadImages();
    }

    fileInput.value = '';
};

async function loadImages() {
    let imageUrls = await fetch('/api/images').then(res => res.json());

    let imagesDiv = document.getElementById("images");
    while (imagesDiv.firstChild) {
        imagesDiv.removeChild(imagesDiv.firstChild);
    }

    for (let imageUrl of imageUrls){
        addImageElement(imageUrl);
    }
};

function addImageElement(imageUrl) {
    let img = document.createElement("img");
    img.onload = function () {
        img.style.height = "200px";
        img.style.width = "auto";
        document.getElementById("images").appendChild(img);
    };
    img.src = imageUrl;
    img.alt = 'Image';
};
