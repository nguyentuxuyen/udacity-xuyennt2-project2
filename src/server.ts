import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

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
  //    1. Validate the image_url query
  //    2. Call filterImageFromURL(image_url) to filter the image
  //    3. Send the resulting file in the response
  //    4. Delete any files on the server on finish of the response
  app.get('/filteredimage', async (req: Request, res: Response) => {
    const image_url  = req.query.image_url as string | undefined;

    // Check if image_url is provided
    if (!image_url) {
      return res.status(400).send('image_url query parameter is required.');
    }

    try {
      // Filter the image
      const filteredImagePath = await filterImageFromURL(image_url);

      // Send the filtered image in the response
      res.sendFile(filteredImagePath, () => {
        // Delete the filtered image file after sending the response
        deleteLocalFiles([filteredImagePath]);
      });
    } catch (error) {
      console.log(error);
      return res.status(422).send('An error occurred while processing the image.');
    }
  });

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get('/', async (req, res) => {
    res.send('Try GET /filteredimage?image_url={{}}');
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Press CTRL+C to stop the server');
  });
})();
