const { celebrate, Segments, Joi } = require('celebrate');
const express = require('express')
const routes = express.Router();

const groupController = require('./controllers/groupController');
const userController = require('./controllers/userController');
const sessionController = require('./controllers/sessionController');
const profileController = require('./controllers/profileController');
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

//groups routes
routes.get('/groups', groupController.index);
routes.post('/groups', celebrate({
    [Segments.COOKIES]: Joi.object().keys({
        acessToken: Joi.string().required(),
        refreshToken: Joi.string().required()
    }),
    
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        founder: Joi.string().required(),
        members: Joi.string().required(),
        platforms: Joi.array()
        .items(Joi.string()).min(1)
    })
}), tokenController.verify, groupController.create);

routes.delete('/groups', tokenController.verify, groupController.delete);

//Users routes
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

routes.get('/users', userController.index);

//Profile routes
routes.get('/profile', tokenController.verify, profileController.index);
module.exports = routes;
