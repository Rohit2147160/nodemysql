const express = require("express");
var cors = require("cors");
const fs = require("fs");
var mysql = require('mysql2');

// connecting to database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'flight_management'
});
connection.connect((err) => {
  if (err) { console.log("DB Connection Failed."); return }

  // Initializing Express Server
  const app = express();
  app.use(cors());

  //Routes/Apis
  app.use("/readFile", async (req, res) => {
    res.end(await fs.readFileSync("./data.json"))
  });
  

  // display
  app.get("/flights", (req, res) => {
    connection.query("SELECT * FROM flight;", (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

  // search
  app.get("/flights/:flightNo", (req, res) => {
    if (!req.params.flightNo) {
      res.json({ error: "Id required" })
      return
    }
    var fno = req.params.flightNo
    connection.query("SELECT * FROM flight WHERE flightNo = " + fno, (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

  // // add
  app.get("/newFlight", (req, res) => {
    if (!req.query.flightNo) {
      res.json({ error: "Flight No required" })
      return
    }

    if(!req.query.source){
      res.json({error: "Source required"})
      return
    }
    if(!req.query.destination){
      res.json({error: "Destination required"})
      return
    }
    if (!req.query.fare) {
      res.json({ error: "Fare required" })
      return
    }
    if(!req.query.noofseats){
      res.json({error:"No of seats left is required"})
      return
    }
    if(!req.query.airlineName){
      res.json({error:"Airline name required"})
      return
    }

    connection.query(`INSERT INTO flight(flightNo,source,destination,fare,noofseats,airlineName) ` +
      `VALUES(${req.query.flightNo},'${req.query.source}','${req.query.destination}','${req.query.fare}','${req.query.noofseats}','${req.query.airlineName}')`,
      (err, results, fields) => {
        if (err) return res.json({ error: err.message })
        res.json(results)
      })
  })

  // // update
  app.get("/updateFlight", (req, res) => {
    if (!req.query.flightNo) {
      res.json({ error: "flightNo" })
      return
    }
    if (!req.query.fare) {
      res.json({ error: "Fare required" })
      return
    }
    var flightNo = req.query.flightNo
    var fare = req.query.fare
    connection.query(`UPDATE flight SET fare = '${fare}' WHERE flightNo = ${flightNo}`, (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

  // delete
  app.get("/deleteFlight", (req, res) => {
    if (!req.query.flightNo) {
      res.json({ error: "Flight No required" })
      return
    }

    var fno = req.query.flightNo
    connection.query(`DELETE FROM flight WHERE flightNo = ${fno}`, (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })


  //Port
  const port = 8000;

  //Starting a server
  app.listen(port, () => {
    console.log(`*** SERVER STARTED AT PORT ${port} ***`);
  });

})