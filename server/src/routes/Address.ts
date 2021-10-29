import { Address, PrismaClient, User } from ".prisma/client";
import { authenticate, isCustomer } from "@shared/functions";
import logger from "@shared/Logger";
import { Router } from "express";
import { body, param } from "express-validator";

const router = Router();
const prisma = new PrismaClient();

router.get("/:id", param("id").isNumeric(), async (req, res) => {
  const address = await prisma.address.findFirst({
    where: {
      id: Number.parseInt(req.params?.id),
    },
    include: {
      user: true,
    },
  });

  if (!address) return res.status(404).send({ message: "Address not found!" });

  res.send({
    message: "Success",
    address,
  });
});

router.post(
  "/add",
  body("name").not().isEmpty().isString(),
  body("region").not().isEmpty().isString(),
  body("province").not().isEmpty().isString(),
  body("city").not().isEmpty().isString(),
  body("barangay").not().isEmpty().isString(),
  body("house").not().isEmpty().isString(),
  body("postalCode").not().isEmpty().isString(),
  authenticate,
  async (req, res) => {
    const user = req.user as User;
    let address: Address;

    const address0 = await prisma.address.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (address0)
      address = await prisma.address.update({
        data: {
          name: req.body.name,
          region: req.body.region,
          province: req.body.province,
          city: req.body.city,
          barangay: req.body.barangay,
          postalCode: req.body.postalCode,
          house: req.body.house,
        },
        where: {
          id: address0.id,
        },
      });
    else {
      address = await prisma.address.create({
        data: {
          name: req.body.name,
          region: req.body.region,
          province: req.body.province,
          city: req.body.city,
          barangay: req.body.barangay,
          postalCode: req.body.postalCode,
          house: req.body.house,
          userId: user.id,
        },
      });
    }

    if (!address) return res.send({ message: "Unable to create address" });

    return res.send({
      message: "Success",
      address,
    });
  }
);

/*
 * Edit address
 */
router.put(
  "/:id",
  param("id").optional().isNumeric(),
  body("name").optional().isString(),
  body("region").optional().isString(),
  body("province").optional().isString(),
  body("city").optional().isString(),
  body("barangay").optional().isString(),
  body("postalCode").optional().isString(),
  authenticate,
  async (req, res) => {
    const address = await prisma.address.update({
      where: {
        id: Number.parseInt(req.params?.id),
      },
      data: {
        name: req.body?.name,
        region: req.body?.region,
        province: req.body?.province,
        city: req.body?.city,
        barangay: req.body?.barangay,
        postalCode: req.body?.postalCode,
      },
    });

    if (!address)
      return res.status(404).send({ message: "Unable to update address." });

    return res.send({
      message: "Success",
      address,
    });
  }
);

router.delete(
  "/:id",
  param("id").isNumeric(),
  authenticate,
  async (req, res) => {
    const address = await prisma.address.delete({
      where: {
        id: req.params?.id,
      },
    });

    res.send({
      message: "Successfully deleted " + req.params?.id,
      address,
    });
  }
);

export default router;
