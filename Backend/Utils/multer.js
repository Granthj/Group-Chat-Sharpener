const multer = require('multer');
const storage = multer.memoryStorage();

const fileFilter = (req,file,cb)=>{

    const allowedTypes = [


        // images
        'image/jpeg',
        'image/png',
        'image/gif',

        // videos
        'video/mp4',
        'video/webm',

        // documents
        'application/pdf',

        // common files
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

    ];

    if(allowedTypes.includes(file.mimetype)){
        cb(null,true);
    }
    else{
        cb(
            new Error('File type not allowed'),
            false
        );
    }

};

const upload = multer({

    storage,
    limits:{
        fileSize:50 * 1024 * 1024 // 50MB
    },
    fileFilter

});

module.exports = upload;