
const DEFAULT_IMAGE = process.env.DEFAULT_IMAGE;

const transformMonth = (month) => {
    if (!month) return null;

    return {
        title: month.month,
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