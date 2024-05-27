require('dotenv').config();

const nock = require('nock');
const fs = require('fs');
const nodeFetch = require('node-fetch');
const FormData = require('form-data');

const baseURL = process.env.APP_URL;

console.log('===============================');
console.log('APP_URL:', process.env.APP_URL);
console.log('===============================');

const file = fs.createReadStream('./test_image.png');

const mockImages = [
  { id: "1", url: `${baseURL}/image1.jpg` },
  { id: "2", url: `${baseURL}/image2.jpg` }
];

test('POST /api/upload', async () => {
    let formData = new FormData();
    formData.append('image', file);

    nock(baseURL)
        .post('/api/upload')
        .reply(200);

    const response = await nodeFetch(`${baseURL}/api/upload`, {
        method: 'POST',
        body: formData
    });

    expect(response.status).toBe(200);
});

test('GET /api/images', async () => {
    nock(baseURL)
        .get('/api/images')
        .reply(200, mockImages);

    const response = await nodeFetch(`${baseURL}/api/images`);
    const images = await response.json();

    expect(images).toEqual(mockImages);
});

test('DELETE /api/deleteAll', async () => {
    nock(baseURL)
        .delete('/api/deleteAll')
        .reply(200);

    const response = await nodeFetch(`${baseURL}/api/deleteAll`, { method: 'DELETE' });

    expect(response.status).toBe(200);
});

test('DELETE /api/delete/:id', async () => {
    const id = "1";

    nock(baseURL)
        .delete(`/api/delete/${id}`)
        .reply(200);

    const response = await nodeFetch(`${baseURL}/api/delete/${id}`, { method: 'DELETE' });

    expect(response.status).toBe(200);
});

test('GET /api/images/search?label=:label', async () => {
    const label = 'test'
    const mockImageWithLabel = [
      { id: "1", url: `${baseURL}/image1.jpg` }
    ];

    nock(baseURL)
        .get(`/api/images/search?label=${label}`)
        .reply(200, mockImageWithLabel);

    const response = await nodeFetch(`${baseURL}/api/images/search?label=${label}`);
    const images = await response.json();

    expect(images).toEqual(mockImageWithLabel);
});
