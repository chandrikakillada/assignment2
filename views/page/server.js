const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const fs=require('fs');


const navbar = `
    <style>
        nav {
            width: 25%;
           
            padding: 10px;
            border-radius: 10px;
        }

        ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }

        li {
            margin-bottom: 10px;
        }

        a {
            text-decoration: none;
            color: #333;
            display: block;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #e8d8d8;
        }

        a:hover {
            background-color:#6c2d2d;
            color: white;
        }
    </style>
    <nav>
        <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/data">Data</a></li>
            <li><a href="/search/invoiceNo">Search by Invoice</a></li>
            <li><a href="/search/Manufacturer">Search by Manufacturer</a></li>
        </ul>
    </nav>
`;


// step 2
app.get('/', (req, res) => {
    res.send(`<h1>Welcome to Chandrika's Board</h2>${navbar}`);
});

// Define a route for the "/about" path that serves the resume HTML file
app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/resume.html');
});


//step 5
app.get('/data', (req, res) => {
    
    fs.readFile('ite5315-A1-Car_sales.json','utf-8',(err,data)=>{
        if(err){
            console.log('Error reading file');
            res.status(500).send('Error reading file')
            return;
        }
        console.log(data);
        res.status(200).send(` <h1>JSON data is loaded and ready!</h1>
         <div class="home">
        <a href="/">Home</a>
    </div>
    <style>
    a {
        background-color: #8a5656;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 16px;
      
        cursor: pointer;
        text-decoration: none;
        margin-left: 1rem;

    }
    a:hover {
        background-color: #6c2d2d;
        color: white;
    }
    </style>`);

    })
   
});
//step 5
app.get('/data/invoiceNo/:id', (req, res) => {
    const id = parseInt(req.params.id); 
    
    fs.readFile('ite5315-A1-Car_sales.json','utf-8',(err,dt)=>{
        if(err){
            console.log('Error reading file');
            res.status(500).send('Error reading file')
            return;
        }
        const data = JSON.parse(dt)
        if (id >= 0 && id < data.carSales.length) {
            const invoiceNo = data.carSales[id].InvoiceNo;
            res.send(`  <div class="invoice-card">
            <h3 class="invoice-header">Invoice number for index ${id} : ${invoiceNo}</h3>
          </div>`);
        } else {
            res.status(404).send(`<div class='container'><h3>Uh oh! Error :/ </h3><p>Record not found</p> <div class="home">
            <a href="/">OK</a>
            </div></div>
           
            <style>
            body{
                margin-top: 5rem;
        
            }
            .home {
                text-align: end;
                /* margin-bottom: 5rem; */
                padding: 25px;
            }
            .container {
               
                max-width: 700px;
                margin: 20px auto; 
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
            }
        
            h3{
                color: white;
                background: #c51d1d;
                padding: 1rem;
            }
            p{
                color:black;
                padding: 1rem;
                font-size: 1.25rem;
                padding-bottom: 0;
            }
            a {
                background-color: #f4f4f4;
                color: dimgrey;
                border: 1px solid;
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
                text-decoration: none;
                margin-left: 31rem;
                padding: 7px;
                border-radius: 6px;
                padding-right: 10px;
                padding-left: 10px;
            }
            a:hover {
                background-color: grey;
                color: black;
            }
            </style>`);
        }
    })
   
});

//step 6

app.get('/search/invoiceNo', (req, res) => {
    res.sendFile(__dirname + '/invoiceNo.html');
     
});

