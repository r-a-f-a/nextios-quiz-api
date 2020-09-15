import mongoose, { Document, Model } from "mongoose";

export interface Question {
    _id?: string;
    title: string;
    order?: number;
    component: object;
    status: boolean;
}

const schema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        order: { type: Number, required: false },
        component: {
            name: { type: String, required: true },
            data: { type: Object, required: true },
            created: { type: Object, required: true },
            mounted: { type: Object, required: true }
        },
        status: Boolean
    },
    {
        timestamps: true,
        collection: 'questions',
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);

interface QuestionModel extends Omit<Question, '_id'>, Document {}

export const Question: Model<QuestionModel> = mongoose.model('Question', schema);