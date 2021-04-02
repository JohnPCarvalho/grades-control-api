import express from "express";
import { promises as fs } from 'fs';

const { writeFile, readFile } = fs;

const router = express.Router();

router.post("/newgrade", async (req, res) => {
  try {
    let grade = req.body;
    //Lê o arquivo json com as notas e faz o parse para JSON
    const data = JSON.parse(await readFile(global.__filename));
    //cria o novo objeto a ser inserido, onde id é baseado no dado de dentro do arquivo lido acima
    grade = { id: data.nextId++, ...grade, timestamp: new Date()};
    data.grades.push(grade);
    
    await writeFile(global.__filename, JSON.stringify(data));

    res.send(grade);
  } catch (err) {
    res.status(400).send({error: err.message});
  }
});

export default router;