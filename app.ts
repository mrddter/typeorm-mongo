import dotenv from 'dotenv'
dotenv.config()

import 'reflect-metadata'
import { DataSource, DataSourceOptions } from 'typeorm'
import { User } from './entity'

const options: DataSourceOptions = {
  type: 'mongodb',
  url: process.env.DB_URL,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: ['query', 'error'],
  synchronize: true,
  entities: [User]
}

const dataSource = new DataSource(options)
dataSource.initialize().then(
  (dataSource) => {
    let entity = new User()
    entity.email = 'test@test.it'

    let userRepository = dataSource.getRepository(User)

    userRepository
      .save(entity)
      .then((entity) => {
        console.log('User has been saved. Lets insert a new one to update it later')
        return userRepository.save({
          ...entity,
          id: undefined
        }) as Promise<User>
      })
      .then((entity) => {
        console.log('Second entity has been inserted. Lets update it')
        entity.email = 'another@test.it'

        return userRepository.save(entity)
      })
      .then((entity) => {
        console.log('Entity has been updated. Persist once again to make find and remove then')
        return userRepository.save({
          ...entity,
          id: undefined
        }) as Promise<User>
      })
      .then((entity) => {
        return userRepository.findOneById(entity.id) // works well even if deprecated
      })
      .then((entity) => {
        console.log('Entity is loaded: ', entity)
        console.log('Now remove it by entity ' + JSON.stringify(entity))
        return userRepository.remove(entity!)
      })
      .then((entity) => {
        console.log('Entity has been removed')
      })
      .catch((error) => console.log('Cannot save. Error: ', error, error.stack))
  },
  (error) => console.log('Cannot connect: ', error)
)
