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

router.get("/getgrade/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = JSON.parse(await readFile(global.__filename), 2, null);

    const foundUser = data.grades.find(grade => grade.id == id);
    if (foundUser == undefined) {
      res.status(404).send({error: "Id does not exist"});
    }
    res.send(foundUser);

  } catch (err) {
    res.status(400).send({message: err});
  }
  
});

router.get("/gettotalgrade", async (req, res) => {
  try {
    const grade = req.body;
    const data = JSON.parse(await readFile(global.__filename));

    const student = data.grades.filter(student => student.student === grade.student);
    const result = student.filter(students => students.subject === grade.subject);
    const values = result.map(item => {
      return item.value;
    })

    let total = 0;
    for (let i = 0; i < values.length; i++) {
      total += values[i];
    }

    res.send({Total: total, ...student});
    }catch (err) {
    res.status(400).send({error: err.message});
  }
})

export default router;