import express from "express";
import { createCar, getAllCars, updateCar, deleteCar,getCarDetails } from "../controllers/carController.js";
import { isAuthentication } from "../utils/authentication.js";

const router = express.Router();

router.route("/create").post(isAuthentication, createCar);
router.route("/details/:id").get(getCarDetails);
router.route("/update/:id").put(isAuthentication, updateCar);
router.route("/delete/:id").delete(isAuthentication, deleteCar);
router.route("/all").get(getAllCars);

export default router;