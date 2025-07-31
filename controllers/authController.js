import { hashPassword, comparePassword } from "../helper/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      department,
      batch,
      district,
      registrationNumber,
      nicNumber,
    } = req.body;

    // validations
    if (!firstName) return res.send({ message: "firstName is required" });
    if (!lastName) return res.send({ message: "lastName is required" });
    if (!phone) return res.send({ message: "phone is required" });
    if (!department) return res.send({ message: "department is required" });
    if (!batch) return res.send({ message: "batch is required" });
    if (!registrationNumber) {
      return res.send({ message: "registrationNumber is required" });
    }
    if (!nicNumber) return res.send({ message: "nicNumber is required" });
    if (!district) return res.send({ message: "district is required" });
    if (!email) return res.send({ message: "email is required" });
    if (!password) {
      return res.send({ message: "password is required" });
    }

    // check user
    const existingUser = await userModel.findOne({ email });
    //  existing user
    if (existingUser)
      return res.status(200).send({
        success: false,
        message: "User already registered. Please login.",
      });

    //  register user
    const hashedPassword = await hashPassword(password);
    // create user and save
    const user = await new userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      department,
      batch,
      registrationNumber,
      district,
      nicNumber,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invaild email or password",
      });
    }
    // check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    // token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.firstName + " " + user.lastName,
        email: user.email,
        phone: user.phone,
        department: user.department,
        batch: user.batch,
        registrationNumber: user.registrationNumber,
        district: user.district,
        nicNumber: user.nicNumber,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
