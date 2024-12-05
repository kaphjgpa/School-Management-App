const express = require("express");
const router = express.Router();
const zod = require("zod");
const { Class } = require("../models/Class");

const addClassBody = zod.object({
  className: zod.string(),
  time: zod.number(),
  teacherName: zod.string(),
  maxStudents: zod.number().integer(),
  studentfees: zod.number().positive(),
  year: zod.number().integer(),
  // studentLists: zod.number().positive(),
});

router.post("/createclass", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "class already exists",
    });
  }
  const existingClass = await Class.findOne({
    className: req.body.className,
  });
  if (existingClass) {
    return res.status(411).json({
      message: "class already exists",
    });
  }

  const createClass = await Class.create({
    className: req.body.className,
    time: req.body.time,
    teacherName: req.body.teacher,
    maxStudents: req.body.maxStudents,
    studentFees: req.body.studentFees,
    year: req.body.year,
  });

  const createclassId = class_id;

  const token = jwt.sign(
    {
      createclassId,
    },
    JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token: token,
  });
});
//

module.exports = router;
