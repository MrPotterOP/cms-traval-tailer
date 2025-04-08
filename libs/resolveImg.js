const DEFAULT_IMG = process.env.DEFAULT_IMG;


const resolveImg = (url) =>{
    if(url.includes('http://') || url.includes('https://')){
        return url;
    }else if(url.startsWith('/')){

    }
}


module.exports = resolveImg;