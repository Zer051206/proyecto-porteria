import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.status(200).send('Bienvenido a la App de gestión de portería.')
});

export default router;