import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import path from "path";
import session from "cookie-parser";
import cookieparser from "cookie-parser";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
// import "dotenv/config";
// Configure multer for file storage
const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/uploads", express.static("uploads"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(
  session({
    key: "username",
    secret: "password",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expire: 60 * 10,
    },
  })
);

// const upload = multer({
//   dest: "uploads/",
//   fileFilter: function (req, file, cb) {
//     var filetypes = /jpeg/;
//     var mimetype = filetypes.test(file.mimetype);
//     if (mimetype) {
//       return cb(null, true);
//     }
//     cb(
//       "Error: File upload only supports the " +
//         "following filetypes - " +
//         filetypes
//     );
//   },
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage });


app.use('/uploads', express.static('uploads'));



const db = mysql.createConnection({
  database: "rent",
  host: "mysql-de86692-dannydevito-5066.d.aivencloud.com",
  port: "11688",
  user: "avnadmin",
  password: "AVNS_iLh5-8iJS645tqF9L2f",
});

db.connect((err) => {
  if (err) {
    console.log("error in database connection");
  } else {
    console.log("database connected successfully");
  }
});

// const verifyJWT = (req, res, next) => {
//   const token = req.headers["x-access-token"];
//   if (!token) {
//     res.send("We need token give it next time");
//   } else {
//     jwt.verify(token, "secret", (err, decoded) => {
//       if (err) {
//         res.json({ auth: false, message: "Failed to authenticate" });
//       } else {
//         req.mail = decoded.id;
//         next();
//       }
//     });
//   }
// };

app.get("/verifyToken", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, "test", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json({ message: "Token verified" });
  });
});

// app.get("/isAuth", verifyJWT, (req, res) => {
//   const email = req.mail; // Assuming you stored email in req.mail
//   const query = "SELECT id, name, email FROM user WHERE email=?";
//   db.query(query, [email], (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: "Internal server error" });
//     }
//     if (result.length > 0) {
//       res.json({ auth: true, result });
//     } else {
//       res.status(401).json({ auth: false, message: "User not found" });
//     }
//   });
// });

app.get("/singleUser", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.decode(token);
  console.log(decodedToken);
  const sql = "select * from user where email=?";
  db.query(sql, [decodedToken.email], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ Error: "internal login error" });
    }
    if (data.length > 0) {
      res.send(data[0]);
    } else {
      res.status(404).json({ Error: "user not found" });
    }
  });
});

app.post("/signup", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // Validate inputs (you can add more validation as needed)
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const checkemail = "SELECT * FROM user WHERE email=?";
  db.query(checkemail, [email], (err, data) => {
    if (err) {
      console.error("Error checking email:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (data.length > 0) {
      return res
        .status(400)
        .json({ error: "User with this email already registered" });
    }

    const sqlinsert =
      "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
    db.query(sqlinsert, [name, email, password], (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      console.log(result);
      res.status(200).send("Data inserted successfully");
    });
  });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const sqlinsert = "select * from user where email=?";
  db.query(sqlinsert, [email], (err, data) => {
    if (err) {
      console.error("Error in database query:", err);
      return res.json({ Error: "Internal Email Error" });
    }

    if (email.trim() === "" || password.trim() === "") {
      return res.json({
        Status: "Error",
        Error: "Please enter both email and password.",
      });
    }
    if (data.length > 0) {
      const checkpass = req.body.password;
      const password = data[0].password;
      const compare = checkpass.localeCompare(password);
      console.log(compare);
      if (compare == 0) {
        const token = jwt.sign(
          { email: data[0].email, name: data[0].name, id: data[0].id },
          "test",
          { expiresIn: "1h" }
        );
        const { password, ...others } = data[0];
        return res

          .cookie("AccessToken", token, {
            httpOnly: true,
            secure: true,
          })

          .status(200)
          .json({ success: true, Status: "Success", token });
      } else {
        return res.json({ success: false, Error: "Password not matched" });
      }
    } else {
      return res.json({ Error: "Email Not Existed" });
    }
  });
});

app.post("/create-listing", upload.single("images"), async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      is_sell,
      is_rent,
      is_parking,
      is_furnished,
      is_offer,
      num_bedrooms,
      num_bathrooms,
      regular_price,
      discounted_price,
    } = req.body;
    const images = req.file.path;

    const query = `
      INSERT INTO createlisting (
        name, description, address, is_sell, is_rent, is_parking, is_furnished, is_offer, num_bedrooms, num_bathrooms, regular_price, discounted_price, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    db.query(
      query,
      [
        name,
        description,
        address,
        is_sell === "true" ? 1 : 0,
        is_rent === "true" ? 1 : 0,
        is_parking === "true" ? 1 : 0,
        is_furnished === "true" ? 1 : 0,
        is_offer === "true" ? 1 : 0,
        num_bedrooms,
        num_bathrooms,
        regular_price,
        discounted_price,
        JSON.stringify(images),
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting listing:", err);
          return res
            .status(500)
            .json({ error: "Internal server error", details: err.message });
        }
        console.log("Listing created successfully");
        res.status(201).json({
          message: "Listing created successfully",
          listingId: result.insertId,
        });
      }
    );
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ error: "Failed to create listing" });
  }
});

app.get("/listings", async (req, res) => {
  try {
    const {
      search = "",
      all = "false",
      rent = "false",
      sale = "false",
      offer = "false",
      parking = "false",
      furnished = "false",
      sort_order = "Price high to low",
    } = req.query;

    let query = "SELECT * FROM createlisting WHERE 1=1";

    if (search) {
      query += ` AND (name LIKE ? OR description LIKE ?)`;
    }

    if (all === "true") {
      query += ` AND (is_sell=1 OR is_rent=1)`;
    } else {
      if (rent === "true") query += ` AND is_rent=1`;
      if (sale === "true") query += ` AND is_sell=1`;
    }

    if (offer === "true") query += ` AND is_offer=1`;
    if (parking === "true") query += ` AND is_parking=1`;
    if (furnished === "true") query += ` AND is_furnished=1`;

    switch (sort_order) {
      case "Price high to low":
        query += " ORDER BY regular_price DESC";
        break;
      case "Price low to high":
        query += " ORDER BY regular_price ASC";
        break;
      case "Latest":
        query += " ORDER BY id DESC";
        break;
      case "Oldest":
        query += " ORDER BY id ASC";
        break;
      default:
        break;
    }

    db.query(query, [`%${search}%`, `%${search}%`], (err, results) => {
      if (err) {
        console.error("Error fetching listings:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

app.post("/like-listing/:id", (req, res) => {
  const { id } = req.params;

  const query =
    "UPDATE createlisting SET like_count = like_count + 1 WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error updating like count:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json({ message: "Like count updated successfully" });
  });
});

app.listen(3001, () => {
  console.log("server is running port 3001");
});
