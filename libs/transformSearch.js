const DEFAULT_IMAGE = process.env.DEFAULT_IMAGE;


const serchCardBlog = (blog) => {
    return {
        title: blog.title,
        slug: blog.slug,
        imgUrl: blog.displayImg?.formats?.medium?.url || blog.displayImg?.url || DEFAULT_IMAGE
    }
}

const serchCardDestination = (destination) => {
    return {
        title: destination.title,
        slug: destination.slug,
        imgUrl: destination.displayImg?.formats?.medium?.url || destination.displayImg?.url || DEFAULT_IMAGE
    }
}

const serchCardExperience = (experience) => {
    return {
        title: experience.title,
        slug: experience.slug,
        imgUrl: experience.heroImg?.formats?.medium?.url || experience.heroImg?.url || DEFAULT_IMAGE
    }
}

const serchCardTour = (tour) => {
    return {
        title: tour.title,
        slug: tour.slug,
        imgUrl: tour.displayImg?.formats?.medium?.url || tour.displayImg?.url || DEFAULT_IMAGE
    }
}

module.exports = {
    serchCardBlog,
    serchCardDestination,
    serchCardExperience,
    serchCardTour
}