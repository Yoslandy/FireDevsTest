const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jsonwt = require("jsonwebtoken");
//User Model

const User = require('../../models/User');

//@route GET api/users/allUsers
//@desc Get All Users
//@access Private

router.get('/', (req, res) => {
    User.find()
        .sort({ register_date: -1 })
        .then(users => res.json(users))
});

//@route GET api/users/search/:search
//@desc Get Users by search
//@access Private

router.get('/search/:search', (req, res) => {
    var searchString = req.params.search;
    User.find({
        "$or": [
            { "name": { "$regex": searchString, "$options": "i" } },
            { "email": { "$regex": searchString, "$options": "i" } },
        ]
    })
        .exec((err, users) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al cargar los usuarios"
                });
            }
            if (!users || users.length <= 0) {
                return res.status(200).send({
                    status: "success",
                    message: "No existen usuarios para esta busqueda",
                    users: []
                });
            }
            return res.status(200).send({
                status: 'success',
                users
            });
        });
});

//@route PUT api/users/:id
//@desc Update A User
//@access Private
//Update User just to change admin state and active state

router.put('/:id', (req, res) => {
    var userId = req.params.id;
    var params = req.body;
    User.findById(userId)
        .then(user => user.updateOne(params)
            .then(() => res.json({ success: true, user: user })))
        .catch(err => res.status(404).json({ msg: "El elemento no existe" }));

});


//@route POST api/users
//@desc Register new user
//@access Public
//Registrar Usuario

router.post('/', (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' })
    }

    User.findOne({ email })
        .then(user => {
            if (user) return res.status(400).json({ msg: 'The Email already exists' });
            const newUser = new User({
                name,
                email,
                password,
                admin: false,
                active: true
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {

                            jsonwt.sign(
                                { id: user.id },
                                config.get('jwtSecret'),
                                { expiresIn: 3600 },
                                (err, token) => {
                                    if (err) throw err;
                                    res.json({
                                        token,
                                        user: {
                                            id: user.id,
                                            name: user.name,
                                            email: user.email,
                                            admin: user.admin,
                                            active: user.active
                                        }
                                    })
                                }
                            )
                        });
                });
            });
        })

});



module.exports = router;