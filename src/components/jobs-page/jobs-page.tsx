import { Component, Prop, State } from '@stencil/core';
import { RouterHistory } from '@stencil/router';


@Component({
  tag: 'jobs-page',
  styleUrl: 'jobs-page.scss'
})
export class jobsPage {

  @Prop() match: any;
  @Prop() history: RouterHistory;

  @State() page: number;

  componentWillLoad() {
    if (this.match && this.match.params.pageNum) {
      this.page = parseInt(this.match.params.pageNum);
    } else {
      this.page = 1;
    }
  }

  forward() {
    this.page = this.page + 1;
    this.history.push(`/jobs/${this.page}`, {});
  }

  back() {
    if (this.page !== 1) {
      this.page = this.page - 1;
      this.history.push(`/jobs/${this.page}`, {});
    }
  }

  hostData() {
    return {
      class: {'ion-page': true}
    };
  }

  render() {
    return [
        <nav-header></nav-header>,
        <ion-content>
          <list-container pageNum={this.page} type='jobs'></list-container>
        </ion-content>,
        <ion-footer>
          <ion-toolbar>
            <ion-buttons slot='start'>
              <ion-button
                onClick={() => this.back()}
                fill='clear'
                color='primary'
                class={{ 'no-back': this.page === 1, 'yes-back': this.page > 1 }}
              >
                Prev
              </ion-button>
            </ion-buttons>

            <span class='page-number'>
              page {this.page}
            </span>

            <ion-buttons slot='end'>
              <ion-button onClick={() => this.forward()} fill='clear' color='primary'>
                Next
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-footer>
    ];
  }
}