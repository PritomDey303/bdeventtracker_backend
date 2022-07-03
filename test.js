//mongoose pagination code
function pagination(req, res, next) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const query = {};
  if (req.query.name) {
    query.name = new RegExp(req.query.name, "i");
  }
  People.find(query)
    .skip(skip)
    .limit(limit)
    .exec((err, people) => {
      if (err) {
        return next(err);
      }
      People.count(query, (err, count) => {
        if (err) {
          return next(err);
        }
        res.json({
          people,
          page,
          limit,
          skip,
          count,
        });
      });
    });
}
