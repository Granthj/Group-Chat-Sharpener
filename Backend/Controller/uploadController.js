const {PutObjectCommand,GetObjectCommand}=require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3=require("../Config/s3");
const uploadMedia = async (req,res)=>{

    try{
        const file = req.file;
        if(!file){
            return res.status(400).json('File not found');
        }
        const safeFileName = file.originalname.replace(/\s+/g, '_');
        const key = `chat/${Date.now()}-${safeFileName}`;
        const bucketName = 'sharpener-media-storage-s3'
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: file.buffer,
            ContentType:file.mimetype
        });

        const url = `https://chat-media-storage.s3.ap-south-1.amazonaws.com/${key}`;

        await s3.send(command);
        const getCommand = new GetObjectCommand({
            Bucket:bucketName,
            Key:key
        });
        const secureViewUrl = await getSignedUrl(s3,getCommand,{expiresIn:3600});   


        res.status(200).json({success:true,url:secureViewUrl});

    }
    catch(err){
        console.log(err,'from uploadController')
        res.status(500).json({success:false,message:err.message});
    }
}

module.exports = {uploadMedia};