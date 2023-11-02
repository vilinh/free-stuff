import userModel from "../models/user.js";
import {findUserByUid, addUser, removeUserByUid} from "../routes/user.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import user_example_data from './data/user_example_data.json';

dotenv.config();

// Please don't run tests on the production database...

let old_db_contents;

beforeAll(async () => {
    await mongoose.connect(process.env.LOCAL_DATABASE_URL).then(
        () => {
            console.log("Connected to server successfully!");
        }
    );
    old_db_contents = await userModel.find();
    await userModel.deleteMany();
    await userModel.insertMany(user_example_data);
});

test('find_user_by_uid', async () => {
    const user_to_add = {
        _id: "654403604232916bb96d3bde",
        __v: 0,
        display_name: "ft",
        email: "ft@cowpoly.edu",
        profile_pic: "foo",
        uid: "5021be76-9482-4cef-a125-fb57b249c68e"
    }
    await userModel.insertMany(user_to_add);
    let result = await findUserByUid("5021be76-9482-4cef-a125-fb57b249c68e")
    result = JSON.stringify(result);
    result = JSON.parse(result);

    await expect(result).toMatchObject(user_to_add);

    await userModel.findByIdAndDelete("654403604232916bb96d3bde");
});

test('remove_listing_by_uid', async () => {
    const user_to_delete =   {
        _id: "654403604232916bb96d3bde",
        __v: 0,
        display_name: "ft",
        email: "ft@cowpoly.edu",
        profile_pic: "foo",
        uid: "5021be76-9482-4cef-a125-fb57b249c68e"
    }
    await userModel.insertMany(user_to_delete);
    await removeUserByUid("5021be76-9482-4cef-a125-fb57b249c68e");
    let result = await userModel.find();
    result = JSON.stringify(result);
    result = JSON.parse(result);

    await expect(result).toMatchObject(user_example_data);

    await userModel.findByIdAndDelete("6542f9fa0963950be0cd43ea");
});

test('add_user', async () => {
    const user_to_add = {
        _id: "654403604232916bb96d3bde",
        __v: 0,
        display_name: "ft",
        email: "ft@cowpoly.edu",
        profile_pic: "foo",
        uid: "5021be76-9482-4cef-a125-fb57b249c68e"
    }
    await addUser(new userModel(user_to_add));
    let result = await userModel.find();
    result = JSON.stringify(result);
    result = JSON.parse(result);
    user_example_data.push(user_to_add)

    await expect(result).toMatchObject(user_example_data);

    user_example_data.pop();
    await userModel.findByIdAndDelete("6542f9fa0963950be0cd43ea");
});

afterAll(async () => {
    await userModel.deleteMany();
    await userModel.insertMany(old_db_contents);
    await mongoose.connection.close();
});
