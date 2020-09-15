import mongoose, { Document, Model } from "mongoose";

export interface EventData {
    type: string; // START / RESPONSE
    questionId: mongoose.Types.ObjectId;
    response?: object;
}

export interface Event {
    _id?: string;
    data: EventData;
    createdAt: Date;
    updatedAt: Date;
}

const schema = new mongoose.Schema(
    {
        data: {
            type: { type: String, required: true },
            questionId: { type: mongoose.Types.ObjectId, required: false }
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