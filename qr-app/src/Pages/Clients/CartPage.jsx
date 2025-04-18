import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { incrementCart, removeFromCart, onload } from '../../Redux/Cart';
import axios from 'axios';

export const CartPage = () => {
    const cartstate = useSelector((state) => state.cart.cartItems);

    const [cart, setCart] = useState([])
    // console.log(cartstate)
    const dispatch = useDispatch();
    console.log("cart", cart)

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartstate))
    }, [cartstate]);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            dispatch(onload(JSON.parse(savedCart)))
        }
    }, [dispatch]);

    const total = Array.isArray(cartstate)
        ? cartstate.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0)
        : 0;


    function handleMinusQuanity(id) {
        dispatch(removeFromCart(id))
    }

    function handlePlusQuantity(id) {
        dispatch(incrementCart(id))
    }


    const transformedCart = cartstate.map(item => ({
        productId: item._id,
        quantity: item.quantity
    }));



    async function handleCartAndOrder() {
        try {
            const responce = await axios.post('http://localhost:5000/api/v1/carts/add-cart', { items: transformedCart }, { withCredentials: true });
            if (responce.statusText === 'OK') {
                setCart(responce.data.content)
            }

        } catch (error) {
            throw new Error({ message: 'reponce failed', error })
        }

    }



    return (
        <div className='order-container'>
            <div className='item-cards flex justify-between'>
                <Link className='flex' to={'/'}>
                    <img src='/assets/back.png' alt='back' />
                    <span> MyCart </span>
                </Link>
                <Link to={'/'} className='flex'>
                    <img src='/assets/plus.png' alt='plus' width={20} height={20} />
                    Add Item
                </Link>
            </div>
            <div className='orderDetils'>
                {Array.isArray(cartstate) && cartstate.map((item) => (
                    <>
                        <div className='order-detils-card '>
                            <div className='left'>
                                <h4>{item.name}</h4>
                                <p>{item.description}</p>
                                <b>Rs. {item.price}</b>
                            </div>
                            <div className='right'>
                                <img src='/assets/pizza.png' alt='pizza' />
                                <div className='order-quantityBtn'>
                                    <button onClick={() => handleMinusQuanity(item._id)}> <img src='/assets/minus.png' alt='minus' /></button>
                                    {item.quantity}
                                    <p>{item.qty}</p>
                                    <button onClick={() => handlePlusQuantity(item._id)}><img src='/assets/plus.png' alt='plus' /></button>
                                </div>
                            </div >
                        </div>

                    </>
                ))}
            </div>
            <div className='' >
                <div className='order-calc'>
                    <div>
                        <p>SubTotel</p>
                        <b>{total}</b>
                    </div>
                    <div>
                        <p>Discount</p>
                        <b>0%</b>
                    </div>
                    <div>
                        <p>Texex</p>
                        <b>0%</b>
                    </div>
                    <div>
                        <p>Totel</p>
                        <b>Rs. {total}</b>
                    </div>
                </div>
                <Link to={`/bill`} onClick={handleCartAndOrder} className='order-btn items-center flex justify-center ' >Place Orders</Link >
            </div>

        </div >
    )
}
