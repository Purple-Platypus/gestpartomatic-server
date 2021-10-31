import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagDto } from './dto/tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(createTagData: CreateTagDto): Promise<TagDto> {
    const createdTag = await this.prisma.tag.create({
      data: createTagData,
    });
    return createdTag;
  }

  async findAll(): Promise<TagDto[]> {
    const selectParams = {
      select: {
        id: true,
        label: true,
        color: true,
        isDark: true,
      },
    };
    const tags = await this.prisma.tag.findMany(selectParams);

    return tags;
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return this.prisma.tag.delete({
      where: {
        id,
      },
    });
  }
}
