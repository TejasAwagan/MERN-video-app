import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js"
import  {User}  from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js" 

const registerUser = asyncHandler(async (req,res) =>{
    // logic for registration of new user
    // get the data from the frontend
    // check for validation if the fields are empty or not
    // check if user is already exist or not
    // upload the avatar and cover image
    // upload that avatar to the cloudinary
    // create a user object - creat an entry db
    // remove password and refresh token from the reponse
    // check for user creation
    // return the response

    const {username, email, fullname, password} = req.body

    console.log("username : ",username)

    if(
        [username, email, fullname, password].some((field) =>
        field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or : [{username, email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username Already Exist")
    }

    const avatarLocalPath = req.files.avatar[0]?.path;
    const coverImageLocalPath = req.files.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(409, "Avatar file is required")
    }

    const avatar  = await uploadOnCloudinary(avatarLocalPath)
    const coverImage  = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create(
        {
            fullname,
            avatar : avatar.url,
            coverImage : coverImage?.url || "",
            email,
            username : username.toLowerCase(),
            password
        }
    )

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registration of user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Register Successfully")
    )
})

export {registerUser}