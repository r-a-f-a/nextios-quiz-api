import mongoose, { Document, Model } from "mongoose";

export interface Event {
    _id?: string;
    type: string; // QUIZ_STARTED / QUESTION_STARTED / QUESTION_ANSWERED / QUIZ_FINISHED
    userId: mongoose.Types.ObjectId,
    data?: Object;
    createdAt: Date;
    updatedAt: Date;
}

const schema = new mongoose.Schema(
    {
        type: { type: String, required: true },
        userId: { type: mongoose.Types.ObjectId, required: true },
        data: {
            question: { type: Object, required: false },
            response: { type: Object, required: false }
        }
    },
    {
        timestamps: true,
        collection: 'events',
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);

interface EventModel extends Omit<Event, '_id'>, Document {}

export const Event: Model<EventModel> = mongoose.model('Event', schema);