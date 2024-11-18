export class BasicLookupOutputDto {
  id: string;
  name: string;
}

export class LookupOutputDto extends BasicLookupOutputDto {
  slug: string;
}
