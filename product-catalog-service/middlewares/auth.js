const adminAuth = (req, res, next) => {
  const isAdmin = req.headers["is-admin"];

  if (isAdmin) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};


export { adminAuth };