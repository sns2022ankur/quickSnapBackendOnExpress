const FolderModel = require("../models/Folder");
const { findByIdAndUpdate } = require("../models/Folder");
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
            const data = await ImageModel.find({ user: user }).sort({ _id: -1 })
            // console.log(data);
            res.status(201).json({
                success: true,
                data
            })
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err })
        }
    }

    static moveOrCopyImageToFolder = async(req,res) => {
        try{
            // console.log(req.body);
            const { user, folder, type } = req.body
            
            const folderData = await FolderModel.findOne({ _id: folder })
            // console.log(folderData);

            if (type == 'move') {
                var data = await ImageModel.findByIdAndUpdate(req.params.id, {
                    folder: folder
                })

                var dataSaved = data.save()
            }
            if (type == 'copy') {
                var image_ID = req.params.id
                const imageData = await ImageModel.findOne({ _id: image_ID })

                var data = new ImageModel({
                    user: user,
                    image: {
                        public_id: imageData.image.public_id,
                        url: imageData.image.url,
                    },
                    folder: folder,
                })

                var dataSaved = data.save()
            }

            if (dataSaved) {
                res.status(201).json({ 'status': 'success', 'message': `Image ${type == 'move' ? 'moved' : 'copied'} to ${folderData.folderName} Successfully!` })
            } else {
                res.status(401).json({ 'status': 'failed', 'message': 'Error!' }) 
            }
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err })
        }
    }

    static fetchFolderImages = async(req,res) => {
        try{
            // console.log(req.params.id);
            const folder = req.params.id
            const data = await ImageModel.find({ folder: folder }).sort({ _id: -1 })
            // console.log(data);
            res.status(201).json({
                success: true,
                data
            })
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err })
        }
    }

    static fetchQuickSnaps = async(req,res) => {
        try{
            // console.log(req.params.id);
            const user = req.params.id
            const data = await ImageModel.find({ user: user, folder: 'quickSnaps' }).sort({ _id: -1 })
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
            // console.log(user);
            // console.log(files);

            if (files.length >= 2) {
                // Iterate through each uploaded file
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];

                    if (file.size > 10485760) {
                        res.status(401).json({ 'status': 'failed', 'message': 'File Size is larger than 10MB!' })
                    } else {
                        // Upload the file to Cloudinary
                        var myCloud = await cloudinary.uploader.upload(file.tempFilePath,{
                            folder: 'quickSnapImages'
                        });

                        var data = new ImageModel({
                            user: user,
                            image: {
                                public_id: myCloud.public_id,
                                url: myCloud.secure_url,
                            },
                            folder: folder
                        })

                        var dataSaved = await data.save()
                    }
                }
            } else {
                if (files.size > 10485760) {
                    res.status(401).json({ 'status': 'failed', 'message': 'File Size is larger than 10MB!' })
                } else {
                    // Upload the file to Cloudinary
                    var myCloud = await cloudinary.uploader.upload(files.tempFilePath,{
                        folder: 'quickSnapImages'
                    });

                    var data = new ImageModel({
                        user: user,
                        image: {
                            public_id: myCloud.public_id,
                            url: myCloud.secure_url,
                        },
                        folder: folder
                    })

                    var dataSaved = await data.save()
                }
            }

            if (dataSaved) {
                res.status(201).json({ 'status': 'success', 'message': 'Image Saved Successfully!' })
            } else {
                res.status(401).json({ 'status': 'failed', 'message': 'Error!' }) 
            }
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err }) 
        }
    }

    static storeEditedImage = async(req,res) => {
        try{
            // console.log(req.body);
            // console.log(req.files);
            const {user, folder} = req.body
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
                },
                folder: folder
            })

            await data.save()
            res.status(201).json({ 'status': 'success', 'message': 'Image Saved Successfully!' })
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err }) 
        }
    }

    static deleteImage = async(req,res) => {
        try{
            const user = await ImageModel.findById(req.params.id)
            await cloudinary.uploader.destroy(user.image.public_id)
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