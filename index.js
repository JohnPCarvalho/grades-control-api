import express from 'express';
import gradesRouter from './routes/grades.js';

const port = 3000;

const app = express();
app.use(express.json());

app.use("/grades", gradesRouter)

app.listen(port, async () => {
    console.log("listening at port number: " + port);
});