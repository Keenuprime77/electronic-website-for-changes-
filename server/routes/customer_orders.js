const express = require('express');

const router = express.Router();

const {
    getCustomerOrder,
    createCustomerOrder,
    updateCustomerOrder,
    deleteCustomerOrder,
    getAllOrders ,
  } = require('../controllers/customer_orders');

  router.route('/')
  .get(getAllOrders)
  .post(createCustomerOrder);

  router.route('/:id')
  .get(getCustomerOrder)
  .put(updateCustomerOrder) 
  .delete(deleteCustomerOrder)


//onst { PrismaClient } = require("@prisma/client");
//const prisma = new PrismaClient();

// router.post("/pay", async (req, res) => {
//   const { productId } = req.body;

//   try {
//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//     });

//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     if (product.quantity <= 0) {
//       return res.status(400).json({ error: "Product is out of stock" });
//     }

//     const updated = await prisma.product.update({
//       where: { id: productId },
//       data: {
//         quantity: {
//           decrement: 1,
//         },
//         inStock: product.quantity - 1 > 0 ? 1 : 0,
//       },
//     });

//     return res.status(200).json({ message: "Payment successful", product: updated });
//   } catch (error) {
//     console.error("Error during payment:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });


module.exports = router;