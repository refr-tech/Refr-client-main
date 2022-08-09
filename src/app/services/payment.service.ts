import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, collectionData, doc, Firestore, limit, orderBy, query, updateDoc, where, FieldValue, increment, serverTimestamp } from '@angular/fire/firestore';
import { getDoc, onSnapshot } from '@firebase/firestore';
import { StringFormat } from '@firebase/storage';
import { docData } from 'rxfire/firestore';
//import { AngularFireAuth } from '@angular/fire/compat/auth';
//import { AngularFirestore } from '@angular/fire/compat/firestore';

//import app from 'firebase/compat/app';
import { of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../universal.model';
import { ResourceService } from './resource.service';

/*
name	uppercase	lowercase
alpha	Α	α
beta	Β	β
gamma	Γ	γ
delta	Δ	δ - SENT 2 THE COMPANY
epsilon	Ε	ε
zeta	Ζ	ζ
eta	Η	η
theta	Θ	θ
iota	Ι	ι
kappa	Κ	κ
lambda	Λ	λ
mu	Μ	μ
nu	Ν	ν
xi	Ξ	ξ
omicron	Ο	ο
pi	Π	π
rho	Ρ	ρ
sigma	Σ	σ
tau	Τ	τ
upsilon	Υ	υ
phi	Φ	φ
chi	Χ	χ
psi	Ψ	ψ
omega	Ω	ω
*/


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  gWay:string = "walt";

  razorpayOptions = {}

  constructor(
    private httpClient: HttpClient,
    //public afAuth: AngularFireAuth,
    public afAuth: Auth,
    //private afs: AngularFirestore,
    private firestore: Firestore,
    public resource: ResourceService
  ) { }

  get getServerTimestamp(){ return serverTimestamp; }


  startGatewayOrder(data:any){
    const newTimestamp = this.getServerTimestamp();
    let type:string[] = [
      data.ordrTYPE, data.by, data.to, data.sid
    ];
    let refer = null;
    if(!data.journey){ 
  type = [
      //"addORDER", "storeORDER", "clientAc", data.ordrTYPE, data.by, data.to, data.sid
  ] }

    if(data.journey == "BURN"){
      const CUST = [ "storeORDER", "clientAc", "addORDER", "BURN", data.code, ];
      for (let o = 0; o < CUST.length; o++) {
        type.push( CUST[o] );
      }
      refer = null; 
      console.log("I AM BURN")
    }

    if(data.journey == "POS"){
      const CUST = [ "storeORDER", "clientAc", "POS", "REDEEM", data.code, ];
      for (let o = 0; o < CUST.length; o++) {
        type.push( CUST[o] );
      }
      refer = null; 
    }

    if(data.journey == "F2F" && data.logistics.typeOrdr == "F2F_OFFLINE"){ // THIS IS OFFLINE REDEEM
      const CUST = [ "storeORDER", "clientAc", "F2F", "REDEEM", data.code, ];
      for (let o = 0; o < CUST.length; o++) {
        type.push( CUST[o] );
      }
      refer = data.refer;
    }

    if(data.journey == "F2F" && data.logistics.typeOrdr == "F2F_ONLINE"){
      const CUST = [ "addORDER", "storeORDER", "clientAc", "F2F", data.code, ];
      for (let o = 0; o < CUST.length; o++) {
        type.push( CUST[o] );
      }
      refer = data.refer;
    }

    if(data.journey == "DIRECT" && data.logistics.typeOrdr == "DIRECT_ONLINE" ){
      const CUST = [ "addORDER", "storeORDER", "clientAc", "DIRECT", ];
      for (let o = 0; o < CUST.length; o++) {
        type.push( CUST[o] );
      }
      refer = null;
    }
    if(data.journey == "DIRECT" && data.logistics.typeOrdr == "DIRECT_OFFLINE" ){
      const CUST = [ "storeORDER", "clientAc", "DIRECT", ];
      for (let o = 0; o < CUST.length; o++) {
        type.push( CUST[o] );
      }
      refer = null;
    }

    const dataSend:any = { 
      type:type,
      by:data.by, to:data.to, sid:data.sid,  
      storeName: data.storeName, userName: data.userName,
      journey:data.journey, camp: data.camp, cart: data.cart,
      code: data.code,
      invoice: data.invoice, 
      earn:data.earn, 
      refr:refer,
      ordrTYPE: data.ordrTYPE,
      logistics: data.logistics,
      amSale:data.amSale, amCost:data.amCost, amSave:data.amSave, 
      amTotal:data.amTotal,
      sin: newTimestamp, upd: newTimestamp, com: newTimestamp,
      status:0
      /*
      amRate:data.amRate, amCamp:data.amCamp, amMerc:data.amMerc, 
      */
    }
    console.log("dataSend",dataSend);
    const gWayRefC = collection(this.firestore, `${this.gWay}`);
    return addDoc(gWayRefC, dataSend).then(ref => {
      const gWayRef = doc(this.firestore,`${this.gWay}`, `${ref.id}`)
      return updateDoc(gWayRef, {id:ref.id}).then(() => {return ref;})
    })
  }

/*
  startGatewaySign(data:any){
    const newTimestamp = this.getServerTimestamp();
    const dataSend:any = { 
      type:["addBalance", "firstBalance", "vendorAc", data.by], 
      by:data.by, to:"Δ", 
      amRate:data.amRate, amCamp:data.amCamp, amMerc:data.amMerc, amSale:data.amSale, amCost:data.amCost, amSave:data.amSave, 
      amTotal:data.amTotal,
      sin: newTimestamp, upd: newTimestamp, com: newTimestamp
    }
    console.log("dataSend",dataSend);
    const gWayRefC = collection(this.firestore, `${this.gWay}`);
    return addDoc(gWayRefC, dataSend).then(ref => {
      const gWayRef = doc(this.firestore,`${this.gWay}`, `${ref.id}`)
      return updateDoc(gWayRef, {id:ref.id}).then(() => {return ref;})
    })
  }

  startGatewayCamp(data:any){
    const newTimestamp = this.getServerTimestamp();
    const dataSend:any = { 
      type:["addBalance", "campaignBalance", "vendorAc", data.by], 
      by:data.by, to:"Δ", 
      amRate:data.amRate, amCamp:data.amCamp, 
      //amMerc:data.amMerc, 
      amSale:data.amSale, amCost:data.amCost, amSave:data.amSave, 
      amTotal:data.amTotal,
      sin: newTimestamp, upd: newTimestamp, com: newTimestamp
    }
    console.log("dataSend",dataSend);
    const gWayRefC = collection(this.firestore,`${this.gWay}`);
    return addDoc(gWayRefC, dataSend).then(ref => {
      const gWayRef = doc(this.firestore,`${this.gWay}`, `${ref.id}`)
      return updateDoc(gWayRef, {id:ref.id}).then(() => {return ref;})
    })
  }
  */



  onlinePaymentNew(iso:string, obj:any){
    //return this.http.post<any>(`${environment.baseURL}/payment/initPaymentNew`, obj)
    const body = {
      type:"razorpay",
      gwID:"",
      amount:obj.amount, currency:obj.currency,
      amount_paid:obj.amount_paid,
      amount_due:obj.amount_due,
      receipt:obj.orderId,

      name: obj.name,
      description: obj.description,
      userData: obj.userData,
      theme: obj.theme,
      status:0
    }
    console.log("send payment")
    return this.httpClient.post(`${environment.server}/api/payments/sendPayment/${ iso }`, body);
  }

  verifyPayment(iso:string, obj:any){
    //return this.http.post<any>(`${environment.baseURL}/payment/initPaymentNew`, obj)
    const body = {
      type:"razorpay",
      amount:obj.amount, currency:obj.currency,
      gwID:obj.paymentId, gwSIGN:obj.signature, gwORDR:obj.order_id,
    }
    console.log("verify payment")
    return this.httpClient.post(`${environment.server}/api/payments/verifyPayment/${ iso }`, body);
  }

  addVendorReserve( uid:string, amt: number ){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, {acBalVr: increment(amt) })
  }
  addClientBalance( uid:string, amt: number ){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, {acBalC:increment(amt)})
  }

  completePayment(id:string, gwID:string, gwSIGN:string, gwORDR:string, gwInfo:any){
    const userRef = doc(this.firestore, `${this.gWay}`, `${id}`);
    return updateDoc(userRef, {gwID:gwID, gwSIGN, gwORDR, status:10, gwInfo:gwInfo});
  }


  updateVendorReserveBURN_ONLINE( uid:string, amt: number ){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, {acBalVr: increment(amt) })
  }
  updateClientBURN_ONLINE( uid:string, amt: number ){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, {acBalC:increment(amt)})
  }

  updateVendorReserveF2F_ONLINE( uid:string, amt: number ){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, {acBalVr: increment(amt) })
  }
  updateClientF2F_ONLINE( uid:string, amt: number ){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, {acBalC:increment(amt)})
  }
  updateClientReserveF2F_ONLINE( uid:string, amt: number ){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, {acBalCr:increment(amt)})
  }
  updateVendorHypeF2F_ONLINE( uid:string, amt: number ){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, {acBalH:increment(amt)})
  }
  updateCodeF2F_ONLINE( id:string, amt: number ){
    //const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    //return updateDoc(userRef, {acBalCr:increment(amt)})
  }
