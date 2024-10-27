const jwt_auth = require("jsonwebtoken");
/**
 * {
 * role:(one of the roles of roles.js object),
 * id:id of the user who perform the action
 * }
 */
/**
 *
 * @param {string} token
 * @returns {Promise<[jwt_auth.JsonWebTokenError,{role:string,id:string}]>}
 */
module.exports.jwt_verify = async function (token) {
  return await new Promise((resolve, reject) => {
    jwt_auth.verify(token, process.env.SALT_JWT, (err, data) => {
      console.log(process.env.SALT_JWT);
      if (err) return resolve([err, null]);
      resolve([null, data]);
    });
  });
};
