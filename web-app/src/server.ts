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

app.use(async (req, res, next) => {
    await imageService.initialize();
    next();
});

app.get('/api/images', async (req: Request, res: Response) => {
    let images = await imageService.getAll();
    res.json(images);
});

app.get('/api/images/search', async (req: Request, res: Response) => {
    const label = req.query.label;

    if (typeof label !== 'string') {
        res.status(400).json({
            message: "Invalid label query parameter provided."
        });
        return;
    }

    const images = await imageService.search(label);
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

app.delete('/api/delete/:imageUrl', async (req: Request, res: Response) => {
    const imageUrl = req.params.imageUrl;

    try {
        await imageService.delete(imageUrl);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting image' });
    }
});

app.delete('/api/deleteAll', (req, res) => {
    imageService.deleteAll().then(() => res.sendStatus(200));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
