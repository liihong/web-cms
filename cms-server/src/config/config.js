// default config
module.exports = {
  workers: 1,
  port:9000,
  errnoField: 'status', // errno field
  errmsgField: 'msg', // errmsg field
  defaultErrno: 200, // default errno
  validateDefaultErrno: 500, // validate default errno
};
