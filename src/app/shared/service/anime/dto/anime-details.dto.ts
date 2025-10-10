interface GenreDto {
  mal_id: number
  type: string
  name: string
}

interface StreamingDto {
  name: string
  url: string
}

export interface AnimeDetailsDto {
  mal_id: number
  title: string
  title_english: string
  image_url: string
  score: number
  season: string
  status: string
  synopsis: string
  type: string
  year: number
  streaming: StreamingDto[]
  genres: GenreDto[]
}

export interface AnimeDetailsResponseDto {
  payload: AnimeDetailsDto
  fetchedAt: string
}
