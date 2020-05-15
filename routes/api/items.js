const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

//Item Model

const Item = require('../../models/Item');

//@route GET api/items
//@desc Get All Items
//@access Public

router.get('/', (req, res) => {
    Item.find()
        .sort({ date: -1 })
        .then(items => res.json(items))
});

//@route GET api/items
//@desc Create A Item
//@access Private

router.post('/', auth, (req, res) => {
    const newItem = new Item({
        name: req.body.name
    });
    newItem.save().then(item => res.json(item));
});

//@route GET api/items/:id
//@desc Get One Item
//@access Public

/* router.get('/:id', (req, res) => {
    Item.findById(req.params.id)
        .then(item => res.json(item))
        .catch(err => res.status(404).json({ msg: "El elemento no existe" }));
}); */

//@route DELETE api/items/:id
//@desc Delete A Item
//@access Private

router.delete('/:id', auth, (req, res) => {

    Item.findById(req.params.id)
        .then(item => item.remove()
            .then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ msg: "El elemento ya no existe" }));

});

//@route PUT api/items/:id
//@desc Delete A Item
//@access Private

router.put('/:id', auth, (req, res) => {
    var placeId = req.params.id;
    var params = req.body;
    Item.findById(placeId)
        .then(item => item.updateOne(params)
            .then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ msg: "El elemento no existe" }));

});

module.exports = router;