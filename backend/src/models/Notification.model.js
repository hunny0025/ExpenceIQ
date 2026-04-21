const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Notification must have a title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    message: {
      type: String,
      required: [true, 'Notification must have a message'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    type: {
      type: String,
      enum: ['budget_alert', 'budget_exceeded', 'expense_reminder', 'report_ready', 'system'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'info',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    // Optional reference to the related resource (e.g. which budget triggered the alert)
    relatedResource: {
      resourceType: {
        type: String,
        enum: ['Budget', 'Expense', 'Category', null],
        default: null,
      },
      resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
    },
    // For scheduled / future notifications
    scheduledAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null, // null = never expires
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common query patterns
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index — auto-delete expired docs

module.exports = mongoose.model('Notification', notificationSchema);
