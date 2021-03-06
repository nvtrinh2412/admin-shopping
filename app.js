const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars')
const paginateHelper = require('express-handlebars-paginate')
const methodOverride = require('method-override');

const indexRouter = require('./routes/index');
const productsRouter = require('./routes/products')
const revenueRouter = require('./routes/revenue')
const accountsRouter = require('./routes/accounts')


const app = express();


// view engine setup
app.engine('hbs', exphbs({
	extname: 'hbs',
	defaultLayout: 'layout',
	layoutsDir: path.join(__dirname, '/views/layouts'),
	partialsDir: path.join(__dirname, '/views/partials'),
	helpers: {
		'pages': function(n,search_name,block) {
			var accum = '';
			for(var i = 1; i < n+1; ++i)
				accum += block.fn({index:i,search_name:search_name});
			return accum;
		}
	}
}))
app.set('view engine', 'hbs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));


app.use('/', indexRouter)
app.use('/products', productsRouter)
app.use('/revenue', revenueRouter)
app.use('/accounts', accountsRouter)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});
module.exports = app;
