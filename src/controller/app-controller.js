'use strict';

const { appendFile, writeFile, readFile } = require('fs').promises;

exports.get = async (req, res, next) => {
  const id = req.params.id;
  const grades = JSON.parse(await getFile());

  const grade = grades.grades.filter((g) => {
    return g.id == id;
  });

  res.status(200).send(grade);
};
exports.getNota = async (req, res, next) => {
  const student = req.body.student;
  const subject = req.body.subject;
  const grades = JSON.parse(await getFile());

  const nota = grades.grades.reduce((acc, curr) => {
    if (curr.subject == subject && curr.student == student) {
      acc += curr.value;
    }
    return acc;
  }, 0);

  res.send({
    nome: student,
    subject: subject,
    nota: nota,
  });
};
exports.getMedia = async (req, res, next) => {
  const type = req.body.type;
  const subject = req.body.subject;
  const grades = JSON.parse(await getFile());

  const total = grades.grades.filter(
    (g) => g.subject == subject && g.type == type
  );
  const nota = grades.grades.reduce((acc, curr) => {
    if (curr.subject == subject && curr.type == type) {
      acc += curr.value;
    }
    return acc;
  }, 0);
  const media = nota / total.length;

  res.send({
    nome: type,
    subject: subject,
    media: media,
  });
};
exports.getRanking = async (req, res, next) => {
  const subject = req.body.subject;
  const type = req.body.type;
  const grades = JSON.parse(await getFile());

  const ranking = grades.grades.filter(
    (g) => g.subject == subject && g.type == type
  );
  ranking.sort((a, b) => b.value - a.value);

  res.send(ranking.slice(0, 3));
};
exports.post = async (req, res, next) => {
  const newGrade = {
    student: req.body.student,
    subject: req.body.subject,
    type: req.body.type,
    value: req.body.value,
    timestamp: new Date(),
  };

  const grades = JSON.parse(await getFile());
  let nextId = grades.nextId;
  newGrade.id = ++nextId;

  grades.grades.push(newGrade);
  grades.nextId = newGrade.id;

  const result = await writeFile(
    './dataset/grades.json',
    JSON.stringify(grades),
    (err) => {
      if (err) return false;
      else return true;
    }
  );

  res.status(200).send(newGrade);
};
exports.update = async (req, res, next) => {
  const id = req.body.id;
  const updateGrade = {
    student: req.body.student,
    subject: req.body.subject,
    type: req.body.type,
    value: req.body.value,
    timestamp: new Date(),
  };

  const grades = JSON.parse(await getFile());

  const item = grades.grades.filter((g) => g.id === id);

  if (item.length <= 0) {
    res.status(200).send({
      message: 'Grade não encontrada',
    });
  }

  grades.grades = grades.grades.map((g) => {
    if (g.id == id) {
      updateGrade.id = g.id;
      g = updateGrade;
    }
    return g;
  });

  const result = await writeFile(
    './dataset/grades.json',
    JSON.stringify(grades),
    (err) => {
      if (err) return false;
      else return true;
    }
  );

  res.status(200).send(updateGrade);
};
exports.delete = async (req, res, next) => {
  const id = req.body.id;

  const grades = JSON.parse(await getFile());

  grades.grades = grades.grades.filter((g) => g.id !== id);

  await writeFile('./dataset/grades.json', JSON.stringify(grades), (err) => {
    if (err) return false;
    else return true;
  });

  res.status(200).send({
    message: 'Excluído com sucesso',
  });
};

async function getFile() {
  return await readFile('./dataset/grades.json', 'utf8', (err, data) => {
    if (err) console.log(err);
    return data;
  });
}
