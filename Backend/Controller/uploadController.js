const {PutObjectCommand}=require("@aws-sdk/client-s3");
const s3=require("../Config/s3");

const uploadMedia = (req,res)=>{

    try{
        const file = req.file;
        if(!file){
            return res.status(400).json('File not found');
        }
        const key = `chat/${Date.now()}-${file.originalname}`;

        const command = new PutObjectCommand({
            Bucket: 'chat-media-storage',
            Key: key,
            Body: file.buffer,
            ContentType:file.mimetype
        });

        const url = `https://chat-media-storage.s3.ap-south-1.amazonaws.com/${key}`;

        await s3.send(command);
        res.status(200).json({success:true,url:url});

    }
    catch(err){
        res.status(500).json({success:false,message:err.message});
    }
}

module.exports = {uploadMedia};