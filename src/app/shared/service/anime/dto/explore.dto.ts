export interface ExploreResponseDto {
  genre: string
  image: string
}

export interface ExploreListResponseDto {
  payload: ExploreResponseDto[]
  fetchedAt: string
}
