import express from "express";
import {listingModel, condition_vars, category_vars} from "../models/listing.js";
import sanitize from "mongo-sanitize";
const router = express.Router();

/* This function is called on the front page of the website and returns all listings based on a series of user defined
 * filters as query parameters as follows:
 *
 *      - title:      Searches if title contains keyword, case-insensitive.
 *      - claimed:    A 'True' value lists both claimed and unclaimed listings, otherwise, default is only unclaimed
 *                    listings.
 *      - condition:  Can be any number of the following: 'new', 'great', 'good', 'fair', 'poor'. Default is all
 *                    conditions. Multiple query parameters are separated by ','.
 *      - categories: Can be any number of the following: 'clothing', 'furniture', 'electronics', 'home', 'books',
 *                    'games', 'parts', 'outdoor', 'other'. Default is all categories. Multiple query parameters are
 *                    separated by ','.
 *      - sort:       Can be any number of the following: 'earliest', 'latest', 'title', 'location', 'condition',
 *                    'claimed'. Default is 'latest'. Multiple query parameters are separated by ','.
 *      - index:      Number of results shown. Default is 100.
 *      - offset:     Starting point of results shown. Default is 0.
 */
router.get("/", async (req, res) => {
    const title = req.query["title"];
    const claimed = req.query["claimed"];
    const condition = req.query["condition"]; // Internally represented in the db by 0:'new', 1:'great', 2:'good', 3:'fair', 4:'poor'.
    const categories = req.query["categories"];
    const sort = req.query["sort"];
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
        res.status(500).send("An error occurred in the server.");
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

/* This function returns all listings belonging to a user id */
router.get('/user/:id', async (req, res) => {
    const uid = req.params['id'];
    let result = await getLisingByUId(uid);
    if (result == undefined || result.length == 0) {
        res.status(404).send('Resource not found.');
    } else {
        res.status(200).send(result);
    }
})

/* This function adds a listing based on the listing template */
router.post("/", async (req, res) => {
    console.log(req.body);
    const listing = new listingModel(req.body);
    let result = await addListing(listing);
    if (result === undefined) {
        res.status(500).send("An error occurred in the server.");
    } else {
        res.status(201).send(listing);
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
        let conds = [];
        for (let s of sanitize(condition).split(','))
        {
            switch (s)
            {
                case 'new': conds.push('0');
                    break;
                case 'great': conds.push('1');
                    break;
                case 'good': conds.push('2');
                    break;
                case 'fair': conds.push('3');
                    break;
                case 'poor': conds.push('4');
                    break;
            }
        }
        match.push({$expr:{$in:[{$toString:'$details.condition'}, conds]}});
    }
    if(categories)
    {
        match.push({'details.categories':{$in: sanitize(categories).split(',')}});
    }
    //TODO:Add address verification and location here -- using an external tool almost certainly
    if(match.length > 0)
    {
        query = {$and: match};
    }

    /* These are all sort parameters */
    if(!sort)
    {
        sort_by['posted_date'] = -1;
    }
    else
    {
        for(let s of sanitize(sort).split(','))
        {
            if (s === 'earliest')
            {
                sort_by['details.posted_date'] = 1;
            }
            if (s === 'latest')
            {
                sort_by['details.posted_date'] = -1;
            }
            if (s === 'title')
            {
                sort_by['title'] = 1;
            }
            if (s === 'condition')
            {
                sort_by['details.condition'] = 1;
            }
            if (s === 'claimed')
            {
                sort_by['claimed'] = 1;
            }
        }
    }
    if(!sort_by.keys)
    {
        sort_by['posted_date'] = -1;
    }
    /* Other stuff */
    if(!index)
    {
        index = 100;
    }
    if(!offset)
    {
        offset = 0
    }
    if(!Number.isInteger(Number(index)) || !Number.isInteger(Number(offset)) || index < 0 || offset < 0)
    {
        throw new Error("index, offset must both be non-negative integer values")
    }
    let result = await listingModel.find(query).collation({locale:"en"}).sort(sort_by).skip(offset).limit(index);
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

async function getLisingByUId(uid) {
    try {
        return await listingModel.find({ user_id: uid });
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

async function addListing(listing) {
    try {
        return await listing.save();
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export default router
export {addListing};