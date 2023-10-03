import { Router } from 'express';
import { productPath } from '../utils.js';
import fs from 'fs';
const router = Router();

import ProductManager from '../managers/product.manager.js';
import { pid } from 'process';
const productManager= new ProductManager(productPath);

router.get('/', async (req, res) => {
    try{
    const products = await productManager.getProducts();
    const limite = Number(req.query.limit);
    if(!limite || limite>products.length||limite<=0)
    return res.status(200).send({status: "success", payload:products});
    return res.status(200).send({status: "success", payload: products.slice(0,limite)});}
    catch(error) {return res.send({ status: 'error', error: error })}
});

router.get('/:pid', async (req, res) => {
    try {
    const productId = Number(req.params.pid);
    const producto = await productManager.getProductById(productId);
    res.status(200).send({status:"success", payload: producto});} 
    catch (error){
        return res.send({ status: 'error', error: error })
    }
});

router.delete('/:pid', async (req, res) => {
    try{
    const productId = Number(req.params.pid);
    const products = await productManager.getProducts();
    const productIndex = products.findIndex(producto => producto.id === productId);
    if (productIndex===-1){
        return res.status(400).send({status: "error", error: "Product not found!!"});
                };
    const producto = await productManager.deleteProduct(productId);
    res.status(200).send({status:"success", message: "product deleted", payload: producto});}
    catch (error){
        return res.send({ status: 'error', error: error })
    }
});

router.post('/', async (req, res) => {
    try {
    const product = req.body;
    if(!product.title || !product.description || !product.price || !product.code || !product.category || !product.stock ||!product.status){
        return res.status(400).send({ status: 'error', error: 'Incomplete values' });
    }
    
    const products = await productManager.getProducts();
    const productIndex = products
            .findIndex(producto => producto.code === product.code);
        if (productIndex!==-1){
            return res.status(400).send({status: "error", error: "El producto ya existe!!"});
        } 
        const productCreated=await productManager.addProduct(product);      
        //products.length===0? (product.id=1) : (product.id=products[products.length-1].id+1);
        //products.push(product);
        //productManager.saveProducts(products);
        res.status(200).send({ status: 'success', message: "product created", payload: productCreated });}
        catch (error){
            return res.send({ status: 'error', error: error })
        }
});

router.put('/:pid', async (req, res) => {
    try{
    const product = req.body;
    const productId = Number(req.params.pid);
    if(!product.title || !product.description || !product.price || !product.code || !product.category || !product.stock ||!product.status){
        return res.status(400).send({ status: 'error', error: 'Incomplete values' });
    }

    const products = await productManager.getProducts();
    const productIndex = products
            .findIndex(producto => producto.id === productId);
        if (productIndex===-1){
            return res.status(404).send({status: "error", error: "Product not found!!"});
        }
        const newProduct = { id: productId, ...product }
        products[productIndex] = newProduct;
        productManager.saveProducts(products);
        //await fs.promises.writeFile(productPath, JSON.stringify(products, null, '\t'));
        res.status(200).send({ status: 'success', message: 'Product updated', payload:product });}
        catch (error){
            return res.send({ status: 'error', error: error })
        } 
});


export default router;