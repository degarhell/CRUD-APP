import express from "express";
import pg from "pg";
import {} from "dotenv/config";
import cors from "cors"
import bodyParser from "body-parser";


const port= 8080;
const app= express();

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

const db = new pg.Client({
    host: `${process.env.DB_HOST}`,
    port: `${process.env.DB_PORT}`,
    database: `${process.env.DB_DATABASE}`,
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
})

db.connect();

app.get("/users",async (req, res) => {
    try {
        await db.query("select * from users order by id asc", (err, results) => {
            res.status(200).json(results.rows);
        });
    } catch (error) {
        console.log(error);
    }
})

app.post("/users", async (req, res) => {
    try {
        const result = req.body;
        await db.query("insert into users (name, email) values ($1, $2) returning id", [result.name, result.email], (err ,response) => {
            if (err) {
                console.log(err.stack);
            } else {          
                res.status(201).send(`user submited under id of: ${response.rows}`)
                console.log(response.rows);
            }
        });
        
    } catch (error) {
        console.log(error);
    }
})

app.put("/user/:id", async (req,res) => {
    try {
        const result = req.body;
        await db.query("update users set name=$1, email=$2 where id=$3 returning *", [result.name, result.email, result.id], (err, response) => {
            if (err) {
                console.log(err);
            } else {             
            res.status(202).send(`edited user data: ${response.rows}`)
            }
        })
    } catch (error) {
       console.log(error); 
    }
})

app.delete("/user/:id", async (req, res) => {
    const id= req.params.id;
    console.log(id);
    try {
        await db.query("delete from users where id=$1", [id], (err) => {
            if (err) {
                console.log(err);
            } else {
                res.status(204).send(`deleted user with id: ${id}`);
            }
        })
    } catch (error) {
        console.log(error);
    }
})

app.listen(port, () => {
    console.log(`app working on port ${port}`);
})

