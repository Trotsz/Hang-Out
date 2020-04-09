const connection = require('../data/connection');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

module.exports = {
    
    //Users list
    async index(req, res) {
        const users = await connection('users').select('name', 'location', 'points');
        return res.json(users);
    },

    //Creates user
    async create(req, res) {
        const { name, bio, email, password, location } = req.body;
        const id = crypto.randomBytes(4).toString('HEX');

        try {
            bcrypt.hash(password, 10, async (err, hash) => {
                    
                if (err) 
                   return res.json({ message: "Something went wrong. Try again" })

                const emailExists = await connection('users')
                                       .where('email', email)
                                       .select('email')
                                       .first();
                                             
                if (emailExists)
                    return res.json({ message: "Email already registered" });

                await connection('users').insert({
                    id,
                    name,
                    bio,
                    email,
                    'password': hash,
                    location
                });
    
                return res.json({ email, password })
            })
        } catch (e) {
            return res.json({ error: "Fail. Verify your connection and try again." });
        }   
    },

    //Delete user
    async delete(req, res) {
        const { id } = req.params;
        try {
            await connection('users')
                     .where('id', id)
                     .delete();
            
            return res.sendStatus(204);
        } catch (e) {
            return res.json({ error: "A error occurred while the server was deleting your account. Try again"})
        }
    },
}