
const handleRegister = (req, res, data, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json("empty fields");
  }

  bcrypt.hash(password, 2, (err, hash) => {{
    data.transaction((trx) => {
      trx
      .insert({ hash, email })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        trx("users")
        .insert({
          email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .returning("*")
          .then((user) => {
            res.json(user[0])});
          })
          .then(trx.commit)
          .catch(trx.rollback);
        }).catch((err) => {
          console.log('errr')
          res.status(400).json('err');
        });
      }});
};

module.exports = {
  handleRegister,
};
