// En un archivo separado, por ejemplo, userActivationModel.js
import mongoose from 'mongoose';

const userActivationSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        unique: true,
    },
    pass: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['usuario', 'admin'],
    },
});

const UserActivation = mongoose.model('UserActivation', userActivationSchema);

export default UserActivation;
