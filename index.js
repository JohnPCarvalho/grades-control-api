import express from 'express';
import accountsRouter from './routes/accounts.js';
import { promises as fs } from "fs";
import { readFile, writeFile } from 'node:fs';

const app = express();
app.use(express.json());

app.use("/account", accountsRouter);

app.listen(3000, async () => {
    try {
        await readFile("accounts.json");
        console.log("Api started");
    } catch (err) {
        const initialJson = {
            nextId: 1,
            accounts: []
        }
        writeFile("accounts.json", JSON.stringify(initialJson)).then(() => {
            console.log("Api started and file created!");
        }).catch(err => {
            console.log(err);
        })
    }
    console.log("API started at " + 3000);
});