const express = require('express')
const router = express.Router()
const Auth = require('../middleware/Auth')
const UserController = require('../controllers/UserController')
const ImageController = require('../controllers/ImageController')
const FolderController = require('../controllers/FolderController')



//UserController
router.post('/userRegister',UserController.userRegister)
router.post('/userLogin',UserController.userLogin)
router.post('/logout',UserController.logout)
router.post('/sendOtp',UserController.sendOtp)
router.post('/verifyOtp',UserController.verifyOtp)
router.post('/resetPassword',UserController.resetPassword)


//ImageController
router.get('/fetchImages/:id',ImageController.fetchImages)
router.post('/moveOrCopyImageToFolder/:id',ImageController.moveOrCopyImageToFolder)
router.get('/fetchFolderImages/:id',ImageController.fetchFolderImages)
router.get('/fetchQuickSnaps/:id',ImageController.fetchQuickSnaps)
router.post('/storeImage',ImageController.storeImage)
router.post('/storeEditedImage',ImageController.storeEditedImage)
router.get('/deleteImage/:id',ImageController.deleteImage)


//FolderController
router.get('/fetchFolders/:id',FolderController.fetchFolders)
router.post('/storeFolder',FolderController.storeFolder)
router.post('/updateFolder/:id',FolderController.updateFolder)
router.get('/deleteFolder/:id',FolderController.deleteFolder)




module.exports = router