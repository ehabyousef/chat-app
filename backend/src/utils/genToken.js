import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  try {
    // Create JWT with correct payload structure
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "7d", // 7 days instead of 1 hour
    });

    // Set cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === "production",
    });

    return token; // Return token for JSON response
  } catch (error) {
    console.error("Token generation error:", error);
    throw new Error("Failed to generate authentication token");
  }
};
