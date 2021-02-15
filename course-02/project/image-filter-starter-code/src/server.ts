import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import { fstat } from 'fs';
import fs from 'fs';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  app.get('/filteredImage', async (req, res) => {
    const target_url: string = req.query.image_url;
    if (!target_url) {
      res.send('please provide query parameter image_url')
    } else {
      if (
        !target_url.includes("png") &&
        !target_url.includes("jpg") &&
        !target_url.includes("jpeg")
      ) {
        res.end(`please provide a supported MIME type: "png", "jpg", "jpeg"`)
      } else {

        try {
          const filteredImagePath = await filterImageFromURL(target_url);
          if (fs.existsSync(filteredImagePath)) {
            res.sendFile(filteredImagePath, null, () => deleteLocalFiles([filteredImagePath]));
          } else {
            throw ("Whoops, couldn't get the file right. Try again.")
          }
        } catch (e) {
          res.status(500).end(e);
        }
      }
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();