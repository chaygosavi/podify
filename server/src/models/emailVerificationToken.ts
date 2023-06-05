import { Model, ObjectId, Schema, model } from "mongoose";

interface EmailVerificationTokenDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

const emailVerificationTokenSchema = new Schema<EmailVerificationTokenDocument>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      expires: 3600,
      default: Date.now(),
    },
  }
);

emailVerificationTokenSchema.pre("save", function (next) {
  this.token = this.token.replace(/ /g, "");
  next();
});

export default model(
  "EmailVerificationTokenSchema",
  emailVerificationTokenSchema
) as Model<EmailVerificationTokenDocument>;
