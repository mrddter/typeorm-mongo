import { Entity, Column, Index, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class User {
  @ObjectIdColumn() // { name: '_id' }
  id: ObjectID;

  @Index()
  @Column()
  email: string;
}
