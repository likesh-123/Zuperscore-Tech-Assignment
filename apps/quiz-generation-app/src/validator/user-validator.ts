const { z } = require("zod");

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  mobileNo: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

console.log(
  userSchema.parse({
    name: "John Doe",
    email: "john.doe@example.com",
    mobileNo: "1234567890",
    password: "password123",
  }).error,
);

export default userSchema;
