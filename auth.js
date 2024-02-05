import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const jti = req.headers.authorization.split(" ")[1];
  let decodedData = jwt.verify(jti, process.env.ACCESS_TOKEN_SECRET);

  req.user = decodedData.user;
  next();
};

export default auth;
