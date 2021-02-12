import axios from 'axios';
import qs from 'querystring';

export const apiGETRequest = async (res, url, query = {}) => {

    try{

        const {data} = await axios.get(`${url}?${qs.encode(query)}`, {
            headers: {
                'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
            }
        });

        return res.json(data);

    } catch(e) {

        // console.log(e);

        return res.status(400).json({
            ...e.response.data
        });

        
    }

}

export const apiPOSTRequest = async (res, url, body) => {

    try{

        const {data} = await axios.post(url, body, {
            headers: {
                'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
            }
        });

        return res.json(data);

    } catch(e) {

        // console.log(e);

        return res.status(400).json({
            ...e.response.data
        });

        
    }

}

export const apiPUTRequest = async (res, url, body) => {

    try{

        const {data} = await axios.put(url, body, {
            headers: {
                'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
            }
        });

        return res.json(data);

    } catch(e) {

        // console.log(e);

        return res.status(400).json({
            ...e.response.data
        });

        
    }

}

export const apiPOST = async (url, body) => {

    try{

        return await axios.post(url, body, {
            headers: {
                'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
            }
        });

    } catch(e) {

        throw e;

        
    }

}