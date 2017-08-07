import { Component, State } from '@stencil/core';
import { Ionic } from '@ionic/core';

@Component({
  tag: 'news-container',
  styleUrl: '../main.scss'
})
export class NewsContainer {

  page: number = 1;
  pageType: string;
  apiRootUrl: string = 'https://node-hnapi.herokuapp.com';
  prevClass: any;

  @State() stories: any[];
  @State() firstSelectedClass: boolean;
  @State() secondSelectedClass: boolean = false;
  @State() thirdSelectedClass: boolean = false;
  @State() fourthSelectedClass: boolean = false;

  ionViewWillLoad() {
    // if (Ionic.isServer) return;

    this.firstSelectedClass = true;

    // call to firebase function for first view
    this.fakeFetch(`${this.apiRootUrl}/news?page=1`).then((data) => {
      console.log(data);
      this.stories = data;
      this.pageType = 'news';
    }).then((err) => {
      console.error('Could not load cached data from firebase', err);
    })
  }

  fakeFetch(url: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();

      request.addEventListener('load', function () {
        resolve(JSON.parse(this.responseText));
      });

      request.addEventListener('error', function () {
        reject(`error: ${this.statusText} / ${this.status}`);
      });

      request.open('GET', url, true);
      request.send();
    });
  }

  getStories(type: string) {
    // if (Ionic.isServer) return;

    // reset page number
    this.page = 1;

    // this is definitely not the best solution
    // working on something more elegant, but this
    // gets the job done for the moment
    switch (type) {
      case 'news':
        this.firstSelectedClass = true;
        this.secondSelectedClass = false;
        this.thirdSelectedClass = false;
        this.fourthSelectedClass = false;
        break;
      case 'show':
        this.secondSelectedClass = true;
        this.firstSelectedClass = false;
        this.thirdSelectedClass = false;
        this.fourthSelectedClass = false;
        break;
      case 'jobs':
        this.thirdSelectedClass = true;
        this.firstSelectedClass = false;
        this.fourthSelectedClass = false;
        this.secondSelectedClass = false;
        break;
      case 'ask':
        this.fourthSelectedClass = true;
        this.thirdSelectedClass = false;
        this.secondSelectedClass = false;
        this.firstSelectedClass = false;
        break;
    }

    /*Ionic.controller('loading', { content: `fetching ${type} articles...` }).then((loading: any) => {
      console.log(loading);
      loading.present().then(() => {

        this.fakeFetch(`${this.apiRootUrl}/${type}?page=1`).then((data) => {
          this.stories = data;

          loading.dismiss();
        });

        this.pageType = type;

      });
    });*/
    this.fakeFetch(`${this.apiRootUrl}/${type}?page=1`).then((data) => {
      this.stories = data;
      this.pageType = type;
    }).catch((err) => {
      console.error('Could not load data', err);
    })
  }

  previous() {
    if (this.page > 1) {

      /*Ionic.controller('loading', { content: `fetching articles...` }).then(loading => {
        loading.present().then(() => {

          this.page = this.page--;
          console.log(this.page--);

          this.fakeFetch(`${this.apiRootUrl}/${this.pageType}?page=${this.page}`).then((data) => {
            this.stories = data;

            loading.dismiss();
          });

        });
      });*/

      this.page = this.page - 1;
      this.fakeFetch(`${this.apiRootUrl}/${this.pageType}?page=${this.page}`).then((data) => {
        this.stories = data;
      }).catch((err) => {
        console.error('Could not load data', err);
      })
    } else {
      window.navigator.vibrate(200);
    }
  }

  next() {
    /*Ionic.controller('loading', { content: `fetching articles...` }).then(loading => {
      loading.present().then(() => {

        this.page = this.page++;
        console.log(this.page++);

        this.fakeFetch(`${this.apiRootUrl}/${this.pageType}?page=${this.page}`).then((data) => {
          if (data.length !== 0) {
            this.stories = data;
          }
          loading.dismiss();
        });

      });
    });*/

    this.page = this.page + 1;
    this.fakeFetch(`${this.apiRootUrl}/${this.pageType}?page=${this.page}`).then((data) => {
      if (data.length !== 0) {
        this.stories = data;
      }
    }).catch((err) => {
      console.error('Could not load next page of data', err);
    })
  }

  ionViewWillUpdate() {
    this.prevClass = this.page === 1 ? { 'no-back': true } : { 'yes-back': true };
  }

  render() {
    console.log('rendering');

    if (this.stories !== undefined) {
      return [
        <ion-header mdHeight='56px' iosHeight='61px'>
          <ion-toolbar color='primary'>

            <ion-buttons slot='left'>
              <ion-icon name='ionic'></ion-icon>
            </ion-buttons>

            <div class='tabs-bar'>
              <ion-button
                class={{
                  'header-button': true,
                  'first-button': true,
                  'header-button-selected': this.firstSelectedClass
                }}
                clear
                onClick={() => this.getStories('news')}
              >
                News
          </ion-button>
              <ion-button
                class={{
                  'header-button': true,
                  'header-button-selected': this.secondSelectedClass
                }}
                clear
                onClick={() => this.getStories('show')}
              >
                Show
          </ion-button>
              <ion-button
                class={{
                  'header-button': true,
                  'header-button-selected': this.thirdSelectedClass
                }}
                clear
                onClick={() => this.getStories('jobs')}
              >
                Jobs
          </ion-button>
              <ion-button
                class={{
                  'header-button': true,
                  'header-button-selected': this.fourthSelectedClass
                }}
                clear
                onClick={() => this.getStories('ask')}
              >
                Ask
          </ion-button>
            </div>
          </ion-toolbar>
        </ion-header>,
        <ion-content>
          <news-list type={this.stories}>
          </news-list>
        </ion-content>,
        <ion-footer>
          <ion-toolbar class='pager'>
            <ion-buttons slot='start'>
              <ion-button class={this.prevClass} clear={true} onClick={() => this.previous()}>
                prev
          </ion-button>
            </ion-buttons>
            <span class='page-number'>
              page {this.page}
            </span>
            <ion-buttons slot='end'>
              <ion-button color='primary' clear={true} onClick={() => this.next()}>
                next
          </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-footer>
      ];
    } else {
      return [
        <ion-header mdHeight='56px' iosHeight='61px'>
          <ion-toolbar color='primary'>

            <ion-buttons>
              <ion-icon name='ionic'></ion-icon>
            </ion-buttons>

            <div class='tabs-bar'>
              <ion-button
                class={{
                  'header-button': true,
                  'first-button': true,
                  'header-button-selected': this.firstSelectedClass
                }}
                clear
                onClick={() => this.getStories('news')}
              >
                News
          </ion-button>
              <ion-button
                class={{
                  'header-button': true,
                  'header-button-selected': this.secondSelectedClass
                }}
                clear
                onClick={() => this.getStories('show')}
              >
                Show
          </ion-button>
              <ion-button
                class={{
                  'header-button': true,
                  'header-button-selected': this.thirdSelectedClass
                }}
                clear
                onClick={() => this.getStories('jobs')}
              >
                Jobs
          </ion-button>
              <ion-button
                class={{
                  'header-button': true,
                  'header-button-selected': this.fourthSelectedClass
                }}
                clear
                onClick={() => this.getStories('ask')}
              >
                Ask
          </ion-button>
            </div>
          </ion-toolbar>
        </ion-header>,
        <ion-footer>
          <ion-toolbar class='pager'>
            <ion-buttons slot='start'>
              <ion-button class={this.prevClass} clear={true} onClick={() => this.previous()}>
                prev
          </ion-button>
            </ion-buttons>
            <span class='page-number'>
              page {this.page}
            </span>
            <ion-buttons slot='end'>
              <ion-button color='primary' clear={true} onClick={() => this.next()}>
                next
          </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-footer>
      ]
    }
  }
}
