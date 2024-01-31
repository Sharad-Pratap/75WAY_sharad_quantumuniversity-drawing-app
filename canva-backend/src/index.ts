import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routes from './routes/drawingRoute';


dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(routes);

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.DATABASEURL!)
  .then(() => {
    console.log("Connected to db");
  })
  .catch(() => {
    console.log("Unable to connect database");
  });

  app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });
  
