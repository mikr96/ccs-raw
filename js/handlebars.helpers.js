Handlebars.registerHelper("date", function (timestamp) {
  return moment(timestamp).format('DD MMMM YYYY')
});

Handlebars.registerHelper("printRegion", function ({
  data
}) {
  const {
    oper,
    regions
  } = data.root
  const {
    index
  } = data
  const operator = oper[index]
  if (operator.region_id) {
    const region = regions.find(region => region.id === operator.region_id)
    return region ? region.name : 'NULL'
  } else
    return 'NULL'
});

Handlebars.registerHelper("printSet", function ({
  data
}) {
  const {
    oper,
    ques
  } = data.root
  const {
    index
  } = data
  const operator = oper[index]
  if (operator.set_id > 0) {
    const set = ques.find(set => set.set_id == operator.set_id)
    return set ? set.set_name : 'NULL'
  } else
    return 'NULL'
});

Handlebars.registerHelper("json", function (content) {
  return JSON.stringify(content);
});

Handlebars.registerHelper("len", function (json) {
  return Object.keys(json).length;
});

Handlebars.registerHelper("length", function (arr) {
  return arr.length;
});

Handlebars.registerHelper("index", function (index) {
  return index + 1;
});

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

  switch (operator) {
    case '==':
      return (v1 == v2) ? options.fn(this) : options.inverse(this);
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '!=':
      return (v1 != v2) ? options.fn(this) : options.inverse(this);
    case '!==':
      return (v1 !== v2) ? options.fn(this) : options.inverse(this);
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    case '&&':
      return (v1 && v2) ? options.fn(this) : options.inverse(this);
    case '||':
      return (v1 || v2) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});