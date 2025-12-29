import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity'; // Import Tag เข้ามา

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
  species: string; // เช่น Dog, Cat

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

  // --- สร้างความสัมพันธ์ Many-to-Many ---
  // 1 Pet มีได้หลาย Tags และ 1 Tag อยู่ได้ในหลาย Pets
  @ManyToMany(() => Tag, { cascade: true }) 
  @JoinTable() // จำเป็นต้องใส่ @JoinTable ที่ฝั่ง Owner (Pet) เพื่อสร้างตารางกลางอัตโนมัติ
  tags: Tag[];
}