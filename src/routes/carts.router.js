import { Router } from 'express';
import { cartPath } from '../utils.js';
import fs from 'fs';
import CartManager from '../managers/cart.manager.js'
import { pid } from 'process';
const router = Router();


const cartManager = new CartManager(cartPath);

router.get('/:cid', async (req, res) => {
    try {
    const cartId = Number(req.params.cid);
    const cart = await cartManager.getCartById(cartId);
    res.status(200).send({status:"success", payload: cart});} 
    catch (error){
        return res.send({ status: 'error', error: error })
    }
});

router.post('/', async (req, res) => {
    try {
    const carts = await cartManager.getCarts();
    const carrito = {"products":[]};
    if (carts.length===0){
        carrito.id=1;
    } else {
        carrito.id=carts[carts.length-1].id+1;
    }  
    carts.push(carrito);
    cartManager.saveCarts(carts);
    res.status(200).send({ status: 'success', message: "cart created", payload: carrito });}
    catch (error){
            return res.send({ status: 'error', error: error })
        }
});
router.post('/:cid/product/:pid', async (req,res)=>{
    try{
    const carts = await cartManager.getCarts();
    const cartId = Number(req.params.cid);
    const productId = Number(req.params.pid);
    const cartById = carts.find(cart => cart.id === cartId);
    const indexProductInCart = cartById.products.findIndex(product=>product.id===productId);
    console.log("indexProductInCart",indexProductInCart);
    if (indexProductInCart!==-1){
        cartById.products[indexProductInCart]=cartById.products[indexProductInCart].quantity++;
    } else {
        cartById.products.push({"id":productId,"quantity":1});
    };
    console.log("cartById",cartById);
    console.log(carts);
    await cartManager.saveCarts(carts);
    } catch(error){
        return res.send({ status: 'error', error: error })
    }   
});

export default router;