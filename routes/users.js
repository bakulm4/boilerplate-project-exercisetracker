const express = require('express');

const {createUser,addExercise,getExerciseLog} = require('../controllers/users');
const router = express.Router();

router.post('/',createUser);
router.post('/:userId/exercises',addExercise);
router.get('/:userId/logs',getExerciseLog);

module.exports = router;