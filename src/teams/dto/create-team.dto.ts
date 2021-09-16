import { PickType } from '@nestjs/swagger';
import TeamDto from './team.dto';

export class CreateTeamDto extends PickType(TeamDto, [
  'name',
  'description',
  'image',
] as const) {}

export default CreateTeamDto;
