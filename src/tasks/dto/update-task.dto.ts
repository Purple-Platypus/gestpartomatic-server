import { PartialType } from '@nestjs/mapped-types';
import { PickType } from '@nestjs/swagger';
import TaskDto from './task.dto';

export class UpdateTaskDto extends PartialType(
  PickType(TaskDto, [
    'id',
    'title',
    'description',
    'tags',
    'assignees',
  ] as const),
) {}
