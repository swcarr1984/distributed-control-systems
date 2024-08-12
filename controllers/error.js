// Below is used to direct to the 404 HTML page if an error is encountered during navigation

exports.get404 = (req, res, next) => {
    res.status(404).render('404', {
   pageTitle: 'Page Not Found',
   path: '/404'
   });
};