import * as express from "express";
import * as core from "express-serve-static-core";
import { Application } from "express";

declare module "express-serve-static-core" {
  interface Application {
    ws: import("express-ws").Application["ws"];
  }

  interface Router {
    ws: import("express-ws").Router["ws"];
  }
}
