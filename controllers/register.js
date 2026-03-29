const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;

  console.log("DATA RECEIVED 👉", email, name, password); // 👈 ADDED (input check)

  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }

  const hash = bcrypt.hashSync(password);
  console.log("HASH GENERATED 👉", hash); // 👈 ADDED (bcrypt check)

  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        console.log("LOGIN INSERT SUCCESS 👉", loginEmail); // 👈 ADDED

        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date()
          })
          .then(user => {
            console.log("USER INSERT SUCCESS 👉", user); // 👈 ADDED
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(err => {
        console.log("REGISTER ERROR 👉", err); // 👈 MOST IMPORTANT (real error yahi milega)
        trx.rollback();
        res.status(400).json('unable to register');
      });
  })
    .catch(err => {
      console.log("TRANSACTION ERROR 👉", err); // 👈 ADDED (outer error)
      res.status(400).json('unable to register');
    });
}

module.exports = {
  handleRegister: handleRegister
};