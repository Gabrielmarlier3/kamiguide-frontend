import { inject, Injectable, PLATFORM_ID } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../../../environments/environment'
import { isPlatformBrowser } from '@angular/common'
import { Observable } from 'rxjs'
import { routes } from '../../../app.routes'
import { Router } from '@angular/router'

export type DayFilter =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export interface PublicEntryDto {
  malId: number
  day: DayFilter
  title: string
  releaseTime?: string
  imageUrl?: string
}

export interface PublicCalendarResponseDto {
  payload: PublicEntryDto[]
  fetchedAt: string
}

export interface UserEntryDto {
  malId: number
  day: DayFilter
  title: string
  releaseTime: string
  imageUrl: string
}

export interface UserCalendarResponseDto {
  payload: UserEntryDto[]
  fetchedAt: string
}

export interface AddUserCalendarDto {
  malId: number
  day: DayFilter
  title: string
  releaseTime?: string
  imageUrl?: string
}

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private http = inject(HttpClient)
  private apiUrl = environment.calendarApiUrl
  private platformId = inject(PLATFORM_ID)

  constructor(private router: Router) {}

  private getIdToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      // I need do this because is a bug that I cant resolve
      void this.router.navigate(['/'])
    }
    try {
      const idToken = localStorage.getItem('kg_idToken')
      console.log(idToken)
      return idToken
    } catch {
      return null
    }
  }

  private authHeaders(): HttpHeaders {
    const t = this.getIdToken()
    return new HttpHeaders(t ? { Authorization: `Bearer ${t}` } : {})
  }

  getDaySchedule(day: DayFilter, page = 1): Observable<PublicCalendarResponseDto> {
    const params = new HttpParams().set('day', day).set('page', page)
    return this.http.get<PublicCalendarResponseDto>(this.apiUrl, { params })
  }

  getUserCalendar(): Observable<UserCalendarResponseDto> {
    return this.http.get<UserCalendarResponseDto>(`${this.apiUrl}/user`, {
      headers: this.authHeaders(),
    })
  }

  addToUserCalendar(entry: AddUserCalendarDto): Observable<UserCalendarResponseDto> {
    return this.http.post<UserCalendarResponseDto>(`${this.apiUrl}/user`, entry, {
      headers: this.authHeaders(),
    })
  }

  removeFromUserCalendar(malId: number): Observable<UserCalendarResponseDto> {
    return this.http.delete<UserCalendarResponseDto>(`${this.apiUrl}/user/${malId}`, {
      headers: this.authHeaders(),
    })
  }
}
