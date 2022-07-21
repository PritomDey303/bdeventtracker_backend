const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class JwtHandler {
  //hashing password
  static async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
  static async comparePassword(password, hashedPassword) {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  }
  //generating jwt token
  static async generateToken(obj, expiration) {
    const token = jwt.sign(obj, process.env.JWT_SECRET, {
      expiresIn: expiration,
    });
    return token;
  }
  //generate jwt token with no expiration
  static async generateTokenWithNoExpiration(obj) {
    const token = jwt.sign(obj, process.env.JWT_SECRET);
    return token;
  }
  //verify token
  static async verifyToken(token) {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    return decoded;
  }
}

module.exports = JwtHandler;
