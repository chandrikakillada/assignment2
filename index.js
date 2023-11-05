// Import required Node.js modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const util = require('util');
const hbs = require('express-handlebars');

// Create an instance of the Express application
const app = express();

// Register a custom Handlebars helper
hbs.create({
    extname: '.hbs',
    helpers: {
      neq: function (a, b, options) {
        return a !== b ? options.fn(this) : options.inverse(this);
      },
      setRowColor: function (rating) {
        return rating === 'zero' ? 'zero-rating' : 'default-rating';
      },
    }
  });
  
// Configure the Handlebars engine for rendering views with a '.hbs' extension
app.engine('.hbs', hbs.engine);
app.set('view engine', 'hbs');

// Set the port for the server to listen on, defaulting to 3000 if not provided via environment variable
const port = process.env.port || 3000;

// Serve static files (e.g., stylesheets, scripts) from the 'public' directory using Express middleware
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for the root path ('/')
app.get('/', (req, res) => {
  // Render the 'home' view using the 'main' layout and pass the 'navbar' content
  res.render('page/home', { title: 'Welcome' });
});


// Set the default view engine to 'hbs' (Handlebars)

// // Define a route for the root path ('/')

// app.get('/', function(req, res) {
//     res.render('partials/index', {
//       title: 'Express',
//       layout: 'main' // Set the layout to 'main'
//     });
//   });
  
app.get('/', (req, res) => {
    // Render the 'home' view using the 'main' layout and pass the 'navbar' content
    res.render('page/home', { title: "Welcome" });
  });
  

app.get('/about', function (req, res) {
    // Render the 'about' view using the 'main' layout
    res.render('page/resume', { title: 'About Me' });
});
  

app.get('/data/invoiceNo/:id', (req, res) => {
    const id = parseInt(req.params.id);
  
    fs.readFile('ite5315-A1-Car_sales.json', 'utf-8', (err, dt) => {
      if (err) {
        console.log('Error reading file');
        res.status(500).send('Error reading file');
        return;
      }
      const data = JSON.parse(dt);
  
      if (id >= 0 && id < data.carSales.length) {
        const invoiceNo = data.carSales[id].InvoiceNo;
        res.render('page/invoice', { id, invoiceNo, title: 'Invoice Details' });
      } else {
        res.status(404).render('error', {
          title: 'Uh oh! Error :/',
          message: 'Record not found',
        });
      }
    });
  });


app.get('/search/invoiceNo', (req, res) => {
    res.render('page/search-result', { title: 'Invoice Number Search Results' })
    
});



// Create the urlencodedParser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/search/invoiceNo', urlencodedParser, (req, res) => {
    fs.readFile('ite5315-A1-Car_sales.json', 'utf-8', (err, dt) => {
      if (err) {
        console.log('Error reading file');
        res.status(500).send('Error reading file');
        return;
      }
  
      const invoiceNum = req.body.invoiceNum;
      const data = JSON.parse(dt);
  
      // Find the car sale data with the provided InvoiceNo
      const matchingSale = data.carSales.find((sale) => sale.InvoiceNo === invoiceNum);
  
      if (matchingSale) {
        // If a match is found, render the 'search-result' view with the matching sale details
        res.render('page/invoiceNo', { matchingSale, title: 'Car Sale Details' });
      } else {
        // If no match is found, render the 'error' view with an error message
        res.render('partials/error', {
          title: 'Uh oh! Error :/',
          message: 'Invoice number not found',
        });
      }
    });
  });
  

app.get('/search/manufacturer', (req, res) => {
    res.render('page/search-man', { title: 'Manufacturer Search Results' });
});

app.post('/search/Manufacturer', (req, res) => {
    const manufacturer = req.body.manufacturer;

    fs.readFile('ite5315-A1-Car_sales.json', 'utf-8', (err, data) => {
        if (err) {
            console.log('Error reading file');
            res.status(500).send('Error reading file');
            return;
        }
        const jsonData = JSON.parse(data);
        // Filter the data based on the manufacturer name
        const filteredData = jsonData.carSales.filter(car => car.Manufacturer === manufacturer);

        // Render the "man-results" view and pass the filtered data to it
        res.render('page/man-results', { manufacturerName: manufacturer, data: filteredData });
    });
});


  


const readFile = util.promisify(fs.readFile);

// Function to preprocess JSON data
function preprocessData(data) {
    return data.map(item => {
        const preprocessedItem = {};
        for (const key in item) {
            preprocessedItem[key.replace(/ /g, '_')] = item[key];
        }
        return preprocessedItem;
    });
}

// Set the view engine to 'hbs'
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

  
  

const handlebars = hbs.create({
    helpers: {
      safePropertyAccess(obj, propertyName) {
        // Access the property safely
        return obj[propertyName];
      },
    },
  });
//step 7
app.get('/viewData', async (req, res) => {
    try {
        // Read your JSON data and store it in the salesData variable
        const jsonData = await readFile('SuperSales.json', 'utf-8');
        const salesData = JSON.parse(jsonData);
        const preprocessedData = preprocessData(salesData);

        res.render('page/viewData', { salesData: preprocessedData });
    } catch (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Error reading JSON file');
    }
});


app.get('/filteredData', async (req, res) => {
    
    try {
        // Read your JSON data and store it in the salesData variable
        const jsonData = await readFile('SuperSales.json', 'utf-8');
        const salesData = JSON.parse(jsonData);

        // Filter out invoices with a rating of zero
        const preprocessedData = preprocessData(salesData).filter(item => item.Rating !== 0);

        res.render('page/viewData', { salesData: preprocessedData });
    } catch (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Error reading JSON file');
    }
});



// Custom Handlebars helper to check equality
app.engine(
    'hbs',
    exphbs.engine({
      extname: '.hbs',
      helpers: {
        // Custom Handlebars helper
        formatRating: function (value) {
          return value === 0 ? 'zero' : value;
        },
      },
    })
  );
  
  app.set('view engine', 'hbs');
  
 // step 9
 app.get('/viewData/step9', async (req, res) => {
    try {
        // Read your JSON data and store it in the salesData variable
        const jsonData = await readFile('SuperSales.json', 'utf-8');
        const salesData = JSON.parse(jsonData);

        // Create a new property 'rowColor' for each sales record based on the 'Rating' value
        const preprocessedData = preprocessData(salesData).map(item => ({
            ...item,
            rowColor: item.Rating === 0 ? 'zero-rating' : 'default-rating'
        }));

        res.render('page/highlight', { salesData: preprocessedData });
    } catch (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Error reading JSON file');
    }
});


// Define a route for '/users'
app.get('/users', function(req, res) {
  // Send a simple text response
  res.send('respond with a resource');
});

// Define a catch-all route to handle unspecified routes
app.get('*', function(req, res) {
  // Render the 'error' view located in the 'partials' folder and provide a title and message
  res.render('partials/error', { title: 'Error', message: 'Wrong Route' });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


/********************************************************************************** 
 * ITE5315 – Assignment 2* I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * * No part of this assignment has been copied manually or electronically from any other source* (including web sites) or distributed to other students.
 * ** Name: killada chandrika venu
 *  Student ID: N01536668 
 * Date: 3rd november
 * **********************************************************************************/