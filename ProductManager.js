const fs = require('fs');

class ProductManager {
    #id = 0;
    constructor(path) {
        this.products = [];
        this.path = path;
    }


    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            this.products = await this.getProducts(); 

            const product = {
                id: this.#id++,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }

            this.products.find(product => product.code === code) ? console.error('No se puede repetir el código del producto') : this.products.push(product);

            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
            console.log('producto agregado');

            return product;
        } catch (error) {
            console.error('Error al agregar producto', error);
        }

    }

    async getProducts() {
        try {
            const products = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(products);
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    async getProductById(id) {
        try {
            this.products = await this.getProducts();
            const productFound = this.products.find(product => product.id === id)
            return productFound ? productFound : console.error('No se encontró ningún producto con el ID especificado', error);
        } catch (error) {
            console.error('Error al obtener producto por ID', error);
        }
    }

    async updateProduct(id, update) {
        try {
            this.products = await this.getProducts();
            const product = await this.getProductById(id);

            if (product) {
                //actualización de producto
                const updateProduct = {
                    ...product,
                    ...update,
                    id //id no se modifica
                }

                //actualización de la lista de productos
                const updateProducts = this.products.map(product => (product.id === id) ? updateProduct : product);

                await fs.promises.writeFile(this.path, JSON.stringify(updateProducts, null, '\t'));
                console.log('Producto actualizado!');

                return updateProduct;
            }
            else {
                console.error('No se encontró ningún producto con el ID especificado', error);
            }
        } catch (error) {
            console.error('Error al actualizar producto', error);
        }
    }

    async deleteProduct(id) {
        try {
            const product = await this.getProductById(id);

            if (product) {
                this.products = await this.getProducts();

                const products = this.products.filter(product => product.id != id);

                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
                console.log('Se elimino el producto!');
            }
            else {
                console.error('No se encontró producto con el ID especificado');
            }

        } catch (error) {
            console.error('Error al eliminar producto', error);
        }
    }
}



//pruebas
const manager = new ProductManager(`${__dirname}/products.json`); //nueva instancia 


const run = async () => {
    let products = await manager.getProducts();
    console.log(products) //retorna array vacío

    await manager.addProduct(
        'mesa',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel egestas dolor, nec dignissim metus.',
        65000,
        'imagen de mesa',
        'a1',
        50) //agrego el primer producto 

    products = await manager.getProducts();
    console.log(products); // muestro array con un producto agregado correctamente

    await manager.addProduct('silla',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel egestas dolor, nec dignissim metus.',
        25000,
        'imagen de silla',
        'a1',
        20); //no se agregará este producto por code repetido

    await manager.addProduct('escritorio',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel egestas dolor, nec dignissim metus.',
        52000,
        'imagen de escritorio',
        'a2',
        30);
    products = await manager.getProducts();
    console.log(products); //muestro array con dos productos agregados correctamente

    await manager.updateProduct(2, { price: 80000, stock: 60 });

    products = await manager.getProducts();
    console.log(products) //modificaciones aplicadas al producto "escritorio" con num de ID = 2.
    await manager.updateProduct(3, { price: 80000, stock: 60 }); //devuelve errores porque no existe ID

    await manager.addProduct('biblioteca',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel egestas dolor, nec dignissim metus.',
        89000,
        'imagen de biblioteca',
        'a3',
        30); //este producto nació para morir

    products = await manager.getProducts();
    console.log(products) //biblioteca aparece en el array

    await manager.deleteProduct(3); //muere producto biblioteca 
    
    products = await manager.getProducts();
        console.log(products) //f por biblioteca

}

run();