app.post('/search/invoiceNo', urlencodedParser, (req, res) => {
    console.log('Form loaded');
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
            // If a match is found, display the car sale details in a card-like format
            res.send(`
            <div class="home">
        <a href="/">Home</a>
    </div>
    
            <div class="card">
            <h1>Car Sale Details</h1>
            <div class="card-content">
                <p class='info'><strong>Invoice Number:</strong> ${matchingSale.InvoiceNo}</p>
                <p class='info'><strong>Manufacturer:</strong> ${matchingSale.Manufacturer}</p>
                <p class='info'><strong>Model:</strong> ${matchingSale.Model}</p>
                <p class='info'><strong>Sales (in thousands):</strong> ${matchingSale.Sales_in_thousands}</p>
                <p class='info'><strong>Year Resale Value:</strong> ${matchingSale.__year_resale_value}</p>
                <p class='info'><strong>Vehicle Type:</strong> ${matchingSale.Vehicle_type}</p>
                <p class='info'><strong>Price (in thousands):</strong> ${matchingSale.Price_in_thousands}</p>
                <p class='info'><strong>Engine Size:</strong> ${matchingSale.Engine_size}</p>
                <p class='info'><strong>Horsepower:</strong> ${matchingSale.Horsepower}</p>
                <p class='info'><strong>Wheelbase:</strong> ${matchingSale.Wheelbase}</p>
                <p class='info'><strong>Width:</strong> ${matchingSale.Width}</p>
                <p class='info'><strong>Length:</strong> ${matchingSale.Length}</p>
                <p class='info'><strong>Curb Weight:</strong> ${matchingSale.Curb_weight}</p>
                <p class='info'><strong>Fuel Capacity:</strong> ${matchingSale.Fuel_capacity}</p>
                <p class='info'><strong>Fuel Efficiency:</strong> ${matchingSale.Fuel_efficiency}</p>
                <p class='info'><strong>Latest Launch:</strong> ${matchingSale.Latest_Launch}</p>
                <p class='info'><strong>Power Performance Factor:</strong> ${matchingSale.Power_perf_factor}</p>
            </div>
        </div>

        
        <style>
            body {
                background: #ffe4d5;
                padding:1rem;
            }
            .card {
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                padding: 20px;
                max-width: 400px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
            }
        
            .card-content {
                margin-top: 15px;
            }
        
            h1 {
                font-size: 24px;
                color: #333;
                margin-bottom: 15px;
            }
        
         
            .info {
                margin: 10px 0;
                padding: 5px;
            }
           
        
            .info:nth-child(even) {
                background-color: #ffeeee;
            }

           
            .info:nth-child(odd) {
                background-color: #915151;
                color: #ffe4e4;
            }
           
            a {
                  background-color: #8a5656;
                 color: white;
                border: none;
                padding: 10px 20px;
                 font-size: 16px;
                 cursor: pointer;
                 text-decoration: none;
                 margin-left: 31rem;

    }
    a:hover {
        background-color: #6c2d2d;
        color: white;
    }
    
        </style>
        
            `);
        } else {
            // If no match is found, display an error message
            res.send(`
            <div class='container'><h3>Uh oh! Error :/ </h3><p>Invoice number not found</p> <div class="home">
    <a href="/">OK</a>
    </div></div>
   
    <style>
    body{
        margin-top: 5rem;

    }
    .home {
        text-align: end;
        /* margin-bottom: 5rem; */
        padding: 25px;
    }
    .container {
       
        max-width: 700px;
        margin: 20px auto; 
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    }

    h3{
        color: white;
        background: #c51d1d;
        padding: 1rem;
    }
    p{
        color:black;
        padding: 1rem;
        font-size: 1.25rem;
        padding-bottom: 0;
    }
    a {
        background-color: #f4f4f4;
        color: dimgrey;
        border: 1px solid;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        text-decoration: none;
        margin-left: 31rem;
        padding: 7px;
        border-radius: 6px;
        padding-right: 10px;
        padding-left: 10px;
    }
    a:hover {
        background-color: grey;
        color: black;
    }
    </style>`)
           
        }
    });
});


app.get('/search/Manufacturer', (req, res) => {
    res.sendFile(__dirname + '/manufacturer.html');
});


