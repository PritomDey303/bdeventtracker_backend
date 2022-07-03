const bcrypt = require("bcrypt");
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
}

module.exports = JwtHandler;
