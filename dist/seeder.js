import { Post } from "./models/Post.js";
import { User } from "./models/User.js";
import bcrypt from "bcryptjs";
import posts from './data.js';
import connectToDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
const importPosts = async () => {
    try {
        await connectToDB();
        let user = await User.findOne();
        if (!user) {
            const genSalt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("password123", genSalt);
            user = new User({
                username: "defaultUser",
                email: "default@example.com",
                password: hashedPassword,
            });
            await user.save();
            console.log('Default user created for seeding');
        }
        const postsWithUser = posts.map(post => ({
            ...post,
            user: user._id
        }));
        await Post.insertMany(postsWithUser);
        console.log('Posts imported successfully');
        process.exit();
    }
    catch (err) {
        console.error('Error importing posts', err);
        process.exit(1);
    }
};
const destroyPosts = async () => {
    try {
        await connectToDB();
        await Post.deleteMany();
        console.log('Posts destroyed successfully');
        process.exit();
    }
    catch (err) {
        console.error('Error destroying posts', err);
        process.exit(1);
    }
};
if (process.argv[2] === '-import') {
    importPosts();
}
else if (process.argv[2] === '-destroy') {
    destroyPosts();
}
//# sourceMappingURL=seeder.js.map