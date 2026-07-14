const Product = require('../model/product');
const cloudinary = require('../config/cloudinary');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find(); 
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}
const getProductById = async (req,res)=>{
    try{
        const product =await Product.findById(req.params.id);
        if(product){
            res.json(product);

        }
        else{
                res.status(404).json({message: 'product not found'})
        }
    }
    catch{
        res.status(500).json({message:'server error'})
    }
}

const createProduct = async(req,res)=>{
    try{
    const {name,description,price,category,stock}= req.body;
    let imageUrl ='';
    if(req.file){
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
    }
    const product = new Product({
        name,
        description,
        price,
        category,
        stock,
        imageUrl
    });
    const savedaparoduct = await product.save()
    res.status(201).json({savedaparoduct})
}
catch(error){
    res.status(500).json({message:'server error'})
}
}

const updateProduct = async(req,res)=>{
    try{
        const {name,description,price,category,stock,imageUrl}= req.body;
     const product = await Product.findById(req.params.id);
    if(product){
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.stock = stock || product.stock;
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path);
            product.imageUrl = result.secure_url;
        }
        const updatedproduct = await product.save();
        res.json(updatedproduct);
    }
    else{
        res.status(404).json({message:'product not found'}) 
    }
}
    catch(error){
        res.status(500).json({message:'server error'})
    }
}
const deleteProduct = async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if(product){
            await product.deleteOne();
            res.json({message:'product removed'})
        }
        else{
            res.status(404).json({message:'product not found'})
        }
    }
   catch(error){
       res.status(500).json({message:'server error'})
   }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}

    
