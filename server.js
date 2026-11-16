require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`API lista en puerto ${PORT}`));