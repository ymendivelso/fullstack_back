var express = require('express');
var app = express();
const { Pool } = require("pg");
const cors = require('cors');
var bodyParser = require('body-parser');

app.use(cors({credentials: true, origin: 'http://localhost:8080'}));

var jsonParser = bodyParser.json()


// CONEXIÓN A BASE DE DATOS POSTGRESQL
const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    database: "fullstack",
    password: 'yeinerm12'
});

app.post('/api/v1/team',jsonParser, function(req, res) {

  // NOMBRE DE LA TABLA
  let name_table="jugadores45";

  let team_name = req.body.Name;
  let page = req.body.Page;

  let response={page:page,totalPages:page,Items:'',totalItems:'',players:[]};

  let sql = "";
  if (team_name =="todos"){
    sql = `SELECT DISTINCT equipo FROM ${name_table};`;
  } else {
    sql = `SELECT nombre, posicion, nacionalidad FROM ${name_table} WHERE lower(equipo) like '%${team_name.toLowerCase()}%';`
  }  

  pool.query(sql, function(err, results) {
    //console.log(req.query.cpob);
    console.log(page);
    console.log(sql);
    if (err) {
      console.log(err);
      res.status(200).json("error");
      throw err
    } else {
      //res.status(200).json(results.rows)
      results.rows.forEach(e => {
        response.players.push(e);
      });
      let count=`SELECT COUNT(*) FROM ${name_table} WHERE lower(equipo) like '%${team_name.toLowerCase()}%'`;
      pool.query(count, function(err, result) {
        let items=result.rows[0].count;
        response['Items'] = items;
        response['totalItems'] = items;
        res.status(200).json(response);
      });
    }
  });
  // res.send({
  //   'team_name': team_name,
  //   'page': page
  // });
});

app.get('/api/v1/players', function(req, res){

    // NOMBRE DE LA TABLA
    let name_table="jugadores45";
    
    var name_part = req.query.search;
    var order = req.query.order;
    var page = req.query.page;

    console.log(name_part,order,page);
    
    let new_order="";
    if (order) {
        new_order = `ORDER BY nombre ${order.toUpperCase()}`
    } else {
        new_order = "ORDER BY nombre ASC";
    }

    let response={page:page,totalPages:page,Items:'',totalItems:'',players:[]};

    //var cpob = req.params.cpob;
    let sql = "";
    if (name_part=="todos"){
      sql = `SELECT * FROM ${name_table} ${new_order};`
    } else {
      sql = `SELECT * FROM ${name_table} WHERE lower(nombre) like '%${name_part.toLowerCase()}%' ${new_order};`
    }
     
    pool.query(sql, function(err, results) {
      //console.log(req.query.cpob);
      console.log(page);
      console.log(sql);
      if (err) {
        console.log(err);
        res.status(200).json("error");
        throw error
      } else {
        //res.status(200).json(results.rows)
        results.rows.forEach(e => {
          response.players.push(e);
        });
        let count=`SELECT COUNT(*) FROM ${name_table} WHERE lower(nombre) like '%${name_part.toLowerCase()}%'`;
        pool.query(count, function(err, result) {
          let items=result.rows[0].count;
          response['Items'] = items;
          response['totalItems'] = items;
          res.status(200).json(response);
        });
      }
    });
});

app.listen(3001, function () {
    console.log('listening on port 3001!');
});
