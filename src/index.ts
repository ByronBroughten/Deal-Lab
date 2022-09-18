require("dotenv").config();
import { runApp } from "./runApp";
// allow loading a "default property" from guest user.
// the default property uses the other default stuff.
runApp();
