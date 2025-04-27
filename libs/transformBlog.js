const DEFAULT_IMAGE = process.env.DEFAULT_IMAGE;

const transformBlog = (blog) => {
    if (!blog) return null;

    const author = () =>{
        if(blog.author){
            return blog.author
        }
        else if(blog.createdBy){
            return `${blog.createdBy?.firstname} ${blog.createdBy?.lastname}`
        }else {
            return "Admin - Travel Tailor"
        }
    }

    return {
        title: blog.title,
        description: blog.description,
        displayImg: blog.displayImg?.formats?.large?.url || blog.displayImg?.url || DEFAULT_IMAGE,
        body: blog.body,
        seo: {
            metaTitle: blog.seo?.metaTitle || blog.title,
            metaDescription: blog.seo?.metaDescription || blog.description,
            shareImage: blog.seo?.shareImage?.url || blog.displayImg?.formats?.large?.url || blog.displayImg?.url || DEFAULT_IMAGE
        },
        author: author(),
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt || blog.createdAt,
        slug: blog.slug,
    };
}

module.exports = {
    transformBlog
};