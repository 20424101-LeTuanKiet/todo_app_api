import jwt from 'jsonwebtoken';

export default function auth(req, res, next){
    const accessToken = req.headers['x-access-token'];
    if(accessToken){
        try{
            const decoded = jwt.verify(accessToken, 'SECRET_KEY');
            // console.log(decoded);
            req.accessTokenPayload = decoded;
            next();
        } catch(err){
            console.error(err);
            return res.status(401).json({
                message: 'Invalid AccessToken.'
            })
        }
    } else{
        return res.status(401).json({
            message: 'AccessToken not found.'
        })
    }
}