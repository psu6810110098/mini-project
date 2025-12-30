import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Adoption } from './entities/adoption.entity';
import { Pet } from '../pets/entities/pet.entity';
import { PetStatus } from '../pets/entities/pet.entity';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AdoptionsService {
  constructor(
    @InjectRepository(Adoption)
    private adoptionRepository: Repository<Adoption>,
    @InjectRepository(Pet)
    private petRepository: Repository<Pet>,
    private dataSource: DataSource,
  ) {}

  /**
   * Adopt a pet - Creates adoption record and updates pet status to SOLD
   * Uses database transaction to ensure atomicity
   * @param createAdoptionDto - DTO containing petId
   * @param user - Current authenticated user
   * @returns The created adoption record
   */
  async adopt(createAdoptionDto: CreateAdoptionDto, user: User): Promise<Adoption> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get repositories within the transaction
      const adoptionRepo = queryRunner.manager.getRepository(Adoption);
      const petRepo = queryRunner.manager.getRepository(Pet);

      // 1. Check if pet exists
      const pet = await petRepo.findOne({
        where: { id: createAdoptionDto.petId },
      });

      if (!pet) {
        throw new NotFoundException(`Pet with ID ${createAdoptionDto.petId} not found`);
      }

      // 2. Check if pet is available
      if (pet.status !== PetStatus.AVAILABLE) {
        throw new BadRequestException(`Pet is not available for adoption. Current status: ${pet.status}`);
      }

      // 3. Create adoption record
      const adoption = adoptionRepo.create({
        user: user, // Link to current user
        pet: pet, // Link to the pet
      });

      const savedAdoption = await adoptionRepo.save(adoption);

      // 4. Update pet status to SOLD
      pet.status = PetStatus.SOLD;
      await petRepo.save(pet);

      // Commit transaction if all operations succeed
      await queryRunner.commitTransaction();

      // Return the adoption with relations populated
      return this.findOne(savedAdoption.id, user);
    } catch (error) {
      // Rollback transaction on any error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  /**
   * Find all adoptions with role-based filtering
   * - Admin: Can see all adoptions
   * - User: Can only see their own adoptions
   * @param user - Current authenticated user
   * @returns Array of adoptions
   */
  async findAll(user: User): Promise<Adoption[]> {
    if (user.role === UserRole.ADMIN) {
      // Admin can see all adoptions
      return this.adoptionRepository.find({
        relations: ['user', 'pet'],
        order: { adoptionDate: 'DESC' },
      });
    } else {
      // User can only see their own adoptions
      return this.adoptionRepository.find({
        where: { user: { id: user.id } },
        relations: ['user', 'pet'],
        order: { adoptionDate: 'DESC' },
      });
    }
  }

  /**
   * Find a specific adoption by ID with role-based access control
   * - Admin: Can view any adoption
   * - User: Can only view their own adoptions
   * @param id - Adoption ID
   * @param user - Current authenticated user
   * @returns The adoption record
   */
  async findOne(id: number, user: User): Promise<Adoption> {
    const adoption = await this.adoptionRepository.findOne({
      where: { id },
      relations: ['user', 'pet'],
    });

    if (!adoption) {
      throw new NotFoundException(`Adoption with ID ${id} not found`);
    }

    // Check access control: Users can only view their own adoptions
    if (user.role !== UserRole.ADMIN && adoption.user.id !== user.id) {
      throw new ForbiddenException('You do not have permission to view this adoption record');
    }

    return adoption;
  }

  /**
   * Update adoption (Admin only in practice)
   * Note: Adoptions should generally be immutable after creation
   * This method exists for administrative corrections if needed
   * @param id - Adoption ID
   * @param updateAdoptionDto - DTO with update data
   * @param user - Current authenticated user
   * @returns Updated adoption
   */
  async update(id: number, updateAdoptionDto: UpdateAdoptionDto, user: User): Promise<Adoption> {
    const adoption = await this.findOne(id, user);

    // Only admin can update adoption records
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only administrators can update adoption records');
    }

    // Note: In most cases, adoptions should be immutable
    // This is provided for rare administrative corrections
    Object.assign(adoption, updateAdoptionDto);

    return this.adoptionRepository.save(adoption);
  }

  /**
   * Delete adoption (Admin only)
   * Note: This is a dangerous operation as it breaks data integrity
   * Consider soft deletes or status changes instead
   * @param id - Adoption ID
   * @param user - Current authenticated user
   */
  async remove(id: number, user: User): Promise<void> {
    const adoption = await this.findOne(id, user);

    // Only admin can delete adoption records
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only administrators can delete adoption records');
    }

    await this.adoptionRepository.remove(adoption);
  }
}
