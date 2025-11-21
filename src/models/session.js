import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accessToken: { type: String, required: true, index: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true, index: true },
    refreshTokenValidUntil: { type: Date, required: true }, // убрали index: true
  },
  { timestamps: true },
);

sessionSchema.index({ refreshTokenValidUntil: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model('Session', sessionSchema);
