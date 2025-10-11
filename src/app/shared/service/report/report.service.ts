import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

export interface CreateReportDto {
  type: string
  subject: string
  description: string
  name?: string
  email?: string
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly apiUrl = `http://localhost:3000/report`
  constructor(private http: HttpClient) {}
  create(payload: CreateReportDto): Observable<{ status: number; message: string }> {
    return this.http.post<{ status: number; message: string }>(this.apiUrl, payload)
  }
}
