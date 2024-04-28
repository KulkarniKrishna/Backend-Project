import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, userName, passWord } = req.body;
  //console.log("email: ", email);

  // validate all fields
  // TODO: create new utility file called validations with functions for validating the fields
  if (
    [fullName, email, userName, passWord].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // checking for user already exists
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // handling Avatar and CoverImage files - uploading
  console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required.");
  }

  const avatarCloudinary = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarCloudinary) {
    throw new ApiError(400, "Avatar is required.");
  }
  const coverImageCloudinary = await uploadOnCloudinary(coverImageLocalPath);

  // create/save user to DB
  const user = await User.create({
    fullName,
    avatar: avatarCloudinary.url,
    coverImage: coverImageCloudinary?.url || "",
    email,
    passWord,
    userName: userName.toLowerCase(),
  });

  //check if user is created in DB or not
  const createdUser = await User.findById(user._id).select(
    "-passWord -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Registeration failed due to unknown reason.");
  }

  //send response
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully."));
});
