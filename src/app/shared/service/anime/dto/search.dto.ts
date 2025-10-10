export interface GenreDto {
  mal_id: number
  type: string
  name: string
}

export interface SearchResponseDto {
  mal_id: number
  title: string
  title_english: string
  year: number
  episodes: number
  status: string
  score: number
  image_url: string
  genres: GenreDto[]
  type: string
  season: string
}

export interface PaginationDto {
  page: number
  perPage: number
  totalResults: number
  totalPages: number
}

export interface SearchPaginated {
  pagination: PaginationDto
  data: SearchResponseDto[]
}

export interface SearchPaginatedResponseDto {
  payload: SearchPaginated
  fetchedAt: string
}
