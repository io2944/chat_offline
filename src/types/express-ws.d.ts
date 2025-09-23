import * as express from "express";
import * as core from "express-serve-static-core";
import { Application } from "express";
import { PublicUser } from "../models/user.model.ts";

declare module "express-serve-static-core" {
  interface Request {
    currentUser?: PublicUser;
  }
  interface Application {
    ws: import("express-ws").Application["ws"];
  }

  interface Router {
    ws: import("express-ws").Router["ws"];
  }
}
