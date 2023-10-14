const express = require('express')
const multer  = require('multer')
const router = express.Router()
const Auth = require('../middleware/Auth')
const UserController = require('../controllers/UserController')
const ImageController = require('../controllers/ImageController')
const FolderController = require('../controllers/FolderController')


//multer middleware
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');  // Destination folder where files will be stored
    //   cb(null, 'public/uploads/');  // Destination folder where files will be stored
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);  // Unique filename
    }
});

const upload = multer({ storage: storage });



//UserController
router.post('/userRegister',UserController.userRegister)
router.post('/userLogin',UserController.userLogin)
router.post('/logout',UserController.logout)
router.post('/sendOtp',UserController.sendOtp)
router.post('/verifyOtp',UserController.verifyOtp)
router.post('/resetPassword',UserController.resetPassword)


//ImageController
router.get('/fetchImages/:id',ImageController.fetchImages)
router.get('/fetchSingleImage/:id',ImageController.fetchSingleImage)
router.post('/moveOrCopyImageToFolder/:id',ImageController.moveOrCopyImageToFolder)
router.get('/fetchFolderImages/:id',ImageController.fetchFolderImages)
router.get('/fetchQuickSnaps/:id',ImageController.fetchQuickSnaps)
router.post('/storeImage',upload.array('file'),ImageController.storeImage)
router.post('/storeEditedImage',upload.single("file"),ImageController.storeEditedImage)
router.post('/storeFilteredImage',upload.single("file"),ImageController.storeFilteredImage)
router.get('/deleteImage/:id',ImageController.deleteImage)


//FolderController
router.get('/fetchFolders/:id',FolderController.fetchFolders)
router.post('/storeFolder',FolderController.storeFolder)
router.post('/updateFolder/:id',FolderController.updateFolder)
router.get('/deleteFolder/:id',FolderController.deleteFolder)




module.exports = router