import { Schema } from "mongoose";

const PostSchema = new Schema(
  {
    author: String,
    title: String,
    content: String,
  },
  {
    timestamps: true,
  }
);

export default PostSchema;