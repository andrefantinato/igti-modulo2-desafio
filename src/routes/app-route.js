'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controller/app-controller');

router.get('/', controller.get);
router.get('/:id', controller.get);

router.post('/nota', controller.getNota);
router.post('/media', controller.getMedia);
router.post('/ranking', controller.getRanking);

router.post('/', controller.post);
router.put('/', controller.update);
router.delete('/', controller.delete);

module.exports = router;
