import admin from "../lib/firebaseAdmin.js";

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Unauthorized: Missing or invalid Authorization header.");
    return res.status(401).json({ error: "Unauthorized." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Decoded Token:", decodedToken);

    // Attach the decoded user UID to the request object
    req.user = { uid: decodedToken.uid };
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

export default authenticateToken;
