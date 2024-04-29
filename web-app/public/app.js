window.onload = loadImages;

window.loadImagesByLabel = loadImagesByLabel;

window.upload = async function() {
    let fileInput = document.getElementById('file-input');
    for (let file of fileInput.files) {
        let url = URL.createObjectURL(file);

        let formData = new FormData();
        formData.append('image', file);

        let response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            console.error(`Upload failed with status ${response.status}`);
            return;
        }

        loadImages();
    }

    fileInput.value = '';
};

window.removeAll = async function() {
    await fetch('/api/deleteAll', { method: 'DELETE' });
    loadImages();
}

async function loadImages() {
    let images = await fetch('/api/images').then(res => res.json());

    let imagesDiv = document.getElementById("images");
    while (imagesDiv.firstChild) {
        imagesDiv.removeChild(imagesDiv.firstChild);
    }

    if (images.length === 0) {
        let message = document.createElement("h3");
        message.style.textAlign = "center";
        message.innerText = "No images found";
        imagesDiv.appendChild(message);
    } else {
        for (let image of images){
            if (image.id && image.url) {
                addImageElement(image.id, image.url);
            }
        }
    }
};

async function loadImagesByLabel(label) {
    let images = await fetch(`/api/images/search?label=${label}`).then(res => res.json());

    let imagesDiv = document.getElementById("images");
    while (imagesDiv.firstChild) {
        imagesDiv.removeChild(imagesDiv.firstChild);
    }

    if (images.length === 0) {
        let message = document.createElement("h3");
        message.style.textAlign = "center";
        message.innerText = "No images found for the specified label";
        imagesDiv.appendChild(message);
    } else {
        for (let image of images){
            addImageElement(image.id, image.url);
        }
    }
}

function addImageElement(id, imageUrl) {
    let img = document.createElement("img");

    img.onload = function () {
        img.style.height = "200px";
        img.style.width = "auto";
        document.getElementById("images").appendChild(img);
    };

    img.onclick = async function () {
        var modal = new bootstrap.Modal(document.getElementById('imageModal'));
        document.getElementById('modalImage').src = imageUrl;

        document.getElementById('modalImage').dataset.id = id;

        let tags = await fetch(`/api/images/${id}/tags`).then(res => res.json());
        document.getElementById('imageTags').innerHTML = "Tags: " + tags.join(', ');

        modal.show()
    };

    img.src = imageUrl;
    img.alt = 'Image';

    document.getElementById("images").appendChild(img);

    img.style.cursor = 'pointer';
}

async function deleteImage(id) {
    const response = await fetch(`/api/delete/${id}`, { method: 'DELETE' });

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
