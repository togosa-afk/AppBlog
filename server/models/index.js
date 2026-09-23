const Blog = require('./blog')
const User = require('./user')
const Session = require('./session')
const ReadingList = require('./reading_list')

Blog.belongsTo(User, { as: 'user', foreignKey: 'userId' })
User.hasMany(Blog)
User.hasMany(Session)
Session.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'reading_users' })

module.exports = {
  Blog, User,ReadingList,Session
}