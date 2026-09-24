const Sequelize = require('sequelize')
const path = require('path')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')

const databaseUrl = new URL(DATABASE_URL)

const isLocalDatabase = 
  ['localhost', '127.0.0.1', 'host.docker.internal', 'db', 'postgres'].includes(databaseUrl.hostname) ||
  process.env.NODE_ENV === 'development'

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: isLocalDatabase
    ? {}
    : {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
})

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: path.join(__dirname, '../migration/*.js').replace(/\\/g, '/'),
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  })
  
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    console.log(err)
    return process.exit(1)
  }
}

module.exports = { connectToDatabase, sequelize }