const jwt = require('jsonwebtoken');
const connection = require('../data/connection');

module.exports = {
    
    generate(user) {
        return jwt.sign(user, process.env.TOKEN_SKEY, { expiresIn: '5m'});
    },

    verify(req, res, next) {
        const acessToken = req.cookies.acessToken;
        if (!acessToken) return res.json({ message: "No session token provided."})

        jwt.verify(acessToken, process.env.TOKEN_SKEY, 
            (err, user) => {
                if (err) return res.status(403).send();
                req.user = user;
                next();
        });
    },

    async refresh(req, res){
        const user = req.body;
        const requestToken = req.cookies.refreshToken;
        const refreshTokens = await connection('users')
        .where('email', user['email'])
        .select('reftoken');

        refreshTokens.forEach(refreshToken => {
            if (refreshToken['reftoken'] == requestToken) {
                const newToken = jwt.sign(user, process.env.TOKEN_SKEY, { expiresIn: '5m'})
                res.cookie("acessToken", newToken, { httpOnly: true });
                return res.status(204).send()
            }
        })
    }
}