"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getuser = getuser;
exports.addNewUser = addNewUser;
exports.getuser_email = getuser_email;
exports.setTwofAcode = setTwofAcode;
async function getuser(fastify, username) {
    return (new Promise((resolve, rejects) => {
        fastify.db.get('SELECT * FROM user_authentication WHERE username = ?', username, (err, rows) => {
            if (err)
                rejects(err);
            resolve(rows);
        });
    }));
}
async function addNewUser(fastify, newuser) {
    return new Promise((resolve, reject) => {
        fastify.db.run(`INSERT INTO user_authentication (username, email, first_name, family_name, password)
		 VALUES (?, ?, ?, ?, ?)`, [
            newuser.username,
            newuser.email,
            newuser.first_name,
            newuser.family_name,
            newuser.password
        ], (err) => {
            if (err)
                return reject(err);
            resolve();
        });
    });
}
async function getuser_email(fastify, email) {
    return (new Promise((resolve, rejects) => {
        fastify.db.get('SELECT * FROM user_authentication WHERE email = ?', email, (err, rows) => {
            if (err)
                rejects(err);
            resolve(rows);
        });
    }));
}
async function setTwofAcode(fastify, username, code) {
    return new Promise((resolve, rejects) => {
        fastify.db.run(`UPDATE user_authentication SET twoFA_code = ? WHERE username = ?`, [code, username], (err) => {
            if (err) {
                return rejects(err);
            }
            resolve();
        });
    });
}
