import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { AnimeService } from '../../shared/service/anime/anime.service'
import { AppHeaderComponent } from '../../shared/components/header/header.component'
import { FooterComponent } from '../../shared/components/footer/footer.component'
import { LucideAngularModule } from 'lucide-angular'

interface GenreDto {
  mal_id: number
  type: string
  name: string
}
interface SearchResponseDto {
  mal_id: number
  title: string
  year: number
  episodes: number
  status: string
  score: number
  image_url: string
  genres: GenreDto[]
  type: string
  season: string
}
interface PaginationDto {
  page: number
  perPage: number
  totalResults: number
  totalPages: number
}
interface SearchPaginated {
  pagination: PaginationDto
  data: SearchResponseDto[]
}
interface SearchPaginatedResponseDto {
  payload: SearchPaginated
  fetchedAt: string
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AppHeaderComponent,
    FooterComponent,
    LucideAngularModule,
  ],
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  q = ''
  searchQuery = ''
  sortBy: 'relevance' | 'rating' | 'year' | 'title' = 'relevance'
  filterType = 'all'
  filterStatus = 'all'
  page = 1
  totalPages = 1
  totalResults = 0
  perPage = 0
  loading = false
  results: SearchResponseDto[] = []
  pageWindow: number[] = []
  hasLeftEllipsis = false
  hasRightEllipsis = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animeService: AnimeService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((p) => {
      this.q = p.get('q') || ''
      this.page = Number(p.get('page') || 1)
      this.searchQuery = this.q
      if (this.q.trim()) this.fetch()
      else this.resetState()
    })
  }

  onSubmit(): void {
    const q = this.searchQuery.trim()
    this.router.navigate(['/search'], { queryParams: { q, page: 1 } })
  }

  changePage(p: number): void {
    if (p < 1 || p > this.totalPages || p === this.page) return
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: this.q, page: p },
      queryParamsHandling: 'merge',
    })
  }

  private fetch(): void {
    this.loading = true
    this.animeService.searchAnime(this.q, this.page).subscribe({
      next: (res: SearchPaginatedResponseDto) => {
        this.results = res.payload.data
        this.totalPages = res.payload.pagination.totalPages
        this.totalResults = res.payload.pagination.totalResults
        this.perPage = res.payload.pagination.perPage
        this.updatePaginationUi()
        this.loading = false
      },
      error: () => {
        this.results = []
        this.totalPages = 1
        this.totalResults = 0
        this.loading = false
      },
    })
  }

  get displayed(): SearchResponseDto[] {
    let list = [...this.results]
    if (this.filterType !== 'all') {
      const ft = this.filterType.toLowerCase()
      list = list.filter((a) => (a.type || '').toLowerCase() === ft)
    }
    if (this.filterStatus !== 'all') {
      const fs = this.filterStatus.toLowerCase()
      list = list.filter((a) => (a.status || '').toLowerCase().includes(fs))
    }
    if (this.sortBy === 'rating') list.sort((a, b) => (b.score || 0) - (a.score || 0))
    else if (this.sortBy === 'year') list.sort((a, b) => (b.year || 0) - (a.year || 0))
    else if (this.sortBy === 'title') list.sort((a, b) => a.title.localeCompare(b.title))
    return list
  }

  jumpToPageViaPrompt(side: 'left' | 'right'): void {
    const input = window.prompt('Go to page:')
    if (!input) return
    const p = Number(input)
    if (Number.isInteger(p) && p >= 1 && p <= this.totalPages) this.changePage(p)
  }

  trackById = (_: number, a: SearchResponseDto) => a.mal_id
  trackByNum = (_: number, n: number) => n

  private resetState(): void {
    this.results = []
    this.totalPages = 1
    this.totalResults = 0
    this.pageWindow = []
    this.hasLeftEllipsis = false
    this.hasRightEllipsis = false
  }

  private updatePaginationUi(): void {
    const size = 5
    let start = Math.max(1, this.page - 2)
    let end = Math.min(this.totalPages, start + size - 1)
    start = Math.max(1, end - size + 1)
    const arr: number[] = []
    for (let i = start; i <= end; i++) arr.push(i)
    this.pageWindow = arr
    this.hasLeftEllipsis = start > 1
    this.hasRightEllipsis = end < this.totalPages
  }
}
