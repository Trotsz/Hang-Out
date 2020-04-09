const connection = require('../data/connection')

module.exports = {
    async index(req, res) {
        const profile = await connection('users')
        .select("name", "id", "email", "points", );
        return res.json(profile)
    },

    async update(req, res) {
        const { name, id, email, bio, interests, picture } = req.body;
        try {
            await connection('users')
                     .where('id', id)
                     .update({
                         name,
                         email,
                         bio,
                         interests,
                         picture
                     })

            return res.json({ message: "Profile updated successfully"})
        } catch (e) {
            return res.json({ error: "Something went wrong while updating your profile. Try again"})
        }
    } 
}