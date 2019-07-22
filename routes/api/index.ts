import * as express from 'express';
import drivers from './drivers';
import cars from './cars';
import trips from './trips';
import penalties from './penalties';

const router = express.Router();

router.get('/', function(req, res) {
    res.send({ title: 'Express' });
});

router.use('/drivers', drivers);
router.use('/cars', cars);
router.use('/trips', trips);
router.use('/penalties', penalties);

// Export the routerz
export default router;
