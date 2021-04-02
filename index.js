import express from 'express';
import gradesRouter from './routes/grades.js';
import { promises as fs } from "fs";
const {readFile, writeFile} = fs;

const app = express();
app.use(express.json());

const port = 3000;
global.__filename = 'grades.json';

app.use("/grades", gradesRouter)

app.listen(port, async () => {
    try {
        await readFile(global.__filename);
        console.log("Server is running...");
    } catch (err) {
        const initialJson = {
            nextId: 0,
            grades: []
        }
        writeFile(global.__filename, JSON.stringify(initialJson)).then(() => {
            console.log("Server is running and the file was created");
        }).catch(err => {
            console.log(err);
        });
    }
});