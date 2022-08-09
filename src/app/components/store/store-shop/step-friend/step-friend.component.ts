import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-step-friend',
  templateUrl: './step-friend.component.html',
  styleUrls: ['./step-friend.component.scss']
})
export class StepFriendComponent implements OnInit {
  codeData:any = null;
  store:any = null;
  camp:any = null;
  say = ""
  storeCat = ""

  constructor(
    private dialogRef: MatDialogRef<StepFriendComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public auth: AuthService,
    ) { 
    }

  ngOnInit(): void {
      if(!this.data.codeData || !this.data.store || !this.data.camp){
        console.log("Something went wrong...")
        console.log(this.data)
      }else{
        this.codeData = this.data.codeData;
        this.store = this.data.store;
        this.camp = this.data.camp;
        console.log(this.codeData, this.store, this.camp)
        for (let i = 0; i < this.codeData.say.length; i++) {
          const element = this.codeData.say[i];
          this.say = this.say + "#" + element + " ";
        }
        const cat = this.auth.resource.categoryList[this.auth.resource.categoryList.findIndex((x:any) => x.id == this.store.cat)];
        const b = cat?.items.findIndex((x:any) => x.id == this.store.subCat)
        this.storeCat = cat?.items[b].name;
      }
  }

  startNow(){
    this.dialogRef.close({success:true, now:true})
  }

  saveLater(){
    this.dialogRef.close({success:true, now:false})
  }

}
