const Ticket = require('../models/Ticket');
const { getSocketIO } = require('../config/socket');

/**
 * @desc    Get all support tickets
 * @route   GET /api/tickets
 * @access  Public / Admin
 */
const getTickets = async (req, res) => {
  try {
    const { status, priority, search, customerEmail } = req.query;
    let query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (priority && priority !== 'ALL') {
      query.priority = priority;
    }

    if (customerEmail) {
      query.customerEmail = customerEmail;
    }

    if (search) {
      query.$or = [
        { ticketNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await Ticket.find(query).sort({ updatedAt: -1, createdAt: -1 });

    res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single ticket with message thread
 * @route   GET /api/tickets/:id
 * @access  Public / Admin
 */
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Support ticket not found' });
    }
    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create new Support Ticket (Customer Flutter App)
 * @route   POST /api/tickets
 * @access  Public / Customer
 */
const createTicket = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      subject,
      category,
      priority,
      initialMessage
    } = req.body;

    const count = await Ticket.countDocuments();
    const ticketNumber = `#TK-${1000 + count + 1}`;

    const newTicket = new Ticket({
      ticketNumber,
      customerName: customerName || 'Valued User',
      customerEmail: customerEmail || 'user@aurayoga.com',
      subject: subject || 'General Support Inquiry',
      category: category || 'TECHNICAL_ISSUE',
      priority: priority || 'MEDIUM',
      status: 'OPEN',
      messages: [
        {
          sender: 'CUSTOMER',
          senderName: customerName || 'Valued User',
          text: initialMessage || 'I need help with my yoga practice session.',
          createdAt: new Date()
        }
      ]
    });

    try {
      await newTicket.save();
    } catch (saveErr) {
      if (saveErr.code === 11000) {
        await Ticket.collection.dropIndex('id_1').catch(() => {});
        await newTicket.save();
      } else {
        throw saveErr;
      }
    }

    // Broadcast new ticket event via Socket.io
    const io = getSocketIO();
    if (io) {
      io.emit('new_support_ticket', newTicket);
    }

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: newTicket
    });
  } catch (error) {
    console.error('Error in createTicket:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Reply to Support Ticket (Admin or Customer)
 * @route   POST /api/tickets/:id/reply
 * @access  Public / Admin / Customer
 */
const replyTicket = async (req, res) => {
  try {
    const { sender, senderName, text } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Support ticket not found' });
    }

    const newMessage = {
      sender: sender || 'ADMIN',
      senderName: senderName || (sender === 'CUSTOMER' ? ticket.customerName : 'AURA Support Team'),
      text: text || 'Thank you for reaching out to support.',
      createdAt: new Date()
    };

    ticket.messages.push(newMessage);
    
    // Automatically update status to IN_PROGRESS if open
    if (ticket.status === 'OPEN' && sender === 'ADMIN') {
      ticket.status = 'IN_PROGRESS';
    }

    await ticket.save();

    // Broadcast Real-Time Socket.io event for live chat update
    const io = getSocketIO();
    if (io) {
      io.emit('support_message_received', {
        ticketId: ticket._id,
        ticketNumber: ticket.ticketNumber,
        message: newMessage,
        status: ticket.status
      });
    }

    res.json({
      success: true,
      message: 'Reply posted successfully',
      data: ticket
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update Ticket Status (Admin)
 * @route   PUT /api/tickets/:id/status
 * @access  Admin
 */
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Support ticket not found' });
    }

    // Broadcast status update
    const io = getSocketIO();
    if (io) {
      io.emit('support_ticket_status_changed', {
        ticketId: ticket._id,
        status: ticket.status
      });
    }

    res.json({
      success: true,
      message: `Ticket status updated to ${status}`,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete Support Ticket (Admin)
 * @route   DELETE /api/tickets/:id
 * @access  Admin
 */
const deleteTicket = async (req, res) => {
  try {
    const deleted = await Ticket.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Support ticket not found' });
    }
    res.json({ success: true, message: 'Support ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  replyTicket,
  updateTicketStatus,
  deleteTicket
};
