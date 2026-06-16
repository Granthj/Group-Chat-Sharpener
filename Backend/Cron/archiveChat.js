const cron = require('node-cron');
const { Op } = require('sequelize');

const Message = require('../Model/messageSchema.js');
const ArchivedChat = require('../Model/archiveChatSchema.js');

cron.schedule('0 2 * * *', async()=>{

    try{
        const oldMessages = await Message.findAll({

            where:{
                createdAt:{

                    [Op.lt]:new Date(Date.now() - 24*60*60*1000)
                }
            }
        });

        if(oldMessages.length === 0){

            console.log("No messages to archive");

            return;
        }
        await ArchivedChat.bulkCreate(oldMessages.map(msg=>msg.toJSON()));
        await Message.destroy({

            where:{
                createdAt:{
                    [Op.lt]:new Date(Date.now() - 24*60*60*1000)
                }
            }
        });
        console.log(`${oldMessages.length} messages archived`);
    }

    catch(err){
        console.log("Archive error:",err);
    }
});