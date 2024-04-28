window.onload = loadImages;

window.loadImagesByLabel = loadImagesByLabel;

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

window.removeAll = async function() {
    await fetch('/api/deleteAll', { method: 'DELETE' });
    loadImages();
}

async function loadImages() {
    let imageUrls = await fetch('/api/images').then(res => res.json());

    let imagesDiv = document.getElementById("images");
    while (imagesDiv.firstChild) {
        imagesDiv.removeChild(imagesDiv.firstChild);
    }

    if (imageUrls.length === 0) {
        let message = document.createElement("h3");
        message.style.textAlign = "center";
        message.innerText = "No images found";
        imagesDiv.appendChild(message);
    } else {
        for (let imageUrl of imageUrls){
            addImageElement(imageUrl);
        }
    }
};

async function loadImagesByLabel(label) {
    let imageUrls = await fetch(`/api/images/search?label=${label}`).then(res => res.json());

    let imagesDiv = document.getElementById("images");
    while (imagesDiv.firstChild) {
        imagesDiv.removeChild(imagesDiv.firstChild);
    }

    if (imageUrls.length === 0) {
        let message = document.createElement("h3");
        message.style.textAlign = "center";
        message.innerText = "No images found for the specified label";
        imagesDiv.appendChild(message);
    } else {
        for (let imageUrl of imageUrls){
            addImageElement(imageUrl);
        }
    }
}

function addImageElement(imageUrl) {
    let img = document.createElement("img");

    img.onload = function () {
        img.style.height = "200px";
        img.style.width = "auto";
        document.getElementById("images").appendChild(img);
    };

    img.onclick = function () {
        var modal = new bootstrap.Modal(document.getElementById('imageModal'));
        document.getElementById('modalImage').src = imageUrl;
        modal.show()
    };

    img.src = imageUrl;
    img.alt = 'Image';

    document.getElementById("images").appendChild(img);

    img.style.cursor = 'pointer';
}

async function deleteImage(imageUrl) {
    const response = await fetch(`/api/delete/${encodeURIComponent(imageUrl)}`, { method: 'DELETE' });

    if (!response.ok) {
        console.error('Image deletion failed: ', response);
    } else {
        location.reload();
    }
}

document.querySelector('#label-input')
    .addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            window.loadImagesByLabel(document.querySelector('#label-input').value);
        }
});
