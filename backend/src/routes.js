const { celebrate, Segments, Joi } = require('celebrate');
const express = require('express')
const routes = express.Router();

const userController = require('./controllers/userController');
const sessionController = require('./controllers/sessionController');
// const profileController = require('./controllers/profileController');
const tokenController = require('./controllers/tokensController');

//Session routes
routes.post('/sessions', celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })
}), sessionController.create);

routes.post('/sessions/refresh', celebrate({
    [Segments.COOKIES]: Joi.object().keys({
        acessToken: Joi.string().required(),
        refreshToken: Joi.string().required()
    }),

    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
}), tokenController.verify, tokenController.refresh);

//Users routes
routes.get('/users', userController.index);

routes.post('/users', celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        bio: Joi.string(),
        picture: Joi.binary(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        location: Joi.string()
    })
}), userController.create);

routes.delete('/users/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required()
    })
}), tokenController.verify, userController.delete);

//Profile routes
// routes.get('/profile', tokenController.verify, profileController.index);
module.exports = routes;
