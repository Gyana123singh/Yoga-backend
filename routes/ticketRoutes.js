const express = require('express');
const router = express.Router();
const {
  getTickets,
  getTicketById,
  createTicket,
  replyTicket,
  updateTicketStatus,
  deleteTicket
} = require('../controllers/ticketController');

router.get('/', getTickets);
router.get('/:id', getTicketById);
router.post('/', createTicket);
router.post('/:id/reply', replyTicket);
router.put('/:id/status', updateTicketStatus);
router.delete('/:id', deleteTicket);

module.exports = router;
