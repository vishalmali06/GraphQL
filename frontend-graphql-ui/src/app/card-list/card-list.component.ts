// card-list.component.ts

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent implements OnInit {

  cards = [
    { title: 'Card 1', subtitle: 'Subtitle 1', content: 'Content of card 1' },
    { title: 'Card 2', subtitle: 'Subtitle 2', content: 'Content of card 2' },
    { title: 'Card 3', subtitle: 'Subtitle 3', content: 'Content of card 3' },
    { title: 'Card 1', subtitle: 'Subtitle 1', content: 'Content of card 1' },
    { title: 'Card 2', subtitle: 'Subtitle 2', content: 'Content of card 2' },
    { title: 'Card 3', subtitle: 'Subtitle 3', content: 'Content of card 3' },
    { title: 'Card 1', subtitle: 'Subtitle 1', content: 'Content of card 1' },
    { title: 'Card 2', subtitle: 'Subtitle 2', content: 'Content of card 2' },
    { title: 'Card 3', subtitle: 'Subtitle 3', content: 'Content of card 3' },
    { title: 'Card 1', subtitle: 'Subtitle 1', content: 'Content of card 1' },
    { title: 'Card 2', subtitle: 'Subtitle 2', content: 'Content of card 2' },
    { title: 'Card 3', subtitle: 'Subtitle 3', content: 'Content of card 3' },
    { title: 'Card 1', subtitle: 'Subtitle 1', content: 'Content of card 1' },
    { title: 'Card 2', subtitle: 'Subtitle 2', content: 'Content of card 2' },
    { title: 'Card 3', subtitle: 'Subtitle 3', content: 'Content of card 3' },
    // Add more cards as needed
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
