import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'comments-list',
  styleUrl: 'comments-list.scss'
})
export class CommentsList {

  @Prop() commentList: any;

  render() {
    const items = this.commentList.map((comment) => {
      return (
        <ion-item>
          <ion-label>
            <h2>
              {`Posted by ${comment.user} ${comment.time_ago}`}
            </h2>
            <div innerHTML={comment.content}></div>
          </ion-label>
        </ion-item>
      );
    });

    return (
      <ion-list>
        {items}
      </ion-list>
    );
  }
}
