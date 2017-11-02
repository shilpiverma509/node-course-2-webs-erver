//load express
const express = require('express');
const hbs = require('hbs'); //handlebar
const fs = require('fs');

//app runs on heroku and locally
const port = process.env.PORT || 3000;
var app = express(); //creates an express aplication

hbs.registerPartials(__dirname + '/views/partials');

//tell express what is our view engine: handlebars
app.set('view engine','hbs');

//next is to tell express that when  your middleware function is done.
app.use((req,res,next)=>{
    var now = new Date().toString();
    //creating a middleware to track thelog of our server
    var log=`${now}: ${req.method}${req.url}`;
    console.log(log);
    //to print it to the file
    fs.appendFile('server.log',log + '\n', (err)=>{
        if(err){
            console.log("unable to append to server.log");
            
        }
    });
    next(); //this is important for asynchronous, handlrs for each req will never fire 
});

// //middleware for maintainance
// app.use((req,res,next)=>{
//     res.render('maintenance.hbs');
// });
//register views folder:  
app.use(express.static(__dirname+'/public'));
//important when your project is within a subfolder
//app.set('views', __dirname + '/views');


//helper function
hbs.registerHelper('getCurrentYear',()=>{
   return new Date().getFullYear();
   //return 'test'; whatever you return from here will be displayed on webpage
});


hbs.registerHelper('screamIt',(text)=>{
    return text.toUpperCase();
});
//set up a handlr for an http get request
//first parameteer is the url, 2nd is the function about what to send back
//to user who made the request

// app.get('/',(req,res)=>{
//     //res.send('<h1>Hello Express</h1>');
//     res.send({
//         name:"Shilpi",
//         likes:[
//             "walking",
//             "Biking"
//         ]
//     });
// });


app.get('/',(req,res)=>{
    res.render('home.hbs',{
        pageTitle: 'Home Page',
        //currentYear: new Date().getFullYear(),
        welcomeMessage:"Welcome to my website" 
    });
});
// app.get('/about',(req,res)=>{
//     res.send('About  page');
// });

// app.get('/about',(req,res)=>{
//     res.render('about.hbs');
// })

// to make the about page and footer dynamic, pass in the data
app.get('/about',(req,res)=>{
    //pass in the data here as a 2nd argument
     res.render('about.hbs',{
        pageTitle: 'About Page',
        //currentYear: new Date().getFullYear()
     });
});


app.get('/bad',(req,res)=>{
    res.send({
        err:"Unable to fulfill this request"
    });
});

//static server
// app.listen(3000,()=>{
//     console.log('server is up on port 3000');
// });

// for heroku we need to make it Dynamic because the port will
// change as we deploy our app

app.listen(port, () => {
    console.log('server is up on port ${port}');
});