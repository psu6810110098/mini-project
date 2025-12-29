import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity';

export enum PetStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
}

@Entity()
export class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  species: string; // e.g. "Dog", "Cat"

  @Column('decimal')
  price: number;

  @Column({ default: 'https://via.placeholder.com/150' })
  image: string; 

  @Column({
    type: 'enum',
    enum: PetStatus,
    default: PetStatus.AVAILABLE,
  })
  status: PetStatus;

  // --- Many-to-Many Relationship ---
  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable() 
  tags: Tag[];
}