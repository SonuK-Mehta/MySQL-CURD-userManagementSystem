const mysql = require("mysql2");

// Connection Pool
const connection = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
});

// View user -
exports.view = (req, res) => {
  //Connect to DB (Pulling)-
  connection.getConnection((err, connection) => {
    if (err) throw err; // Not Connected
    console.log("Connected as ID " + connection.threadId);
    // user the connection-
    connection.query(
      "SELECT * FROM user WHERE status = 'active'",
      (err, rows) => {
        // When done with the connection, release it-
        connection.release();
        if (!err) {
          let removedUser = req.query.removed;
          res.render("home", { rows, removedUser });
        } else {
          console.log(err);
        }
      }
    );
  });
};

// Find user by search -
exports.find = (req, res) => {
  //Connect to DB (Pulling)-
  connection.getConnection((err, connection) => {
    if (err) throw err; // Not Connected
    console.log("Connected as ID " + connection.threadId);

    let searchTerm = req.body.search;
    // user the connection-
    connection.query(
      "SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?",
      ["%" + searchTerm + "%", "%" + searchTerm + "%"],
      (err, rows) => {
        // When done with the connection, release it-
        connection.release();
        if (!err) {
          res.render("home", { rows });
        } else {
          console.log(err);
        }
      }
    );
  });
};

// Go to page add new user -
exports.form = (req, res) => {
  res.render("add-user");
};

// Add new user -
exports.create = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  let searchTerm = req.body.search;
  //Connect to DB (Pulling)-
  connection.getConnection((err, connection) => {
    if (err) throw err; // Not Connected
    console.log("Connected as ID " + connection.threadId);
    // user the connection-
    connection.query(
      "INSERT INTO user set first_name = ?, last_name =  ?, email = ?, phone = ?, comments = ?",
      [first_name, last_name, email, phone, comments],
      (err, rows) => {
        // When done with the connection, release it-
        connection.release();
        if (!err) {
          res.render("add-user", { alert: "User added successfully." });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};

// Edit user -
exports.edit = (req, res) => {
  //Connect to DB (Pulling)-
  connection.getConnection((err, connection) => {
    if (err) throw err; // Not Connected
    console.log("Connected as ID " + connection.threadId);
    // user the connection-
    connection.query(
      "SELECT * FROM user WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        // When done with the connection, release it-
        connection.release();
        if (!err) {
          res.render("edit-user", { rows });
        } else {
          console.log(err);
        }
      }
    );
  });
};

// Update User -
exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  // User the connection
  connection.query(
    "UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?",
    [first_name, last_name, email, phone, comments, req.params.id],
    (err, rows) => {
      if (!err) {
        // User the connection
        connection.query(
          "SELECT * FROM user WHERE id = ?",
          [req.params.id],
          (err, rows) => {
            // When done with the connection, release it

            if (!err) {
              res.render("edit-user", {
                rows,
                alert: `${first_name} has been updated.`,
              });
            } else {
              console.log(err);
            }
            console.log("The data from user table: \n", rows);
          }
        );
      } else {
        console.log(err);
      }
      console.log("The data from user table: \n", rows);
    }
  );
};

// Delete user -
// exports.delete = (req, res) => {
//   //Connect to DB (Pulling)-
//   connection.getConnection((err, connection) => {
//     if (err) throw err; // Not Connected
//     console.log("Connected as ID " + connection.threadId);
//     // user the connection-
//     connection.query(
//       "DELETE FROM user WHERE id = ?",
//       [req.params.id],
//       (err, rows) => {
//         // When done with the connection, release it-
//         connection.release();
//         if (!err) {
//           res.redirect("/");
//         } else {
//           console.log(err);
//         }
//         console.log("The data from user table: \n", rows);
//       }
//     );
//   });
// };

// Delete - update
exports.delete = (req, res) => {
  //Connect to DB (Pulling)-
  connection.getConnection((err, connection) => {
    if (err) throw err; // Not Connected
    connection.query(
      "UPDATE user SET status = ? WHERE id = ?",
      ["removed", req.params.id],
      (err, rows) => {
        connection.release();
        if (!err) {
          let removedUser = encodeURIComponent("User successeflly removed.");
          res.redirect("/?removed=" + removedUser);
          // res.redirect("/");
        } else {
          console.log(err);
        }
        console.log("The data from user table are: \n", rows);
      }
    );
  });
};

// Viewall -
exports.viewall = (req, res) => {
  //Connect to DB (Pulling)-
  connection.getConnection((err, connection) => {
    if (err) throw err; // Not Connected
    console.log("Connected as ID " + connection.threadId);
    // user the connection-
    connection.query(
      "SELECT * FROM user WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        // When done with the connection, release it-
        connection.release();
        if (!err) {
          res.render("view-user", { rows });
        } else {
          console.log(err);
        }
        console.log("The data fro user table: \n", rows);
      }
    );
  });
};
