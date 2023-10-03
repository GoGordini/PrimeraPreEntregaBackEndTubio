import fs from 'fs';

export default class ProductManager {

    constructor(path){
        this.path=path;
    }

    getProducts = async ()=> {
        try {
                if (fs.existsSync(this.path)) {
                    const data = await fs.promises.readFile(this.path, 'utf-8');
                    const products = JSON.parse(data);
                    return products;
                } else {
                    return [];
                }
            } catch (error) {
                return res.status(500).send({ status: 'error', error: error });
            }
        }
    
        // updateProduct=async (id_a_actualizar,campo,nuevoValor)=>{
        //     try{
        //         const products = await this.getProducts();
        //         const productIndex = products.findIndex(producto => producto.id === id_a_actualizar);
        //         if (productIndex===-1){
        //             console.log("¡Producto no encontrado!");
        //             return;
        //         };
        //         products[productIndex][campo]=nuevoValor;
        //         await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        //         return products[productIndex];
        //     } catch (error) {
        //         return res.status(500).send({ status: 'error', error: error });
        //     }
        //         };
    deleteProduct=async (id_a_eliminar)=>{
            try{
                const products = await this.getProducts();
                const productIndex = products.findIndex(producto => producto.id === id_a_eliminar);
                // if (productIndex===-1){
                //     return res.status(400).send({status: "error", error: "Product not found!!"});
                // };
                const productoEliminado=products.splice(productIndex,1);
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
                return productoEliminado;
            } catch (error) {
                return res.status(500).send({ status: 'error', error: error });
            }
                };
    getProductById=async (id_buscada)=>{
        try{
            const products = await this.getProducts();
            const product_found=products.find((producto) => producto.id===id_buscada)??"¡Producto no encontrado!";
            return product_found;
        } catch (error) {
            return res.status(500).send({ status: 'error', error: error });        }
            };

    addProduct = async (product) => {
        try{
        const products = await this.getProducts();
        products.length===0? (product.id=1) : (product.id=products[products.length-1].id+1);
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return product;

    } catch (error) {
        return res.status(500).send({ status: 'error', error: error });
    }
    }

    saveProducts = async (products) =>{
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        } catch (error){
            return res.status(500).send({ status: 'error', error: error });
        }
    }
}