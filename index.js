const PORT = process.env.PORT || 5000;// получаем из перемен окружения если не задано то 5000
const Application = require('./framework/Application');
const parseJson = require('./framework/parseJson');
const parseUrl = require('./framework/parseUrl');

const filmRouter = require('./routes/filmRouter');
const genreRouter = require('./routes/genreRouter');

const app = new Application()

app.use(parseJson);
app.use(parseUrl('http://localhost: ${PORT}'));
app.addRouter(filmRouter);
app.addRouter(genreRouter);

app.listen(PORT, () => console.log(`Server started on PORT  ${PORT} `))