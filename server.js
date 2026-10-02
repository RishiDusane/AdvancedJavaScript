const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Rishi@2830',
  database: 'UrlManager',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
};

const pool = mysql.createPool(dbConfig);

async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        url VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    connection.release();
    console.log('Database ready');
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    process.exit(1);
  }
}

function normalizeBookmark(row) {
  return {
    _id: row.id,
    id: row.id,
    title: row.title,
    url: row.url,
    created_at: row.created_at,
  };
}

app.get('/api/bookmarks', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookmarks ORDER BY created_at DESC');
    res.json(rows.map(normalizeBookmark));
  } catch (error) {
    console.error('GET /api/bookmarks failed:', error.message);
    res.status(500).json({ message: 'Failed to fetch bookmarks' });
  }
});

app.post('/api/bookmarks', async (req, res) => {
  const { title, url } = req.body;

  if (!title || !url) {
    return res.status(400).json({ message: 'Title and URL are required' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO bookmarks (title, url) VALUES (?, ?)',
      [title, url]
    );

    const [rows] = await pool.execute('SELECT * FROM bookmarks WHERE id = ?', [result.insertId]);
    const bookmark = rows[0];
    return res.status(201).json(normalizeBookmark(bookmark));
  } catch (error) {
    console.error('POST /api/bookmarks failed:', error.message);
    return res.status(500).json({ message: 'Failed to create bookmark' });
  }
});

app.put('/api/bookmarks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, url } = req.body;

  if (!title || !url) {
    return res.status(400).json({ message: 'Title and URL are required' });
  }

  try {
    await pool.execute('UPDATE bookmarks SET title = ?, url = ? WHERE id = ?', [title, url, id]);
    const [rows] = await pool.execute('SELECT * FROM bookmarks WHERE id = ?', [id]);

    if (!rows.length) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    return res.json(normalizeBookmark(rows[0]));
  } catch (error) {
    console.error('PUT /api/bookmarks/:id failed:', error.message);
    return res.status(500).json({ message: 'Failed to update bookmark' });
  }
});

app.delete('/api/bookmarks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute('DELETE FROM bookmarks WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    return res.status(200).json({ message: 'Bookmark deleted' });
  } catch (error) {
    console.error('DELETE /api/bookmarks/:id failed:', error.message);
    return res.status(500).json({ message: 'Failed to delete bookmark' });
  }
});

app.listen(PORT, async () => {
  await initDatabase();
  console.log(`Server running at http://localhost:${PORT}`);
});
