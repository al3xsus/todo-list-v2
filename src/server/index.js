require('dotenv').config({path: '.env.local'});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const epilogue = require('epilogue');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(async (req, res, next) => {
    try {
        next();
    } catch (error) {
        next(error.message);
    }
});

const database = new Sequelize({
    dialect: 'sqlite',
    storage: './to-do-list.sqlite',
});

const Task = database.define('tasks', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    importance: Sequelize.TEXT,
    todo_date: Sequelize.DATE,
    done: Sequelize.BOOLEAN,
    done_date: Sequelize.DATE
});

epilogue.initialize({app, sequelize: database});

epilogue.resource({
    model: Task,
    endpoints: ['/tasks', '/tasks/:id'],
});

const port = process.env.SERVER_PORT || 3001;

database.sync().then(() => {
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
});
