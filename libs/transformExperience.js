
const DEFAULT_IMAGE = process.env.DEFAULT_IMAGE;

const transformExperience = (experience) => {
    if (!experience) return null;

    return {
        title: experience.title,
        heroImg: experience.heroImg?.formats.large?.url || experience.heroImg?.url || DEFAULT_IMAGE,
        slug: experience.slug,
        highlight: experience.highlight ? {
            title: experience.highlight.title,
            brief: experience.highlight.brief,
            imgUrl: experience.highlight.img?.formats.large?.url || experience.highlight.img?.url || DEFAULT_IMAGE 
        } : null,
    };
}


module.exports = {
    transformExperience
}