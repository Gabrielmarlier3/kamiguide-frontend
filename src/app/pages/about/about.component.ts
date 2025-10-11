import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AppHeaderComponent } from '../../shared/components/header/header.component'
import { FooterComponent } from '../../shared/components/footer/footer.component'

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, AppHeaderComponent, FooterComponent],
  templateUrl: './about.component.html',
})
export class AboutComponent {}
