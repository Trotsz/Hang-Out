require('dotenv').config();

const jwt = require('jsonwebtoken');
const connection = require('../data/connection');
const bcrypt = require('bcrypt');
const tokenController = require('./tokensController');

module.exports = {
    //Starts sessions (login)
    async create(req, res) {
        try {
            const { email, password } = req.body;
            const user = await connection('users')
                .select('email', 'password')
                .where('email', email)
                .first();
            
            if (!user) return res.json({ message: "Email not registered." });

            bcrypt.compare(password, user['password'], async (err, match) => {
                if (err) return res.json({ 
                    message: "Something went wrong while verifying your account. Try again" 
                });

                if (!match) return res.json({ message: "Incorrect password "})

                const acessToken = tokenController.generate(user);
                const refreshToken = jwt.sign(user['email'], process.env.TOKEN_REFRESH + user['password'])
                
                res.cookie("acessToken", acessToken, { httpOnly: true })
                res.cookie("refreshToken", refreshToken, { httpOnly: true });
                await connection('users')
                      .where('email', user['email'])     
                      .update({
                         'reftoken': refreshToken
                       });
                       
                res.sendStatus(200);
                return;
        })

        } catch (e) {
            res.json("");
        }
    },
}