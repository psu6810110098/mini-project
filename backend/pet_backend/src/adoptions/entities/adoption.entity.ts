import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Adoption {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  adoptionDate: Date;

  // Relation 1: Adoption นี้เป็นของ User คนไหน
  @ManyToOne(() => User, (user) => user.adoptions)
  @Exclude() // Exclude user from serialization to prevent circular reference
  user: User;

  // Relation 2: Adoption นี้รับเลี้ยง Pet ตัวไหน (1 ใบเสร็จ = 1 ตัว)
  @OneToOne(() => Pet)
  @JoinColumn() // ต้องใส่ JoinColumn ที่ฝั่งที่เป็นเจ้าของความสัมพันธ์ (Adoption)
  pet: Pet;
}