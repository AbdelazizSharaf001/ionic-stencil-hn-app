import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'comments-list'
})
export class CommentsList {

  @Prop() type: any;

  render() {
    const items = this.type.map((comment) => {
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
