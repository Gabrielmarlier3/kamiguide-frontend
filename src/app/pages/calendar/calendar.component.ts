import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { AppHeaderComponent } from '../../shared/components/header/header.component'
import { FooterComponent } from '../../shared/components/footer/footer.component'
import {
  CalendarService,
  DayFilter,
  UserEntryDto,
  PublicEntryDto,
} from '../../shared/service/calendar/calendar.service'
import { AuthService } from '../../shared/service/auth/auth.service'
import { Router, RouterLink } from '@angular/router'
import { LucideAngularModule, X } from 'lucide-angular'

type DayLabel = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppHeaderComponent,
    FooterComponent,
    RouterLink,
    LucideAngularModule,
  ],
  templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit {
  isAuth = false
  loading = true
  error = ''

  modalDay: DayFilter | null = null
  modalDayLabel = ''

  daysOrder: { api: DayFilter; label: DayLabel }[] = [
    { api: 'monday', label: 'Monday' },
    { api: 'tuesday', label: 'Tuesday' },
    { api: 'wednesday', label: 'Wednesday' },
    { api: 'thursday', label: 'Thursday' },
    { api: 'friday', label: 'Friday' },
    { api: 'saturday', label: 'Saturday' },
    { api: 'sunday', label: 'Sunday' },
  ]

  userByDay: Record<DayFilter, UserEntryDto[]> = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  }

  expandedDay: DayFilter | null = null
  availableByDay: Partial<Record<DayFilter, PublicEntryDto[]>> = {}
  pageByDay: Partial<Record<DayFilter, number>> = {}
  loadingDay: Partial<Record<DayFilter, boolean>> = {}

  constructor(
    private calendar: CalendarService,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe((v) => {
      this.isAuth = v
      if (this.isAuth) this.loadUserCalendar()
      else this.loading = false
    })
  }

  private loadUserCalendar() {
    this.loading = true
    this.error = ''
    this.calendar.getUserCalendar().subscribe({
      next: (res) => {
        console.log(JSON.stringify(res))
        for (const d of Object.keys(this.userByDay) as DayFilter[]) this.userByDay[d] = []
        for (const entry of res.payload) this.userByDay[entry.day].push(entry)
        this.loading = false
      },
      error: (error) => {
        this.error = `Failed to fetch your calendar. ${error.message}`
        this.loading = false
      },
    })
  }

  openDayModal(dayApi: DayFilter) {
    this.modalDay = dayApi
    const dayObj = this.daysOrder.find((d) => d.api === dayApi)
    this.modalDayLabel = dayObj ? dayObj.label : ''
    this.loadPublicDay(dayApi)
  }

  closeDayModal() {
    this.modalDay = null
  }

  toggleAddPanel(day: DayFilter) {
    this.expandedDay = this.expandedDay === day ? null : day
    if (this.expandedDay) this.loadPublicDay(this.expandedDay)
  }

  loadPublicDay(day: DayFilter, goTo?: 'prev' | 'next') {
    const curr = this.pageByDay[day] || 1
    const page = goTo === 'next' ? curr + 1 : goTo === 'prev' ? Math.max(1, curr - 1) : curr
    this.pageByDay[day] = page
    this.loadingDay[day] = true
    this.calendar.getDaySchedule(day, page).subscribe({
      next: (res) => {
        this.availableByDay[day] = res.payload || []
        this.loadingDay[day] = false
      },
      error: () => {
        this.availableByDay[day] = []
        this.loadingDay[day] = false
      },
    })
  }

  addAnime(day: DayFilter, a: PublicEntryDto) {
    const dto = {
      malId: a.malId,
      day,
      title: a.title,
      releaseTime: a.releaseTime,
      imageUrl: a.imageUrl,
    }
    this.calendar.addToUserCalendar(dto).subscribe({
      next: (res) => {
        for (const d of Object.keys(this.userByDay) as DayFilter[]) this.userByDay[d] = []
        for (const entry of res.payload) this.userByDay[entry.day].push(entry)
      },
    })
  }

  removeAnime(malId: number) {
    this.calendar.removeFromUserCalendar(malId).subscribe({
      next: (res) => {
        for (const d of Object.keys(this.userByDay) as DayFilter[]) this.userByDay[d] = []
        for (const entry of res.payload) this.userByDay[entry.day].push(entry)
      },
    })
  }

  filteredAvailable(day: DayFilter): PublicEntryDto[] {
    const list = this.availableByDay[day] || []
    const existing = new Set((this.userByDay[day] || []).map((u) => u.malId))
    return list.filter((a) => !existing.has(a.malId))
  }

  get totalEntries(): number {
    return Object.values(this.userByDay).reduce((acc, arr) => acc + arr.length, 0)
  }

  get activeDays(): number {
    return Object.values(this.userByDay).filter((arr) => arr.length > 0).length
  }

  get differentSeries(): number {
    const set = new Set<string>()
    Object.values(this.userByDay).forEach((arr) => arr.forEach((a) => set.add(a.title)))
    return set.size
  }

  get avgPerDay(): number {
    return Math.round((this.totalEntries / 7) * 10) / 10
  }

  goToAnime(id: number) {
    this.router.navigate(['/anime', id])
  }
}
