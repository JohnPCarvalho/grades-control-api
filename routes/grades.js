import express from "express";
const router = express.Router();
import { promises as fs } from 'fs';
const { writeFile, readFile } = fs;

//const fileRead = readFile("./grades.json");

function newGradeObject(student, subject, type, value) {
  return new Object
  ({
      id: 500,
      student: student,
      subject: subject,
      type: type,
      value: value,
      timestamp: new Date()
  })
}

router.post("/newgrade", (req, res) => {
  const { student, subject, type, value } = req.body;
  newGradeObject();
  console.log(newGradeObject(student, subject, type, value));
  res.end();
})

export default router;