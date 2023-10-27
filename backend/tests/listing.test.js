import faker from "@faker-js";
import listingModel from "../models/listing.js";
import mongoose from "mongoose";

//TODO: This, still
test('create_new_listing', () => {
    const test_to_add =
        {
            title: faker.buzz_noun,
            user_id: 0, //for integration testing, we may want to also add a fake user at some point
            claimed: false,
            claim_queue: [],
            details: {
                quantity: faker.number(),
                condition: faker.helpers.arrayElement(listingModel.condition_vars),
                categories: {
                    type: faker.helpers.arrayElement(listingModel.category_vars),
                },
                posted_date: {
                    type: Date,
                    default: Date.now,
                },
                address: {
                    type: String,
                },
            },
            description: {
                type: String,
                required: false,
            },
            image: {
                type: String,
            },
        }
});
