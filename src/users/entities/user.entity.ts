import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  username: string;

  @Column('text')
  password: string;

  @Column('text', { array: true })
  genres: string[];

  @Column('text', { default: 'user' })
  role: string;
}
