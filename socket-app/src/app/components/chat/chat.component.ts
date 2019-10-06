import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContent') private myScrollContainer: ElementRef;

  constructor(private socket: Socket) { }

  name;
  message;
  who = '';
  members = 1;
  messages = [];
  public containers: any[] = [];

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  onInputChange() {
    this.socket.emit('somebody-is-writing', this.name);
  }
  // enter lenyomasara kuldje el a messaget
  keyDownFunction(event) {
    if ( event.keyCode === 13) {
      this.sendMessage();
    }
  }
  // elkuldi a messaget szervernek illetve hozzaadja a chathez
  sendMessage() {
    this.socket.emit('send-chat-message', this.message);
    this.containers.push({ name: '', message: this.message, who: 'me' });
    this.scrollToBottom(); // koveti a legujabb uzeneteket
    this.message = '';
  }

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  ngOnInit() {
    this.name = prompt('What is your name?');
    this.socket.emit('new-user', this.name);
    // bejon uzenet masik usertol
    this.socket.on('chat-message', data => {
      this.containers.push({ name: data.name, message: data.message, who: 'partner' });
      this.scrollToBottom();
    });
    // masik user eppen ir
    this.socket.on('writing', name => {
      if ( this.who === '' ) {
        this.who = name + '...';
      } else {
        if ( !this.who.includes(name) ) {
          this.who += name + '...';
        }
      }
      setTimeout(() => {
        this.who = '';
      }, 4000);
    });
    // ha valaki csatlakozik elkuldi az eddigi uzeneteket
    this.socket.on('message-list', messages => {
      for (const message of messages) {
        this.containers.push({ name: message.name, message: message.message, who: message.who });
        this.scrollToBottom();
      }
    });

    this.socket.on('user-number', userNumber => {
      this.members = userNumber;
    });

    this.socket.on('user-connected', name => {
      this.containers.push({name: name, message: 'joined', who: 'connection'});
      this.scrollToBottom();
    });

    this.socket.on('user-disconnected', name => {
      this.containers.push({name: name, message: 'disconnected', who: 'connection'});
      this.scrollToBottom();
    });
  }

}
