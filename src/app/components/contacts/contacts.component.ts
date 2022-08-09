import { Component, OnInit } from '@angular/core';
import { Contacts } from '@capacitor-community/contacts'

export interface PermissionStatus {
  granted: boolean;
}

export interface Contact {
  contactId: string;
  displayName?: string;
  phoneNumbers: PhoneNumber[];
  emails: EmailAddress[];
  photoThumbnail?: string;
  organizationName?: string;
  organizationRole?: string;
  birthday?: string;
}

export interface PhoneNumber {
  label?: string;
  number?: string;
}

export interface EmailAddress {
  label?: string;
  address?: string;
}


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  newContacts: any[] = []
  loading = false;
  errorContacts = false;
  didOnce = false;

  constructor() { }

  ngOnInit(): void {
    //this.execute();
    Contacts.getPermissions().then(() => {

    }).catch(() => {
      this.errorContacts = false;
    })
  }

  async execute(){
    this.newContacts = [];
    this.loading = true;
    await Contacts.getContacts().then(result => {
      console.log("newContacts", result);
      this.didOnce = true;
      let contacts = [];
      for (let i = 0; i < result.contacts.length; i++) {
        const element = result.contacts[i];
        if(element.displayName && element.contactId && element.phoneNumbers.length){
          const newCon = {
            displayName:element.displayName,
            contactId:element.contactId,
            phoneNumbers:element.phoneNumbers,
            phoneNumber:element.phoneNumbers[0].number,
          }
          contacts.push(element)
        }
        if(result.contacts.length == (i + 1)){
          this.loading = false;
          this.newContacts = contacts;
        }
      }
    }).catch(err => {
      this.newContacts = [];
      this.loading = false;
      this.errorContacts = true;
      console.log("newContacts", err)
    });
  }

}
