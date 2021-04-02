import express from "express";
import { promises as fs } from 'fs';
import { send } from "process";

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

router.put("/updategrade/:id", async (req, res) => {
  const { id: currentId } = req.params;
  const { student, subject, type, value } = req.body;
  try {
    const data = JSON.parse(await readFile(global.__filename));
    const foundUser = data.grades.find(grade => grade.id == currentId);
    if (foundUser === undefined) {
      res.status(404).end();
    } 
    foundUser.student   = student;
    foundUser.subject   = subject;
    foundUser.type      = type;
    foundUser.value     = value;
    foundUser.timestamp = new Date();
    await writeFile(global.__filename, JSON.stringify(data));
    res.send(foundUser);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
  res.end();
})

router.delete("/deletegrade/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = JSON.parse(await readFile(global.__filename));
    const foundUser = data.grades.find(grade => grade.id == id);
    if (foundUser == undefined) {
      res.status(404).send({error: "Invalid code"}).end();
    }

    data.grades = data.grades.filter(
      grade => grade.id !== parseInt(id));
  
    await writeFile(global.__filename, JSON.stringify(data));
    res.end();
  } catch (err) {
    res.status(400).send({error: err.message});
  }
})

export default router;