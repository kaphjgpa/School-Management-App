const express = require("express");

const router = express.Router();
const zod = require("zod");
const { Class } = require("../models/Class");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const signupBody = zod.object({
  className: zod.string(),
  year: zod.number().integer(),
  teacher: zod.string(),
  studentfees: zod.number().positive(),
  // studentLists: zod.number().positive
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

  const createclass = await Class.create({
    className: req.body.className,
    year: req.body.year,
    teacher: req.body.teacher,
    studentFees: req.body.studentFees,
    // studentLists: req.body.studentLists
  });

  const createclassId = class_id;

  const token = jwt.sign(
    {
      userId,
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
