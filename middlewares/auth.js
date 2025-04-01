async function restrictToLoggedinUserOnly(req, res, next) {
  const userUid = req.cookies?.uid; // Fix to access cookies correctly

  if (!userUid) {
    return res.redirect("/login");
  }

  const user = getUser(userUid); // Retrieve the user from the session ID

  if (!user) {
    return res.redirect("/login");
  }

  req.user = user;
  next();
}

module.exports = {
  restrictToLoggedinUserOnly,
};
