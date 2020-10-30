const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jsonwt = require("jsonwebtoken");
const auth = require('../../middleware/auth');
//User Model
const User = require('../../models/User');

//@route POST api/auth
//@desc Auth user
//@access Public
//loguearse

router.post('/', (req, res) => {
    const { name, password } = req.body
    if (!name || !password) {
        return res.status(400).json({ msg: 'Llene los campos' })
    }
    User.findOne({ name })
        .then(user => {
            if (!user) return res.status(400).json({ msg: 'El usuario no existe' });
            //si el usuario esta inactivo retornar el error
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' })
                    jsonwt.sign(
                        { id: user.id },
                        config.get('jwtSecret'),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    _id: user.id,
                                    name: user.name,
                                }
                            })
                        }
                    )
                })
        })

});

//@route GET api/auth/user
//@desc Get user data
//@access Private
//Obtener el usuario logueado

router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => {
            if (!user) return res.status(400).json({ msg: 'User Does not exists' });
            res.json(user);
        })

});

module.exports = router;