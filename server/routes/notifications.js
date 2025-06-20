// routes/notifications.js
const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    db.query(
      'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50',
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch notifications' });
        }
        res.json(results);
      }
    );
  });

 router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM notifications WHERE id = ?', [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete notification' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      res.json({ message: 'Notification deleted successfully' });
    });
  });



  return router;
};
