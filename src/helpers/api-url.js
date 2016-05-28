module.exports = function(options) {
  // options.fn(this) = Handelbars content between {{#bold}} HERE {{/bold}}
  var bolder = '<strong>' + options.fn(this) + '</strong>';
  return "http://localhost:4000/api/v1" + options.fn(this);
}