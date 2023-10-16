import rfs from 'rotating-file-stream';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(path.dirname(__filename));

export const accessLogStream = rfs.createStream('access.log', {
    size: "10M", // rotate every 10 MegaBytes written
    interval: '1d', // rotate daily
    compress: "gzip", // compress rotated files
    path: path.join(__dirname, 'log')
})