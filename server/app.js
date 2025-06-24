const express = require("express");
const bcrypt = require('bcryptjs');
const fileUpload = require("express-fileupload");
const productsRouter = require("./routes/products");
const productImagesRouter = require("./routes/productImages");
const categoryRouter = require("./routes/category");
const searchRouter = require("./routes/search");
const mainImageRouter = require("./routes/mainImages");
const userRouter = require("./routes/users");
const orderRouter = require("./routes/customer_orders");
const slugRouter = require("./routes/slugs");
const orderProductRouter = require('./routes/customer_order_product');
const wishlistRouter = require('./routes/wishlist');
const http = require('http');
const socketIO = require('socket.io');
const mysql = require('mysql2');
var cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000', // ✅ Frontend origin
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sql#9040', // 🔒 Replace with your DB password
  database: 'singitronic_nextjs_testing_dbv1', // ✅ Replace with your DB name
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('MySQL Connection Error:', err);
  } else {
    console.log('✅ Connected to MySQL');
  }
});

// Serve basic route (optional)
app.get('/', (req, res) => {
  res.send('Server is running with Socket.IO and MySQL');
});

// Store last known statuses
let lastStatuses = {};

// Poll every 5 seconds
setInterval(() => {
  db.query(
    `SELECT id, status, total, name
     FROM customer_order`,
    (err, results) => {
      if (err) return console.error('MySQL Query Error:', err);

      results.forEach((order) => {
        const prevStatus = lastStatuses[order.id];

        // If status changed
        if (prevStatus !== undefined && prevStatus !== order.status) {
          console.log(`📢 Order ${order.id} status changed: ${prevStatus} → ${order.status}`);

          const notification = {
            orderId: order.id,
            newStatus: order.status,
            name: order.name,
            total: order.total,
          };

          // Emit to frontend
          io.emit('orderStatusChanged', notification);

          // Save to DB
          db.query(
            `INSERT INTO notifications (order_id, customer_name, status, total)
            VALUES (?, ?, ?, ?)`,
            [
              notification.orderId,
              notification.name,
              notification.newStatus,
              notification.total,

            ],
            (err) => {
              if (err) console.error('❌ Error inserting notification:', err);
            }
          );
        }

        // Save current status
        lastStatuses[order.id] = order.status;
      });
    }
  );
}, 5000);


app.use(fileUpload());

app.use("/api/products", productsRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/images", productImagesRouter);
app.use("/api/main-image", mainImageRouter);
app.use("/api/users", userRouter);
app.use("/api/search", searchRouter);
app.use("/api/orders", orderRouter);
app.use('/api/order-product', orderProductRouter);
app.use("/api/slugs", slugRouter);
app.use("/api/wishlist", wishlistRouter);
const notifications = require('./routes/notifications')(db);
app.use("/api/notifications", notifications);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
