const ImageModel = require("../models/Image")
var cloudinary = require('cloudinary').v2
cloudinary.config({ 
    cloud_name: 'dl0xatfdw', 
    api_key: '538458167534738', 
    api_secret: 'qJAOh_fWPOtJINYdmcsEoa9c2LM' 
});


class ImageController{

    static fetchImages = async(req,res) => {
        try{
            // console.log(req.params.id);
            const user = req.params.id
            const data = await ImageModel.find({ user: user })
            // console.log(data);
            res.status(201).json({
                success: true,
                data
            })
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err })
        }
    }

    static fetchEditedImages = async(req,res) => {
        try{
            // console.log(req.params.id);
            const user = req.params.id
            const data = await ImageModel.find({ user: user, folder: 'editedImages' })
            // console.log(data);
            res.status(201).json({
                success: true,
                data
            })
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err })
        }
    }

    static storeImage = async(req,res) => {
        try{
            const {user, folder} = req.body
            const files = req.files.image;
            console.log(user);
            console.log(files);

            // Iterate through each uploaded file
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
            
                // Upload the file to Cloudinary
                const myCloud = await cloudinary.uploader.upload(file.tempFilePath,{
                    folder: 'quickSnapImages'
                });

                var data = new ImageModel({
                    user: user,
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    },
                    folder: folder == '' ? '' : folder
                })

                await data.save()
            }
            res.status(201).json({ 'status': 'success', 'message': 'Image Saved Successfully!' })
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err }) 
        }
    }

    static storeEditedImage = async(req,res) => {
        try{
            // console.log(req.body);
            // console.log(req.files);
            const {user} = req.body
            const files = req.files.image;

            // Upload the file to Cloudinary
            const myCloud = await cloudinary.uploader.upload(files.tempFilePath,{
                folder: 'quickSnapImages'
            });

            var data = new ImageModel({
                user: user,
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                }
            })

            await data.save()
            res.status(201).json({ 'status': 'success', 'message': 'Image Saved Successfully!' })
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err }) 
        }
    }

    static deleteImage = async(req,res) => {
        try{
            const data = await ImageModel.findByIdAndDelete(req.params.id)

            if (data) {
                res.status(201).json({ 'status': 'success', 'message': 'Image Deleted Successfully!' })
            } else {
                res.status(401).json({ 'status': 'failed', 'message': 'Error, Try Again!' })
            }
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err })
        }
    }

}

module.exports = ImageController