const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['CUSTOMER', 'ADMIN'], required: true },
  senderName: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ticketSchema = new mongoose.Schema({
  ticketNumber: { type: String, required: true }, // e.g. "#TK-1001"
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  subject: { type: String, required: true },
  category: {
    type: String,
    enum: ['TECHNICAL_ISSUE', 'SUBSCRIPTION_BILLING', 'PRACTICE_FEEDBACK', 'GENERAL_INQUIRY'],
    default: 'TECHNICAL_ISSUE'
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  },
  status: {
    type: String,
    enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    default: 'OPEN'
  },
  messages: [messageSchema]
}, {
  timestamps: true
});

const Ticket = mongoose.model('Ticket', ticketSchema);

// Auto-drop legacy id_1 index if present
Ticket.collection.dropIndex('id_1').catch(() => {});

module.exports = Ticket;
