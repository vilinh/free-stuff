import express from "express";
import listingModel from "../models/listing.js"

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const result = await getListings();
        res.send({listings: result });
    } catch (error) {
        console.log(error);
        res.status(500).send("An error ocurred in the server.");
    }
});

router.get('/:lid', async (req, res) => {
    const lid = req.params['lid'];
    let result = await findListingByLid(lid);
    if (result == undefined || result.length == 0) {
        res.status(404).send('Resource not found.');
    } else {
        res.status(200).send(result);
    }
});

async function getListings() {
    let result = await listingModel.find();
    return result;
}

async function findListingByLid(lid) {
    try {
        return await listingModel.findOne({ lid });
    } catch (error) {
        console.log(error);
        return undefined;
    }
}
export default router