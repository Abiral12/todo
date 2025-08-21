import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const { email: userEmail, password: userPassword } = req.body;

    if (userEmail !== email || userPassword !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { email: userEmail }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" } 
    );

    res.cookie("token", token, {
      httpOnly: true, 
     secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
