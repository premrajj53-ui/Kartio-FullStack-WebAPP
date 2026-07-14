const express = require ('express');
const path = require('path');
const cors = require ('cors');
const dotenv = require ('dotenv');
dotenv.config();
const connectDB = require('./config/db');

connectDB();
const app = express();
app.use(cors(
    {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('<h1 style="color: blue;">Kartio backend is running</h1>');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
const PORT = process.env.PORT || 5000;
// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', '/frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', '/frontend/build/index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});