/*
  addVendorBalance(id:string, uid:string, amt: number, gwID:string, gwSIGN:string, gwORDR:string, gwInfo:any){
    const gWayRefC = doc(this.firestore,`${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(gWayRefC, {acBalV:amt}).then(() => {
      return this.completePayment(id, gwID, gwSIGN, gwORDR,gwInfo);
    });
  }
  addVendorReserve(id:string, uid:string, amt: number, gwID:string, gwSIGN:string, gwORDR:string, gwInfo:any){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, {acBalVr:amt}).then(() => {
      return this.completePayment(id, gwID, gwSIGN, gwORDR,gwInfo);
    });
  }
  addVendorHypeBalance(id:string, uid:string, amt: number, gwID:string, gwSIGN:string, gwORDR:string, gwInfo:any){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, { acBalH: increment(amt) }).then(() => {
      return this.completePayment(id, gwID, gwSIGN, gwORDR, gwInfo);
    });
  }
  addClientBalance(id:string, uid:string, amt: number, gwID:string, gwSIGN:string, gwORDR:string, gwInfo:any){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, {acBalC:amt}).then(() => {
      return this.completePayment(id, gwID, gwSIGN, gwORDR,gwInfo);
    });
  }
  addClientReserve(id:string, uid:string, amt: number, gwID:string, gwSIGN:string, gwORDR:string, gwInfo:any){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, {acBalCr:amt}).then(() => {
      return this.completePayment(id, gwID, gwSIGN, gwORDR,gwInfo);
    });
  }
  addClientPointsBalance(id:string, uid:string, amt: number, gwID:string, gwSIGN:string, gwORDR:string, gwInfo:any){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, {acBalP:amt}).then(() => {
      return this.completePayment(id, gwID, gwSIGN, gwORDR,gwInfo);
    });
  }

  completePayment(id:string, gwID:string, gwSIGN:string, gwORDR:string, gwInfo:any){
    const userRef = doc(this.firestore, `${this.gWay}`, `${id}`);
    return updateDoc(userRef, {gwID:gwID, gwSIGN, gwORDR, status:10, gwInfo:gwInfo});
  }

  completeHypePayment(campID:string){
    const userRef = doc(this.firestore, `${this.resource.env.db.hypes}`, `${campID}`);
    return updateDoc(userRef, {paid: true});
  }
*/

  getAllPayments(uid:string, s:number, type:string[]){
    const catData = collection(this.firestore, `${this.gWay}`)
    const qu = query(catData, where("by","==",uid), orderBy("com", "desc"), 
    limit(s));
    return collectionData( qu );
  }

  getAllClientPayments(uid:string, s:number, type:string[]){
    const catData = collection(this.firestore, `${this.gWay}`)
    const qu = query(catData, where("type", "array-contains", "clientAc"), where("by","==",uid), orderBy("com", "desc"), 
    limit(s));
    return collectionData( qu );
  }

  getPayment(id:string){
    const payData = doc(this.firestore, `${this.gWay}`, `${id}`)
    return docData ( payData );
  }

  rejectReedem(id:string){
    const gWayRef = doc(this.firestore,`${this.gWay}`, `${id}`)
    const newTimestamp = this.getServerTimestamp();
    return updateDoc(gWayRef, { status:-10, upd:newTimestamp })
  }

