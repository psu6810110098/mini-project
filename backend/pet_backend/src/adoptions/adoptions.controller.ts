import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('adoptions')
@UseGuards(JwtAuthGuard) // All adoption endpoints require authentication
export class AdoptionsController {
  constructor(private readonly adoptionsService: AdoptionsService) {}

  /**
   * Adopt a pet
   * Access: Any authenticated user (USER or ADMIN)
   * Security: User can only adopt for themselves (automatically uses current user)
   */
  @Post('adopt')
  async adopt(@Body() createAdoptionDto: CreateAdoptionDto, @Request() req) {
    return this.adoptionsService.adopt(createAdoptionDto, req.user);
  }

  /**
   * Get all adoptions
   * Access: All authenticated users
   * Security: Users see only their adoptions, Admins see all
   */
  @Get()
  findAll(@Request() req) {
    return this.adoptionsService.findAll(req.user);
  }

  /**
   * Get a specific adoption by ID
   * Access: All authenticated users
   * Security: Users can only view their own adoptions, Admins can view any
   */
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.adoptionsService.findOne(+id, req.user);
  }

  /**
   * Update an adoption
   * Access: ADMIN ONLY
   * Security: Only administrators can update adoption records
   * Note: Adoptions should generally be immutable
   */
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateAdoptionDto: UpdateAdoptionDto, @Request() req) {
    return this.adoptionsService.update(+id, updateAdoptionDto, req.user);
  }

  /**
   * Delete an adoption
   * Access: ADMIN ONLY
   * Security: Only administrators can delete adoption records
   * Warning: This breaks data integrity, use with caution
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string, @Request() req) {
    return this.adoptionsService.remove(+id, req.user);
  }
}
