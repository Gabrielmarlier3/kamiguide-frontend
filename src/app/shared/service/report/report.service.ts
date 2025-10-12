import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'

export interface CreateReportDto {
  type: string
  subject: string
  description: string
  name?: string
  email?: string
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly apiUrl = environment.reportApiUrl
  constructor(private http: HttpClient) {}
  create(payload: CreateReportDto): Observable<{ status: number; message: string }> {
    return this.http.post<{ status: number; message: string }>(this.apiUrl, payload)
  }
}
