import app from "../src/app.js";
import serverless from "serverless-http";

export default serverless(app);

// const port = 3306;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });