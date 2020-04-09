const connection = require('../data/connection');
const crypto = require('crypto');

module.exports = {
    async index(request, response) {
        const list = await connection('meetings').select('*');
        return response.json(list);
    },
    async create(request, response) {
        const id = crypto.randomBytes(6).toString('hex');
        const { title, description, location, start, end } = request.body;

        try {
            await connection('meetings').insert({
                id: id,
                title: title,
                description: description,
                location: location,
                start: start,
                end: end
            });

            response.sendStatus(204);
        } catch(err) {
            response.json({ message: 'An error ocurred while the server was creating your meeting.' })
        }
    },
    async delete(request, response) {
        const { id } = request.params;

        try{
            connection('meetings')
                    .where('id', id)
                    .del();

            return response.sendStatus(204);
        } catch(err) {
            return response.json({ message: 'An error ocurred while the server was deleting your meeting.' });
        }
    }
}