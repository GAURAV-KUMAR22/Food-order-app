import express from 'express';
const app = express();
import cors from 'cors'
import cookieParser from 'cookie-parser'
import db from './Db/MongoDb.js';
import AuthRoutes from './Router/User.Router.js'
import ProductsRoute from './Router/Products.Router.js'
import CartRoutes from './Router/Cart.router.js'
import OrderRoutes from './Router/Order.route.js'
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'
import path from 'path';
import './Services/Cron/Resetqty.js';
import ProtectedRoute from './Service/ProtectedRoute.js';
import Product from './Model/Product.model.js';
dotenv.config();
const __Filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__Filename);

app.use(cors({
    origin: process.env.FRONTEND,
    methods: ['GET', 'POST', 'PATCH', 'PUT'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, '/uploads')))
db();

app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/products', ProtectedRoute, ProductsRoute);
app.use('/api/v1/carts', ProtectedRoute, CartRoutes);
app.use('/api/v1/orders', ProtectedRoute, OrderRoutes);


app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err); // Pass to default handler if response already sent
    }

    console.error("❌ Error caught by middleware:", err);

    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message || 'Unexpected error'
    });
});



app.listen(process.env.PORT, () => {
    console.log('server started')
});