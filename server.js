import express from 'express';
import basicAuth from 'express-basic-auth';
import {serverConfig} from './utils/config.js';
import {router} from './routes/router.js';
import {mongoConnect} from './utils/mongoDb.js';

const {PORT, WEB_BENUTZERNAME, WEB_PASSWORT} = serverConfig;

const port = process.env.PORT || PORT;
const app = express();

app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(basicAuth({
    users:  {[WEB_BENUTZERNAME] : WEB_PASSWORT} ,
    unauthorizedResponse: getUnauthorizedResponse,
    challenge: true
}));

// befüllt ein body object für den einkommenden Requests
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

mongoConnect(() => {
    app.listen(port, function(){
        // console.log(`App is listening on port ${port}`);
    });
});

function getUnauthorizedResponse(req) {
    return req.auth
        ? ('Anmeldedaten ' + req.auth.user + ':' + req.auth.password + ' zurückgewiesen')
        : 'Keine Anmeldedaten angegeben.';
}