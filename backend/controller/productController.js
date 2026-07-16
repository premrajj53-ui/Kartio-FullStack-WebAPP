const Product = require('../model/product');
const cloudinary = require('../config/cloudinary');

const getProducts = async (req, res) => {
    try {
        console.log("1. FULL REQUEST URL:", req.originalUrl);
        console.log("2. WHAT NODE HEARS AS KEYWORD:", req.query.keyword);
    
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i' 
            }
        } : {};

        const products = await Product.find({ ...keyword }); 
        
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

const getProductById = async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
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

        // --- NEW CLOUDINARY UPLOAD LOGIC ---
        if(req.file){
            // 1. Convert the memory buffer into a Base64 string
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            
            // 2. Upload the Base64 string directly
            const result = await cloudinary.uploader.upload(dataURI);
            imageUrl = result.secure_url;
        }
        // -----------------------------------

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
    // --- NEW CATCH BLOCK TO EXPOSE ERRORS ---
    catch(error){
        console.error("Upload Error:", error);
        res.status(500).json({
            message: error.message || 'server error',
            errorDetails: error
        })
    }
    // ----------------------------------------
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
                // 1. Convert the memory buffer into a Base64 string
                const b64 = Buffer.from(req.file.buffer).toString("base64");
                let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
                
                // 2. Upload the Base64 string to Cloudinary
                const result = await cloudinary.uploader.upload(dataURI);
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
        console.error("Update Error:", error);
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