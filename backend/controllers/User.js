import User from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "every fields required" });
        }

        const existinguser = await User.findOne({ email });

        if (existinguser) {
            return res.status(400).json({ message: "'user already exists" });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        })

        await user.save()

        const token = jwt.sign(
            {
                userId: user._id, role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        res.status(201).json({
            message: "user registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        })


    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
}

export const login=async(req,res)=>{
    try {
        const {email,password} =req.body;

    if(!email || !password)
    {
        return res.status(400).json({message:"all fields are required"})
    }

    const user=await User.findOne({email})

    if(!user)
    {
        return res.status(401).json({message:"invalid email or password"})
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch)
    {
        return res.status(401).json({message:"invalid email or password"});
    }

    const token= jwt.sign({
        userId:user._id,role:user.role
    },process.env.JWT_SECRET,{expiresIn:"1d"}
    );
    
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
        
    }catch(error){

        console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
    }    
};