import Car from "../models/carModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../middlewares/error.js";
import cloudinary from "cloudinary";

// Create Car
export const createCar = TryCatch(async (req, res, next) => {
    try{
    const { title, description, tags, images } = req.body;

    if(images.length === 0){
        return next(new ErrorHandler("Please upload at least one image", 400));
    }
   
    let public_ids = [];

    // Upload images to Cloudinary
    try{
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "cars",
        });
        public_ids.push(result.secure_url);
    }
}
catch(err){
    console.log(err);
    return next(new ErrorHandler(err.message, 500));
}
 
    const car = await Car.create({
        user: req.user.id,
        title,
        description,
        tags,
        images:public_ids,
    });

    res.status(201).json({
        success: true,
        car,
    });}
    catch(err){
        console.log(err);
        return next(new ErrorHandler(err.message, 500));
    }
});

// Get All Cars
export const getAllCars = TryCatch(async (req, res, next) => {
    let keyword = req.query.search;

    // Check if 'search' is a valid string
    if (keyword && typeof keyword === 'string') {
        keyword = {
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { tags: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ],
        };
    } else {
        keyword = {}; // No search parameter, return all cars
    }

    try {
        const cars = await Car.find(keyword);

        res.status(200).json({
            success: true,
            cars,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});


export const getCarDetails = TryCatch(async (req, res, next) => {
    const car = await Car.findById(req.params.id);

    if (!car) { 
        return next(new ErrorHandler("Car not found", 404));
    }   

    res.status(200).json({
        success: true,
        car,
    });
});


export const updateCar = TryCatch(async (req, res, next) => {
    const { title, description, tags, images } = req.body;

    // Find the car by ID
    const carStored = await Car.findById(req.params.id);
    if (!carStored) {
        return next(new ErrorHandler("Car not found", 404));
    }

    // Check if the logged-in user owns the car
    if (req.user.id !== carStored.user.toString()) {
        return next(new ErrorHandler("You are not allowed to update this car", 401));
    }

    // If there are new images, upload them to Cloudinary
    let public_ids = carStored.images;  // Use existing images as fallback

    if (images && images.length > 0) {
        public_ids = []; // Reset the array for new images
        try {
            // Upload new images to Cloudinary
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: "cars",
                });
                public_ids.push(result.secure_url); // Store the URL of the uploaded image
            }

            // Destroy old images from Cloudinary (if they exist)
            for (const imageUrl of carStored.images) {
                // Extract the public ID from the image URL
                const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract the public ID from the URL
                await cloudinary.v2.uploader.destroy(`cars/${publicId}`);
            }
        } catch (err) {
            console.log(err);
            return next(new ErrorHandler("Error uploading images to Cloudinary", 500));
        }
    }

    // Prepare the updated car data
    const updatedCarData = {
        title: title || carStored.title,
        description: description || carStored.description,
        tags: tags || carStored.tags,
        images: public_ids, // Store the updated images URLs
    };

    // Update the car in the database
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, updatedCarData, {
        new: true,
        runValidators: true, // Validate the updated data
    });

    if (!updatedCar) {
        return next(new ErrorHandler("Failed to update the car", 500));
    }

    // Send the success response with updated car data
    res.status(200).json({
        success: true,
        car: updatedCar,
    });
});

// Delete Car
export const deleteCar = TryCatch(async (req, res, next) => {

    try{
    const car = await Car.findById(req.params.id);

    if (!car) {
        return next(new ErrorHandler("Car not found", 404));
    }

    if (req.user.id !== car.user.toString()) {
        return next(new ErrorHandler("You are not allowed to delete this car", 401));
    }

    // Destroy images from Cloudinary
    if(car.images){
        
    
    for (const imageUrl of car.images) {
        // Extract the public ID from the image URL
        const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract the public ID from the URL
        await cloudinary.v2.uploader.destroy(`cars/${publicId}`);
    }
}

    await car.deleteOne();

    res.status(200).json({
        success: true,
        message: "Car deleted successfully",
    });
}
catch(err){
    console.log(err);
    return next(new ErrorHandler("Error deleting car", 500));
}
});
