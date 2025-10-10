export interface ExploreResponseDto {
  genre: string
  image: string
}

export interface ExploreListResponse {
  payload: ExploreResponseDto[]
  fetchedAt: string
}
