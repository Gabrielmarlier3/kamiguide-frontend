import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimeService } from '../../shared/service/anime/anime.service';
import { GenreDetailDto, GenreSearchResponseDto } from '../../shared/service/anime/dto/genre.dto';
import {AppHeaderComponent} from '../../shared/components/header/header.component';
import {FooterComponent} from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-genre-details',
  standalone: true,
  imports: [CommonModule, FormsModule, AppHeaderComponent, FooterComponent],
  templateUrl: './genre-details.component.html',
  styleUrl: './genre-details.component.css',
})
export class GenreDetailsComponent implements OnInit {
  genre!: string;
  animes: GenreDetailDto[] = [];
  loading = true;

  page = 1;
  totalPages = 1;
  totalResults = 0;
  perPage = 20;
  from = 0;
  to = 0;

  selectedYear: number | 'all' = 'all';
  selectedScore: number | 'all' = 'all';
  selectedType: 'all' | 'series' | 'movie' = 'all';
  maxYear = new Date().getFullYear() + 1;

  pageWindow: number[] = [];
  hasLeftEllipsis = false;
  hasRightEllipsis = false;

  constructor(private route: ActivatedRoute, private animeService: AnimeService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.genre = params.get('genre') || '';
      this.page = 1;
      this.fetchAnimes();
    });
  }

  fetchAnimes(): void {
    this.loading = true;
    this.animeService
      .getByGenre(
        this.genre,
        this.page,
        this.selectedYear !== 'all' ? Number(this.selectedYear) : undefined,
        this.selectedScore !== 'all' ? Number(this.selectedScore) : undefined,
        this.selectedType !== 'all' ? this.selectedType : undefined,
      )
      .subscribe({
        next: (res: GenreSearchResponseDto) => {
          this.animes = res.payload.data;
          this.totalPages = res.payload.pagination.totalPages;
          this.totalResults = res.payload.pagination.totalResults;
          this.perPage = res.payload.pagination.perPage;
          this.from = (this.page - 1) * this.perPage + 1;
          this.to = Math.min(this.page * this.perPage, this.totalResults);
          this.updatePaginationUi();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  applyFilters(): void {
    this.page = 1;
    this.fetchAnimes();
  }

  changePage(p: number): void {
    if (p < 1 || p > this.totalPages || p === this.page) return;
    this.page = p;
    this.fetchAnimes();
  }

  jumpToPageViaPrompt(side: 'left' | 'right'): void {
    const input = window.prompt('Go to page:');
    if (!input) return;
    const p = Number(input);
    if (Number.isInteger(p) && p >= 1 && p <= this.totalPages) {
      this.changePage(p);
    }
  }

  private updatePaginationUi(): void {
    const size = 5;
    let start = Math.max(1, this.page - 2);
    let end = Math.min(this.totalPages, start + size - 1);
    start = Math.max(1, end - size + 1);
    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i);
    this.pageWindow = arr;
    this.hasLeftEllipsis = start > 1;
    this.hasRightEllipsis = end < this.totalPages;
  }
}