app.post('/search/Manufacturer', urlencodedParser, (req, res) => {
    console.log('Form loaded');
   
    fs.readFile('ite5315-A1-Car_sales.json', 'utf-8', (err, dt) => {
        if (err) {
            console.log('Error reading file');
            res.status(500).send('Error reading file');
            return;
        }
        const data = JSON.parse(dt);

        const manufacturer = req.body.manufacturer;
        console.log(manufacturer);

        // Filter car records based on the manufacturer
        const carRecords = data.carSales.filter((block) => block.Manufacturer.toLowerCase().includes(manufacturer.toLowerCase()));

        if (carRecords.length === 0) {
            res.send(`
            <div class='container'><h3>Uh oh! Error :/ </h3><p>No matching car records found</p> <div class="home">
            <a href="/">OK</a>
            </div></div>
           
            <style>
            body{
                margin-top: 5rem;
        
            }
            .home {
                text-align: end;
                /* margin-bottom: 5rem; */
                padding: 25px;
            }
            .container {
               
                max-width: 800px;
                margin: 20px auto; 
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
            }
        
            h3{
                color: white;
                background: #c51d1d;
                padding: 1rem;
            }
            p{
                color:black;
                padding: 1rem;
                font-size: 1.25rem;
                padding-bottom: 0;
            }
            a {
                background-color: #f4f4f4;
                color: dimgrey;
                border: 1px solid;
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
                text-decoration: none;
                margin-left: 31rem;
                padding: 7px;
                border-radius: 6px;
                padding-right: 10px;
                padding-left: 10px;
            }
            a:hover {
                background-color: grey;
                color: black;
            }
            </style>
            `);
        } else {
            
            const cards = carRecords.map((record) => `
                <div class="card">
                    <h2>${record.Manufacturer}</h2>
                    <p>InvoiceNo: ${record.InvoiceNo}</p>
                    <p>Model: ${record.Model}</p>
                    <!-- Add more fields here as needed -->
                </div>
            `).join('');

            res.send( `
            <div class="container">
    <h1>Manufacturer Search Results</h1>
    <div class="result">
        <h3>Matching car records:</h3>
        ${cards}
    </div>
</div>

<style>
    body {
        background-color: #f2f2f2;
       
        font-family: sans-serif;
        margin: 0;
        padding: 0;
    }

    .container {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    }

    h1 {
        text-align: center;
        color: #333;
    }

    .result {
        text-align: center;
        background-color: #b57f79;
        color: #fff;
        padding: 20px;
        border-radius: 10px;
        margin-top: 20px;
    }

    .card {
        border: 1px solid #ccc;
        padding: 20px;
        margin: 20px 0;
        border-radius: 10px;
        background-color: #f0e4e4;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    }

    .card h2 {
        margin: 0;
        font-size: 1.5rem;
        color: #333;
    }

    p {
        margin: 10px 0;
        color: #555;
    }
</style>

            `);
        }
    });
});



app.get("*",(req,res)=>{
    res.status(404).send(`<div class='container'><h3>Uh oh! Error :/ </h3><p>404 Page not found!</p> <div class="home">
    <a href="/">OK</a>
    </div></div>
   
    <style>
    body{
        margin-top: 5rem;

    }
    .home {
        text-align: end;
        /* margin-bottom: 5rem; */
        padding: 25px;
    }
    .container {
       
        max-width: 700px;
        margin: 20px auto; 
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    }

    h3{
        color: white;
        background: #c51d1d;
        padding: 1rem;
    }
    p{
        color:black;
        padding: 1rem;
        font-size: 1.25rem;
        padding-bottom: 0;
    }
    a {
        background-color: #f4f4f4;
        color: dimgrey;
        border: 1px solid;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        text-decoration: none;
        margin-left: 31rem;
        padding: 7px;
        border-radius: 6px;
        padding-right: 10px;
        padding-left: 10px;
    }
    a:hover {
        background-color: grey;
        color: black;
    }
    </style>`)
})

const port = 5500;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
/**********************************************************************************
 *  ITE5315 – Assignment 1* I declare that this assignment is my own work in accordance with Humber Academic Policy.* No part of this assignment has been copied manually or electronically from any other source* (including web sites) or distributed to other students.** 
 * Name: Killada Chandrika Venu 
 * Student ID: N01536668    
 *  Date: 3rd october 2023
 * **********************************************************************************/