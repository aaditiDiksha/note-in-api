
const handleSignin = (req, res, data, bcrypt) => {
  
const { email, password } = req.body;

if (!email || !password) {
  return Promise.reject("incorrect form submission");
 }
  data.select("email", "hash")
  .from("login")
  .where("email", "=", email)
  .then((user) => {
    bcrypt.compare(password, user[0].hash, function (err, result) {
      // result == true
      if (result) {
        data.select("*")
        .from("users")
        .where("email", "=", email)
        .then((user) => res.json(user[0]))
        .catch((err) =>  res.status(400).json(err));
      }
      else {
        res.status(400).json('err');
      }
    });
  })
  .catch((err) => {
    console.log(err);
      res.status(400).json(err);

  });
}
module.exports = {
  handleSignin: handleSignin,
};
