import pool from './config/db.config'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

dotenv.config()

/**
 * @file - This file is the entry point for the backend.
 * @author Miguell
 */

const app = express();
app.use(express.json);
app.use(cors());
app.disable('x-powered-by')

const PORT = process.env.PORT || 3000;

/**
 * @function - Initialization the express application.
 * @param {number} port - The port number for the server to listen on 
 */

function startServer(port){
app.listen(PORT, () => {
  console.log(`Server is listen in the port: ${PORT}`)
})
}

// ? Calls the function to start the server with the configured port
startServer(PORT)