/*
  getAllOrders(uid:string, s:number, type:string[]){
    const catData = collection(this.firestore, `${this.gWay}`)
    const qu = query(catData, where("to","==",uid),where("type","array-contains-any",type), orderBy("com", "desc"), limit(s));
    return collectionData( qu );
  }
*/

updateCodeSay(code:string, emoji:string, say:any, talk:string){
  const newTimestamp = this.getServerTimestamp();
  const codeRef = doc(this.firestore, `${this.resource.env.db.codes}`, `${code}`);
  return updateDoc(codeRef, 
    {
      say:say,
      emoji:emoji,
      talk:talk
    })
}

getTransaction(id:StringFormat){
  const userRef = doc(this.firestore, `${this.gWay}`, `${id}`);
  return getDoc(userRef);
}

cashbackDIRECT(
  id:string, ordrId:string, 
  uidC:string, amtC:number,
  uidV:string, amtV:number // ordr amount to be transfered
  ){
  const clientRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uidC}`);
  const vendorRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uidV}`);
  // CREATE 
    const informDoc = doc(this.firestore,`${this.resource.env.db.inform}`, `${id}`)
    return updateDoc(informDoc, {status:false}).then(() => {
      return updateDoc(clientRef, { acBalC: increment(amtC), acBalCr: increment(-amtC) }).then(() => {// purchased by
        return updateDoc(vendorRef, { acBalV: increment(amtV), acBalVr: increment(-amtV) }).then(() => {// transfer reserve to real
          return this.changeStatusOnline(ordrId //, 10, newLO
          )
        })
      })
    })
}

