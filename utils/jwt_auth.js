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
      if (err) return resolve([err, null]);
      resolve([null, data]); //verifie le token de autantification et extracte les donne {id,role}
    });
  });
};
module.exports.jwt_generator = function ({ id, role }) {
  return jwt_auth.sign({ id, role }, process.env.SALT_JWT, { expiresIn: process.env.JWT_VALIDATION_TIME || "1d" }); //pour genere un token de authantification
};
