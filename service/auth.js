const sessionIdtoUserMap = new Map();

function setUser(id, user) {
  sessionIdtoUserMap.set(id, user);
}

function getUser(id) {
  return sessionIdtoUserMap(id);
}

module.exports = {
  setUser,
  getUser,
};
