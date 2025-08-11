const express = require('express');
const router = express.Router();
const Joi = require('joi');

const Task = require('../models/Task');
const auth = require('../middleware/auth');



const taskSchema = Joi.object({
    title: Joi.string().min(1).required(),
    description: Joi.string().allow(''),
    status: Joi.string().valid('pending', 'completed')
});


router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
});

 

router.post('/', auth, async (req, res) => {
    const { error } = taskSchema.validate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });

    const { title, description, status } = req.body;
    const task = new Task({ title, description, status, userId: req.user.id });

    await task.save();
res.json(task);
});


router.put('/:id', auth, async (req, res) => {

const { error } = taskSchema.validate(req.body);
if (error) return res.status(400).json({ msg: error.details[0].message });

  const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg:'not found'});
if (task.userId.toString() !== req.user.id){
    return res.status(403).json({ msg:'not authorized'});}

  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});



router.delete('/:id', auth, async (req, res) => {
const task = await Task.findById(req.params.id);
if (!task) return res.status(404).json({msg:'not found'});
if (task.userId.toString() !== req.user.id){
    return res.status(403).json({ msg:'not authorized'});}

await Task.findByIdAndDelete(req.params.id);
res.json({ msg:'task deleted'});
});

module.exports = router;