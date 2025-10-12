export interface GenreDto {
  mal_id: number
  type: string
  name: string
}

export interface PopularDto {
  mal_id: number
  title: string
  image_url: string
  score: number
  status: string
  genres: GenreDto[]
}

export interface PopularResponseDto {
  payload: PopularDto[]
  fetchedAt: string
}
