module.exports = (query) => {
    return "SELECT LAST_INSERT_ID() AS id";
};