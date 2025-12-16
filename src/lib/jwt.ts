import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables");
}

export const generateJWT = (payload: object, expiresIn: number | string = "1h") => {
  const options: SignOptions = { expiresIn: expiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyJWT = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
