const token = await user.generateAuthToken();
const html = await user.verificationEmailBuilder(token);
const info = await user.sendEmail(email, "Verify your email address", html);
return res.status(200).json({ message: "Verification email sent" });