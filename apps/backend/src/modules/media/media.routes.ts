import { Router } from 'express';
import multer from 'multer';
import { MediaController } from './media.controller';
import { AuthMiddleware } from '../../middleware/auth';
import { RBACMiddleware } from '../../middleware/rbac';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf', 'text/plain'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  },
});

const router = Router();
router.use(AuthMiddleware.authenticate);
router.use(RBACMiddleware.isAdmin);

router.post('/upload', upload.single('file'), MediaController.upload);
router.post('/upload-multiple', upload.array('files', 10), MediaController.uploadMultiple);
router.get('/', MediaController.list);
router.delete('/:id', MediaController.delete);

export { router as mediaRoutes };