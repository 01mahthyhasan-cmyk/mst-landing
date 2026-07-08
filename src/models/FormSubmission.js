import mongoose from 'mongoose';

const FormSubmissionSchema = new mongoose.Schema(
  {
    formType: { type: String, enum: ['contact', 'book_appointment'], required: true, index: true },
    status: { type: String, enum: ['new', 'read', 'archived'], default: 'new', index: true },
    // Contact form fields
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    message: { type: String, default: '' },
    // Appointment-specific fields
    service: { type: String, default: '' },
    ipAddress: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.FormSubmission ||
  mongoose.model('FormSubmission', FormSubmissionSchema);
