import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LucideAngularModule } from 'lucide-angular'
import { AppHeaderComponent } from '../../shared/components/header/header.component'
import { FooterComponent } from '../../shared/components/footer/footer.component'

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AppHeaderComponent, FooterComponent],
  templateUrl: './help.component.html',
})
export class HelpPageComponent {
  helpSections = [
    {
      icon: 'search',
      title: 'Finding Anime',
      content:
        "Use our search feature to find specific anime titles, or browse by genre to discover new series. Our recommendation system learns from your preferences to suggest anime you'll love.",
    },
    {
      icon: 'filter',
      title: 'Using Filters',
      content:
        'Filter anime by season, year, rating, type (series/movies), and status (ongoing/finished). Tags on each anime card show key information at a glance.',
    },
    {
      icon: 'calendar',
      title: 'Weekly Calendar',
      content:
        'Track upcoming anime episodes and releases with our weekly calendar view. Navigate between weeks to plan your viewing schedule.',
    },
    {
      icon: 'message-circle',
      title: 'Community Features',
      content:
        'Connect with us on social media through our Community tab. Follow us on Instagram, Twitter, and join our Discord server for discussions.',
    },
  ]
}
