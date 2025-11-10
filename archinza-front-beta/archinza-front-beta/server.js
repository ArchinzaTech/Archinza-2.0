var compression = require("compression");
const express = require("express");
const path = require("path");
// const { default: config } = require("./src/config/config");
// const { default: axios } = require("axios");
const app = express();

app.use(compression());

const port = process.env.REACT_APP_PORT || 9028;
app.use(express.static(path.join(__dirname, "build")));

// app.get("/business/profile/:username", async (req, res, next) => {
//   try {
//     const { username } = req.params;

//     const response = await axios.get(
//       `http://localhost:3020/business/meta-data/${username}`
//     );
//     const user = response?.data;

//     // Fallbacks in case no data
//     const name = user?.business_name;
//     const description =
//       user?.bio || `${name}'s profile on Archinza – Architects & Designers`;
//     const image = user?.brand_logo
//       ? `https://archinza-beta.s3.ap-south-1.amazonaws.com/business/${user?.brand_logo}`
//       : "";

//     // Send dynamic HTML with OG tags
//     res.send(`
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="utf-8"/>
//         <title>${name} – Archinza</title>
//         <meta name="description" content="${description}" />

//         <!-- Open Graph tags for LinkedIn/Facebook -->
//         <meta property="og:title" content="${name} – Archinza"/>
//         <meta property="og:description" content="${description}"/>
//         <meta property="og:image" content="${image}"/>
//         <meta property="og:url" content="http://174.138.123.146:9028/business/profile/${username}"/>
//         <meta property="og:type" content="website"/>
//       </head>
//       <body>
//         <div>Profile preview for ${name}</div>
//         <script>
//           // Redirect real browsers back to React app
//           window.location.href = "/business/profile/${username}";
//         </script>
//       </body>
//       </html>
//     `);
//   } catch (err) {
//     console.error("Error rendering profile meta:", err.message);
//     next(); // fallback to React app
//   }
// });

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, function () {
  console.log("Web server listening on port %d in %s mode", port);
});

//something change
