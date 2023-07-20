const FolderModel = require("../models/Folder")

class FolderController{

    static fetchFolders = async(req,res) => {
        try{
            // console.log(req.params.id);
            const user = req.params.id
            const data = await FolderModel.find({ user: user })
            // console.log(data);
            res.status(201).json({
                success: true,
                data
            })
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err })
        }
    }

    static storeFolder = async(req,res) => {
        try{
            // console.log(req.body);
            // console.log(req.files);
            const {user, folderName} = req.body

            var data = new FolderModel({
                user: user,
                folderName: folderName,
            })

            await data.save()
            res.status(201).json({ 'status': 'success', 'message': 'Folder Saved Successfully!' })
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err }) 
        }
    }

    static updateFolder = async(req,res) => {
        try{
            // console.log(req.body);
            // console.log(req.files);
            const {folderName} = req.body

            var data = await FolderModel.findByIdAndUpdate(req.params.id, {
                folderName: folderName,
            })

            await data.save()
            res.status(201).json({ 'status': 'success', 'message': 'Folder Updated Successfully!' })
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err }) 
        }
    }

    static deleteFolder = async(req,res) => {
        try{
            const data = await FolderModel.findByIdAndDelete(req.params.id)

            if (data) {
                res.status(201).json({ 'status': 'success', 'message': 'Folder Deleted Successfully!' })
            } else {
                res.status(401).json({ 'status': 'failed', 'message': 'Error, Try Again!' })
            }
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err })
        }
    }

}

module.exports = FolderController