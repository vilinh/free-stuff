import express from "express";
import {listingModel, condition_vars, category_vars} from "../models/listing.js";
import sanitize from "mongo-sanitize";
const router = express.Router();

/* This function is called on the front page of the website and returns all listings based on a series of user defined
 * filters as query parameters.
 *
 * TODO:I am unsure if passing an address as a query parameter may be a security concern. Can
 * potentially be a POST call if this is the case. */
router.get("/", async (req, res) => {
    const title = req.query["title"];
    const claimed = req.query["claimed"];  //a 'True' value lists both claimed and unclaimed listings', otherwise, default is only unclaimed listings.
    const condition = req.query["condition"];  //I'm going to use ',' to demarcate multiple query parameters.
    const categories = req.query["categories"];  //I'm going to use ',' to demarcate multiple query parameters.
    const sort = req.query["sort"]; //Can be 'earliest', 'latest', 'title' (alphabetical), 'location', 'condition', 'claimed', defaults to 'latest'
    const index = req.query["index"];
    const offset = req.query["offset"];

    //TODO:Not operational yet, but will be
    const location = req.query["location"];
    const radius = req.query["radius"];

    try {
        const result = await getListings(title, claimed, condition, categories, location, radius, sort, offset, index);
        res.send({listings: result });
    } catch (error) {
        console.log(error);
        res.status(500).send("An error ocurred in the server.");
    }
});

/* This function returns a listing given a listing id */
router.get('/:id', async (req, res) => {
    const id = req.params['id'];
    let result = await findListingById(id);
    if (result == undefined || result.length == 0) {
        res.status(404).send('Resource not found.');
    } else {
        res.status(200).send(result);
    }
});

/* This function adds a listing based on the listing template */
router.post("/", async (req, res) => {
    try {
        const listing = new listingModel(req.body);
        await listing.save();
        res.status(201).send(userToAdd)
    } catch (error) {
        console.log(error)
    }
});

async function getListings(title, claimed, condition, categories, location, radius, sort, offset, index) {
    let query = {};
    let match = [];
    let sort_by = {};

    /* These are all query filters */
    if(title && title !== "")
    {
        match.push({title: new RegExp(sanitize(title), 'i')});
    }
    if(claimed)
    {
        match.push({claimed: claimed});
    }
    else
    {
        match.push({claimed: false});
    }
    if(condition)
    {
        match.push({$in: sanitize(condition).split(',')});
    }
    if(categories)
    {
        match.push({$in: sanitize(categories).split(',')});
    }
    //TODO:Add address verification and location here -- using an external tool almost certainly
    if(match.length > 0)
    {
        query = {$and: match};
    }

    /* These are all sort parameters */
    if(!sort)
    {
        sort_by['Date'] = -1;
    }
    else
    {
        for(s of sanitize(condition).split(','))
        {
            if (s === 'earliest')
            {
                sort_by['Date'] = 1;
            }
            if (s === 'latest')
            {
                sort_by['Date'] = -1;
            }
            if (s === 'title')
            {
                sort_by['title'] = 1;
            }
            //TODO:location
            //TODO:condition
            //TODO:claimed
            else
            {
                return {};
            }
        }
    }

    let result = await listingModel.find(query)//.sort(sort_by).skip(offset).limit(index);
    return result;
}

router.delete('/:id', async  (req, res) => {
    const id = req.params['id'];
    const result = await deleteListingById(id);
    if (result === undefined)
        res.status(404).send('Resource not found.');
    else {
        res.status(204).end();
    }
});

async function deleteListingById(id) {
    try {
        return await listingModel.findByIdAndDelete(id);
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

async function findListingById(id) {
    try {
        return await listingModel.findById(id);
    } catch (error) {
        console.log(error);
        return undefined;
    }
}
export default router;