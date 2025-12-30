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
  species: string;

  // ✅ แก้ไขตรงนี้: กำหนดความแม่นยำทศนิยม (10 หลัก, ทศนิยม 2 ตำแหน่ง)
  @Column({ type: 'decimal', precision: 10, scale: 2 }) 
  price: number;

  @Column()
  age: number;

  @Column({ name: 'image', default: 'https://via.placeholder.com/150' })
  image_url: string;

  @Column({
    type: 'enum',
    enum: PetStatus,
    default: PetStatus.AVAILABLE,
  })
  status: PetStatus;

  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable()
  tag: Tag[];
}