import express, { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import ImageService from "./services/ImageService";

const app = express();
const upload = multer();
const imageService = new ImageService();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));
app.use('/dist', express.static(path.join(__dirname, '../dist')));

app.get('/api/images', async (req: Request, res: Response) => {
    await imageService.initialize();
    let images = await imageService.getAll();
    res.json(images);
});

app.post('/api/upload', upload.single('image'), async (req: Request, res: Response) => {
    let file = req.file;
    if (!file) {
        res.status(400).send('No file uploaded.');
        return;
    }
    await imageService.create(file);
    res.status(200).end();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});