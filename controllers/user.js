import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModal from "../models/users.js";

const secret = 'test';

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1h" });

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};


export const save = async (req, res) => {
  const { userId, code } = req.body

  try {
    const user = await UserModal.findById(userId)
    user.code = code
    await UserModal.findByIdAndUpdate(userId, user, { new: true })
    res.status(200).json(code)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
}

export const getCode = async (req, res) => {
  const { userId } = req.body

  try {
    const user = await UserModal.findById(userId)
    res.status(200).json(user.code)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
}