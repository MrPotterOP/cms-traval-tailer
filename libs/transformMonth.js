
const DEFAULT_IMAGE = process.env.DEFAULT_IMAGE;

const transformMonth = (month) => {
    if (!month) return null;

    return {
        // capitalize first letter of month
        title: month.month.charAt(0).toUpperCase() + month.month.slice(1),
        heroImg: month.heroImg?.url || DEFAULT_IMAGE,
        highlight: month.highlight ? {
            title: month.highlight.title,
            brief: month.highlight.brief,
            imgUrl: month.highlight?.img?.formats?.large?.url || month.highlight?.img?.url || DEFAULT_IMAGE
        } : null,
    };
}


module.exports = {
    transformMonth
}