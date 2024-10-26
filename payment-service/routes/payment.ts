import { CustomRequest } from "./../types/CustomRequest";
import express, { NextFunction, RequestHandler, Response } from "express";
import { CustomError } from "../libs/CustomError";
import { getSession } from "../services/payment";
import axios from "axios";
import { Urls } from "../types/Urls";

const router = express.Router();

const userIdMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const response = await axios.get(`${Urls.AUTH_SERVICE}/verify`, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status !== 200) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  } catch (error) {
    if (error instanceof CustomError) {
      console.error(error);
      res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
      });
    }
  }
};

router.use(userIdMiddleware as RequestHandler);

router.post("/checkout", async (req, res) => {
  const token = req.headers.authorization!;

  try {
    const session = await getSession(token);

    res.status(200).json({ url: session.url });
  } catch (error) {
    if (error instanceof CustomError) {
      console.error(error);
      res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
      });
    }
  }
});

export default router;
