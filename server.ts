import express, { Request, Response } from 'express'
const app = express()
const cors = require('cors')
require('dotenv').config()
require("./src/config/db.config")
const PORT = process.env.PORT || 8081
import Moralis from 'moralis';
import { runCronJobForNFT } from './src/api/controller/NFTController/nft.controller'

const apiRoutes = require("./src/routes")

app.get('/', async (req: Request, res: Response) => {
    res.send({ message: '200 Ok' })
})

app.use(cors({
    origin: "*"
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('src'))

app.use('/api', apiRoutes)

runCronJobForNFT()

app.listen(PORT, async () => {
    await Moralis.start({
        apiKey: "cCizCFj2k4MKGUGdVqW83j5OxSzalaQCWJjSLpZ9kDVhXbuocXJo5HKggWYC5TKb",
    });
    console.log(`App is listening at http://localhost:${PORT}`)
})
