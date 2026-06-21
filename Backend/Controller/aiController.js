const model = require('../Config/gemini.js');

const predictiveReply = async (req, res) => {

    try {

        const { text } = req.body;

        const prompt = `
            Suggest next words or phrases.

            Rules:
            - only 3 suggestions
            - short
            - conversational

            Text:
            ${text}

            Return only JSON array.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        res.json({suggestions:JSON.parse(response)});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Predictive Ai failed"});
    }
}

const smartReply = async (req,res)=>{

    const {message} = req.body;

    const prompt=`

    Generate 3 short replies.

    Message:
    ${message}


    Return only JSON array.

`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({replies:JSON.parse(response)});
}

module.exports = {
    predictiveReply,
    smartReply
}