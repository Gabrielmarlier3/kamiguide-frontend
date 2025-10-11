export interface GenreDetailDto {
  mal_id: number
  title: string
  image_url: string
  score: number
  season: string
  status: string
  type: string
  year: number
}

export interface PaginationDto {
  page: number
  perPage: number
  totalResults: number
  totalPages: number
}

export interface GenreTabDto {
  pagination: PaginationDto
  data: GenreDetailDto[]
}

export interface GenreSearchResponseDto {
  payload: GenreTabDto
  fetchedAt: string
}
