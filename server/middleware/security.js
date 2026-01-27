import helmet from "helmet";
import xss from "xss-clean";
import hpp from "hpp";

const setupSecurity = (app) => {
  // Set security headers
  app.use(helmet());

  // Prevent XSS attacks
  app.use(xss());

  // Prevent HTTP Parameter Pollution
  app.use(hpp());
};

export default setupSecurity;
