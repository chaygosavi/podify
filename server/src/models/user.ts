import { Model, ObjectId, Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";

interface UserDocument {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  avatar?: {
    url: string;
    publicId: string;
  };
  tokens: string[];
  favorites: ObjectId[];
  followers: ObjectId[];
  followings: ObjectId[];
}

interface Methods {
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<UserDocument, {}, Methods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: Object,
      url: String,
      publicId: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Audio" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followings: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tokens: [String],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  console.log("this.password => ", this.password);
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
  console.log("[Modified] this.password => ", this.password);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  if (!password) return false;
  return await compare(password, this.password);
};

export default model("User", userSchema) as Model<UserDocument, {}, Methods>;
