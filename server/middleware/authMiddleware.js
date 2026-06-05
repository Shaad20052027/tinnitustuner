// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// export const protect = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Not authorised, no token' });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select('-password');

//     if (!req.user) {
//       return res.status(401).json({ message: 'User not found' });
//     }

//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Not authorised, token failed' });
//   }
// };

// export const protect = async (req, res, next) => {
//   try {
//     console.log("AUTH HEADER:", req.headers.authorization);

//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       console.log("NO TOKEN");
//       return res.status(401).json({ message: "Not authorised, no token" });
//     }

//     const token = authHeader.split(" ")[1];
//     console.log("TOKEN:", token);

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("DECODED:", decoded);

//     req.user = await User.findById(decoded.id).select("-password");
//     console.log("USER:", req.user);

//     if (!req.user) {
//       console.log("USER NOT FOUND");
//       return res.status(401).json({ message: "User not found" });
//     }

//     next();
//   } catch (err) {
//     console.log("ERROR:", err.message);
//     res.status(401).json({ message: "Not authorised, token failed" });
//   }
// };
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    console.log("AUTH HEADER:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("NO TOKEN");
      return res.status(401).json({ message: "Not authorised, no token" });
    }

    const token = authHeader.split(" ")[1];
    console.log("TOKEN:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED:", decoded);

    req.user = await User.findById(decoded.id).select("-password");
    console.log("USER:", req.user);

    if (!req.user) {
      console.log("USER NOT FOUND");
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(401).json({ message: "Not authorised, token failed" });
  }
};