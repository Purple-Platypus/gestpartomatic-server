import { PartialType, PickType } from '@nestjs/swagger';
import TeamDto from './team.dto';

export class UpdateTeamDto extends PartialType(
  PickType(TeamDto, ['description', 'image'] as const),
) {}

export default UpdateTeamDto;
