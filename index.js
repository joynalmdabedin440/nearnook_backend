const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
    res.send("NearNook initialize")
})


const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.xwror.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const merchantCollection = client.db('nearNookDB').collection('merchantDetails')

        const productCollection = client.db('nearNookDB').collection('products');

        const cartCollection = client.db('nearNookDB').collection('cart');





        //Create Merchant account details

        app.post('/merchant', async (req, res) => {
            const newMerchant = req.body
            const result = await merchantCollection.insertOne(newMerchant)
            res.send(result)

        })

        // get merchant account details

        app.get('/merchant', async (req, res) => {
            const merchant = await merchantCollection.find().toArray()
            res.send(merchant)
        })

        //post a product details

        app.post("/addProduct", async (req, res) => {
            const newProduct = req.body
            const result = await productCollection.insertOne(newProduct)
            res.send(result)


        })

        //get Product
        app.get('/addProduct', async (req, res) => {
            const products = await productCollection.find().toArray()
            res.send(products)
        })

        //delete a product

        app.delete('/deleteProduct/:id', async (req, res) => {
            const { id } = req.params;  // Get the product ID from the URL

            try {
                // Convert the string ID to an ObjectId for MongoDB query
                const objectId = new ObjectId(id);

                // Delete the product from the collection
                const deletedProduct = await productCollection.deleteOne({ _id: objectId });

                if (deletedProduct.deletedCount > 0) {
                    res.json({ message: 'Product deleted successfully!' });
                } else {
                    res.status(404).json({ message: 'Product not found' });
                }
            } catch (error) {
                console.error('Error deleting product:', error);  // Log the error for debugging
                res.status(500).json({ message: 'Error deleting product' });
            }
        });

        // add to cart
        app.post('/addtocart', async (req, res) => {
            const newCart = req.body
            const result = await cartCollection.insertOne(newCart)
            res.send(result)

        })
        
        //get cart
        app.get('/getcart', async (req, res) => {
            const cart = await cartCollection.find().toArray()
            res.send(cart)
        })

        //delete cart item 
        app.delete('/deletecartitem/:id', async (req, res) => {
            const { id } = req.params;  // Get the product ID from the URL
            
            
            try {
                // Convert the string ID to an ObjectId for MongoDB query
                const objectId = new ObjectId(id);
                // Delete the product from the collection
                const deleteItem = await cartCollection.deleteOne({ _id: objectId });
                if (deleteItem.deletedCount > 0) {
                    res.json({ message: 'Product deleted successfully!' });
                } else {
                    res.status(404).json({ message: 'Product not found' });
                }
            } catch (error) {
                console.error('Error deleting product:', error);  // Log the error for debugging
                res.status(500).json({ message: 'Error deleting product' });
            }
        });
        
                



        




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

})