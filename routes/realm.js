/*
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Zombie MMO' , realm: req.params.realm});
}