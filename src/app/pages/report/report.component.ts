import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { LucideAngularModule } from 'lucide-angular'
import { AppHeaderComponent } from '../../shared/components/header/header.component'
import { FooterComponent } from '../../shared/components/footer/footer.component'
import {CreateReportDto, ReportService} from '../../shared/service/report/report.service';

type ReportType = 'bug' | 'content' | 'feature' | 'feedback'

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, AppHeaderComponent, FooterComponent],
  templateUrl: './report.component.html',
})
export class ReportPageComponent {
  constructor(private reportService: ReportService) {}

  reportTypes = [
    { icon: 'bug', key: 'bug' as ReportType, title: 'Bug Report', description: "Something isn't working correctly" },
    { icon: 'alert-triangle', key: 'content' as ReportType, title: 'Content Issue', description: 'Incorrect or missing anime information' },
    { icon: 'lightbulb', key: 'feature' as ReportType, title: 'Feature Request', description: 'Suggest a new feature or improvement' },
    { icon: 'message-square', key: 'feedback' as ReportType, title: 'General Feedback', description: 'Share your thoughts about KamiGuide' },
  ]

  name = ''
  email = ''
  type: ReportType = 'bug'
  subject = ''
  description = ''
  submitting = false
  success = false
  error = false

  pickType(t: ReportType) {
    this.type = t
  }

  clearForm() {
    this.name = ''
    this.email = ''
    this.type = 'bug'
    this.subject = ''
    this.description = ''
  }

  submit() {
    if (!this.subject.trim() || !this.description.trim()) return
    this.submitting = true
    const payload: CreateReportDto = {
      type: this.type,
      subject: this.subject.trim(),
      description: this.description.trim(),
      name: this.name || undefined,
      email: this.email || undefined,
    }
    this.reportService.create(payload).subscribe({
      next: () => {
        this.submitting = false
        this.success = true
        this.clearForm()
        setTimeout(() => (this.success = false), 4000)
      },
      error: () => {
        this.submitting = false
        this.error = true
        setTimeout(() => (this.error = false), 4000)
      },
    })
  }
}
