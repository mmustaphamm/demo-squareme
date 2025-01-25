import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import router from "./routes";
import compression from "compression";
import httpLogger from "./loader/logging/http";
import errorHandler from "./middleware/error-handler";
import appConfig from "./config/app";
import constant from "./constant";
import { AppDataSource } from "./data-source";
const port = process.env.SERVER_PORT || 5000

AppDataSource.initialize()
  .then(async () => {

const app: Application = express();
app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(httpLogger)
app.use(router)
app.use(errorHandler)
app.listen(port, () => console.log(constant.messages.serverUp + port))
})
.catch((error) => console.log(error));