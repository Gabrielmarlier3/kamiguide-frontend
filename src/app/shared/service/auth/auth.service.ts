// src/app/shared/service/auth/auth.service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs'
import { tap } from 'rxjs/operators'
import { environment } from '../../../../environments/environment'

export interface LoginDto {
  email: string
  password: string
}
export interface LoginResponseDto {
  idToken: string
  refreshToken: string
  expiresIn: string
}
export interface RefreshDto {
  refreshToken: string
}
export interface RefreshResponseDto {
  idToken: string
  refreshToken: string
  expiresIn: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient)
  private platformId = inject(PLATFORM_ID)
  private isBrowser = isPlatformBrowser(this.platformId)

  private apiUrl = environment.authApiUrl
  private refreshSub?: Subscription

  private readonly STORAGE_ID = 'kg_idToken'
  private readonly STORAGE_RF = 'kg_refreshToken'
  private readonly STORAGE_EXP = 'kg_expiresAt'
  private readonly REFRESH_EVERY_MS = 30 * 60 * 1000 // 30min

  isAuthenticated$ = new BehaviorSubject<boolean>(false)

  private getItem(key: string): string | null {
    if (!this.isBrowser) return null
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  }
  private setItem(key: string, value: string): void {
    if (!this.isBrowser) return
    try {
      window.localStorage.setItem(key, value)
    } catch {}
  }
  private removeItem(key: string): void {
    if (!this.isBrowser) return
    try {
      window.localStorage.removeItem(key)
    } catch {}
  }

  initFromStorage(): void {
    if (!this.isBrowser) return
    if (this.hasValidToken()) {
      this.isAuthenticated$.next(true)
      this.startAutoRefresh()
    } else {
      this.isAuthenticated$.next(false)
    }
  }

  login(dto: LoginDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.apiUrl}/login`, dto).pipe(
      tap((res) => {
        const now = Date.now()
        const exp = now + Number(res.expiresIn) * 1000
        this.setItem(this.STORAGE_ID, res.idToken)
        this.setItem(this.STORAGE_RF, res.refreshToken)
        this.setItem(this.STORAGE_EXP, String(exp))
        this.isAuthenticated$.next(true)
        this.startAutoRefresh()
      }),
    )
  }

  refresh(): Observable<RefreshResponseDto> {
    const refreshToken = this.getItem(this.STORAGE_RF) || ''
    return this.http
      .post<RefreshResponseDto>(`${this.apiUrl}/refresh`, { refreshToken } as RefreshDto)
      .pipe(
        tap((res) => {
          const now = Date.now()
          const exp = now + Number(res.expiresIn) * 1000
          this.setItem(this.STORAGE_ID, res.idToken)
          this.setItem(this.STORAGE_RF, res.refreshToken)
          this.setItem(this.STORAGE_EXP, String(exp))
          this.isAuthenticated$.next(true)
        }),
      )
  }

  logout(): void {
    this.stopAutoRefresh()
    this.removeItem(this.STORAGE_ID)
    this.removeItem(this.STORAGE_RF)
    this.removeItem(this.STORAGE_EXP)
    this.isAuthenticated$.next(false)
  }

  getIdToken(): string | null {
    return this.getItem(this.STORAGE_ID)
  }

  private hasValidToken(): boolean {
    const token = this.getItem(this.STORAGE_ID)
    const exp = Number(this.getItem(this.STORAGE_EXP) || 0)
    return !!token && exp > Date.now()
  }

  private startAutoRefresh(): void {
    if (!this.isBrowser) return
    this.stopAutoRefresh()
    this.refreshSub = timer(this.REFRESH_EVERY_MS, this.REFRESH_EVERY_MS).subscribe(() => {
      const rf = this.getItem(this.STORAGE_RF)
      if (!rf) {
        this.logout()
        return
      }
      this.refresh().subscribe({ error: () => this.logout() })
    })
  }

  private stopAutoRefresh(): void {
    this.refreshSub?.unsubscribe()
    this.refreshSub = undefined
  }
}
