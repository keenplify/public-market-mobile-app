import {
  CartItem,
  Order,
  Prisma,
  PrismaClient,
  Product,
  SubOrder,
  User,
} from ".prisma/client";
import {
  authenticate,
  isCustomer,
  isSeller,
  sendValidationErrors,
} from "@shared/functions";
import { Router } from "express";
import { body, param, query } from "express-validator";

const router = Router();
const prisma = new PrismaClient();

router.post(
  "/checkout",
  body("mop").isString(),
  sendValidationErrors,
  authenticate,
  isCustomer,
  async (req, res) => {
    const user = req.user as User;

    const cartItems = await prisma.cartItem.findMany({
      where: {
        customerId: user.id,
      },
      include: {
        product: true,
      },
    });

    // Create main order
    const newOrder = await prisma.order.create({
      data: {
        customerId: user.id,
        modeOfPayment: req.body.mop,
      },
    });

    if (!newOrder) res.status(500).send("Unable to create order!");

    let queries: Prisma.Prisma__SubOrderClient<SubOrder>[] = [];

    cartItems.map((cartItem) => {
      const SubOrder = prisma.subOrder.create({
        data: {
          productId: cartItem.productId,
          orderId: newOrder.id,
          quantity: cartItem.quantity,
          sellerId: cartItem.product.sellerId,
        },
      });

      queries.push(SubOrder);
    });

    const newSubOrders = await Promise.all(queries);

    if (!newSubOrders) res.status(500).send("Unable to create sub orders!");

    //Delete involved Carts
    const deletedCartItems = await prisma.cartItem.deleteMany({
      where: {
        customerId: user.id,
      },
    });

    newSubOrders.forEach(
      async (o) =>
        await prisma.notification.create({
          data: {
            description: `${user.username} has requested an order`,
            title: "New Order",
            type: "NEW_ORDER",
            userId: o.sellerId,
            referencedId: o.id,
          },
        })
    );

    res.send({ message: "Success", newOrder, newSubOrders, deletedCartItems });
  }
);

router.get(
  "/seller/suborders/cursorpaginate",
  query("cursor").optional().isNumeric(),
  sendValidationErrors,
  authenticate,
  isSeller,
  async (req, res) => {
    let user = req.user as User;
    let cursor = Number.parseInt(req.query.cursor as string);
    let last: SubOrder[] = [];

    if (!req.query.cursor) {
      last = await prisma.subOrder.findMany({
        where: {
          sellerId: user.id,
        },
        take: 1,
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            include: {
              images: true,
            },
          },
          order: {
            include: {
              customer: {
                include: {
                  address: true,
                },
              },
            },
          },
        },
      });

      //Check if any product found
      if (last.length === 0)
        return res.send({
          message: "No orders found",
          subOrders: [],
          count: 0,
          nextId: false,
        });

      cursor = last[0].id;
    }

    const subOrders = await prisma.subOrder.findMany({
      take: 5,
      skip: 1,
      cursor: {
        id: cursor,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        product: {
          include: {
            images: true,
          },
        },
        order: {
          include: {
            customer: {
              include: {
                address: true,
              },
            },
          },
        },
      },
    });

    const count = await prisma.order.count();

    if (subOrders.length === 0)
      return res.send({
        message: "Success",
        subOrders: [...last, ...subOrders],
        count,
        nextId: false,
      });

    const nextId = subOrders[subOrders.length - 1].id;

    return res.send({
      message: "Success",
      subOrders: [...last, ...subOrders],
      count,
      nextId,
    });
  }
);

router.get(
  "/customer/cursorpaginate",
  query("cursor").optional().isNumeric(),
  sendValidationErrors,
  authenticate,
  isCustomer,
  async (req, res) => {
    let user = req.user as User;
    let cursor = Number.parseInt(req.query.cursor as string);
    let last: Order[] = [];

    const include = {
      subOrders: {
        include: {
          product: {
            include: {
              seller: true,
              images: true,
            },
          },
        },
      },
      customer: true,
    };
    if (!req.query.cursor) {
      last = await prisma.order.findMany({
        where: {
          customerId: user.id,
        },
        take: 1,
        orderBy: { createdAt: "desc" },
        include,
      });

      //Check if any product found
      if (last.length === 0)
        return res.send({
          message: "No orders found",
          subOrders: [],
          count: 0,
          nextId: false,
        });

      cursor = last[0].id;
    }

    const orders = await prisma.order.findMany({
      take: 5,
      skip: 1,
      cursor: {
        id: cursor,
      },
      orderBy: {
        id: "desc",
      },
      include,
    });

    const count = await prisma.order.count();

    if (orders.length === 0)
      return res.send({
        message: "Success",
        orders: [...last, ...orders],
        count,
        nextId: false,
      });

    const nextId = orders[orders.length - 1].id;

    return res.send({
      message: "Success",
      orders: [...last, ...orders],
      count,
      nextId,
    });
  }
);

router.post(
  "/seller/suborders/changestatus/:id",
  param("id").isNumeric(),
  body("status").isString().notEmpty(),
  sendValidationErrors,
  authenticate,
  isSeller,
  async (req, res) => {
    const user = req.user as User;
    const subOrder = await prisma.subOrder.update({
      where: {
        id: Number.parseInt(req.params.id),
      },
      data: {
        status: req.body.status,
      },
      include: {
        order: true,
      },
    });

    if (!subOrder) {
      return res.send({ message: "SubOrder not found!" });
    }

    if (subOrder.order)
      await prisma.notification.create({
        data: {
          userId: subOrder.order?.customerId,
          description: `An item you have brought has updated its status into ${subOrder.status}`,
          title: `Order Status Update`,
          type: "ORDER_STATUS_UPDATE",
          referencedId: subOrder.id,
          urgent: true,
        },
      });

    return res.send({
      message: "Successfully changed to " + subOrder.status,
      subOrder,
    });
  }
);

router.post(
  "/customer/cancel/:id",
  param("id").isNumeric(),
  sendValidationErrors,
  authenticate,
  isCustomer,
  async (req, res) => {
    const user = req.user as User;
    const suborders = await prisma.subOrder.updateMany({
      where: {
        id: Number.parseInt(req.params.id),
      },

      data: {
        status: "CANCELLED",
      },
    });

    if (!suborders || suborders.count === 0)
      return res.send({
        message: "Cant find suborders with the said parameters to update!",
      });

    return res.send({ message: "Successful", suborders });
  }
);

export default router;
