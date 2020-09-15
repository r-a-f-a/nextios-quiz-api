import mongoose, { Document, Model } from "mongoose";

export interface Props {
    [index: number]: string
}

export interface ComponentScript {
    props: Array<Props>;
    data: Function;
    created: Function;
    mounted: Function;
    computed: object;
    methods: object;
}

export interface Component {
    name: string;
    template: string;
    script: ComponentScript;
    style: string;
}

export interface Question {
    _id?: string;
    title: string;
    order: number;
    weight: number;
    status: boolean;
    component: Component;
}

const schema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        order: { type: Number, required: true },
        weight: { type: Number, required: true },
        status: { type: Boolean, default: true }, 
        component: {
            template: { type: String, required: true },
            name: { type: String, required: true },
            script: {
                props: { type: Array, required: false },
                data: { type: Function, required: false },
                created: { type: Function, required: false },
                mounted: { type: Function, required: false },
                computed: { type: Object, required: false },
                methods: { type: Object, required: false }
            },
            style: { type: String, required: true }
        }
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