cashbackF2F(
  id:string, ordrId:string, 
  uidC:string, amtC:number, 
  uidV:string, amtV:number, // ordr amount to be transfered
  uidR:string, amtR:number
  ){
  const clientRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uidC}`);
  const clientRefVia = doc(this.firestore, `${this.resource.env.db.users}`, `${uidR}`);
  const vendorRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uidV}`);

    // CREATE 
    ///return addDoc(informRefC, dataSend).then(informRef => {// purchased by
      const informDoc = doc(this.firestore,`${this.resource.env.db.inform}`, `${id}`)
      return updateDoc(informDoc, {status:false}).then(() => {
        return updateDoc(clientRef, { acBalC: increment(amtC), acBalCr: increment(-amtC) }).then(() => {// purchased by
          return updateDoc(clientRefVia, { acBalC: increment(amtR), acBalCr: increment(-amtR) }).then(() => { // refered by
            return updateDoc(vendorRef, { acBalV: increment(amtV), acBalVr: increment(-amtV) }).then(() => {// transfer reserve to real
              return this.changeStatusOnline(ordrId //, 10, newLO
                )
            })
          })
        })
      })
    ///})
}

changeStatusOnline(id:string //, status:number, loStatus:any
  ){
  const newTimestamp = this.getServerTimestamp();
  const gWayRef = doc(this.firestore,`${this.gWay}`, `${id}`)
  return updateDoc(gWayRef, {
    //status:status, logistics:loStatus, 
    //com:newTimestamp
    done:newTimestamp
  })
}

}
