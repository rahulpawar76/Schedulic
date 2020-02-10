import { Injectable } from '@angular/core'; 
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Question, Element, Category, Proof } from '../_models/model';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { User } from '@app/_models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})

export class QuestionService { 
  responseData:any;
  public showQuestion:number; 
  public element:string;
  public welcome:boolean;
  Questions: Question[];
  Elements: Element[];
  Categories: Category[];
  Proofs: Proof[];
  Users: User[];  
  currentUser: User;  
  public userID:number;
  public token:string="";

  constructor(private http: HttpClient, public router:Router, private authenticationService: AuthenticationService) {
    this.welcome = true;   
    this.currentUser = this.authenticationService.currentUserValue;  
   }

  ngOnInit() {
    /*Set the user id */
  }

  /*update(Question: Question): Observable<Question[]> {
    return this.http.put(`${environment.apiUrl}/maturity/update`, { data: Question })
      .pipe(map((res) => {
        const theCar = this.Questions.find((item) => {
          return +item['id'] === +Question['id'];
        });
        return this.Questions;
      }),
        catchError(this.handleError));
  } */
 
/* API for to delete question */
deleteQuestion(id: number,token: string, user_id: number): Observable<Question[]> {
  let headers = new HttpHeaders({
        'Authorization':  token
      });

  const params = new HttpParams()
    .set('id', id.toString());

  return this.http.post(`${environment.apiUrl}/maturity/deleteQuestion`, { id: id,user_id: user_id },{headers:headers})
    .pipe(map(res => {
      const filteredQuestions = this.Questions.filter((Question) => {
        return +Question['id'] !== +id;
      });
      return this.Questions = filteredQuestions;
    }),
  catchError(this.handleError));
}

/* API for delete answers of the particular question */
deleteAnswers(id: number,token: string, user_id: number): Observable<Question[]> {
  let headers = new HttpHeaders({
        'Authorization':  token
      });

  const params = new HttpParams()
    .set('id', id.toString());

  return this.http.post(`${environment.apiUrl}/maturity/deleteAnswers`, { id: id,user_id: user_id },{headers:headers})
    .pipe(map(res => {
      const filteredQuestions = this.Questions.filter((Question) => {
        return +Question['id'] !== +id;
      });
      return this.Questions = filteredQuestions;
    }),
  catchError(this.handleError));
}


/* API for delete session */
DeleteSessionWithData(jsonSessionData){
  let headers = new HttpHeaders({
        'Authorization':  jsonSessionData.token
      });

  return this.http.post(`${environment.apiUrl}/maturity/DeleteSessionWithData`, jsonSessionData,{headers:headers})
    .pipe(map((res) => {
      return res['data'];
    }),
  catchError(this.handleError));
}




  private handleError(error: HttpErrorResponse) {
    /*console.log(error);*/
    return throwError('Error! something went wrong.');
  }
   
  /*Question Functions*/
  getQuestions(jsonElement): Observable<Question[]> {    
    let headers = new HttpHeaders({
            'Authorization':  jsonElement.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/getQuestions`,jsonElement,{headers:headers}).pipe(
      map((res) => {
          this.Questions = res['data'];
          return this.Questions;
       
      }),
      catchError(this.handleError));
  }

  getElements(myuser){
     let headers = new HttpHeaders({
            'Authorization':  myuser.token
          });
    
    return this.http.post(`${environment.apiUrl}/maturity/getElements`,myuser,{headers:headers}).pipe(
      map((res) => {
        //alert(JSON.stringify(res['data']));
        this.Elements = res['data'];
        return this.Elements;        
      }),
      catchError(this.handleError));
  }

  getPerformanceAreas(jsonData) {
     let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/getPerformanceAreas`,jsonData,
{headers:headers}).pipe(
      map((res) => {
        return res['data'];
        
      }),
      catchError(this.handleError));
  }

  getMaturityReporting(jsonData) {
     let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/getMaturityReporting`,jsonData,
{headers:headers}).pipe(
      map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  get5BiggestGapsPractice(jsonData) {
     let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/Get5BiggestGapsPractice`,jsonData,
{headers:headers}).pipe(
      map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  get5BiggestGapsPerformance(jsonData) {
     let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/Get5BiggestGapsPerformance`,jsonData,
{headers:headers}).pipe(
      map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  saveProofsFunction(proofJson){
    let headers = new HttpHeaders({
           'Authorization':  proofJson.token
         });
   return this.http.post(`${environment.apiUrl}/maturity/saveProofApi`,proofJson,{headers:headers})
     .pipe(map((res) => {
       //this.Questions.push(res['data']);
       return res;
     }),
       catchError(this.handleError));
 }


 getProofs(Proofs){
  let headers = new HttpHeaders({
          'Authorization':  Proofs.token
        });
  return this.http.post(`${environment.apiUrl}/maturity/getProofs`,Proofs,{headers:headers}).pipe(
    map((res) => {
      return res;
      
    }),
    catchError(this.handleError));
}

savePerformanceArea(ArrayValues){
  let headers = new HttpHeaders({
          'Authorization':  ArrayValues.token
        });
  return this.http.post(`${environment.apiUrl}/maturity/SavePerformanceArea`,ArrayValues,{headers:headers}).pipe(
    map((res) => {
      return res;
      
    }),
    catchError(this.handleError));
}

SavePerformanceDesired(desiredJson){
    //alert(JSON.stringify(desiredJson));
    let headers = new HttpHeaders({
            'Authorization':  desiredJson.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/SavePerformanceDesired`, desiredJson,{headers:headers})
      .pipe(map((res) => {
        return res;
      }),
        catchError(this.handleError));
  }
  getPerformanceAnswerByArea(jsonData) {
     let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/getPerformanceAnswerByArea`,jsonData,
{headers:headers}).pipe(
      map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getPerformanceQuestions(jsonData) {
     let headers = new HttpHeaders({
            'Authorization':  jsonData.token
      });
    return this.http.post(`${environment.apiUrl}/maturity/getPerformance`,jsonData,
{headers:headers}).pipe(
      map((res) => { 
        //this.Questions = res['data'];
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getPerformanceQuestionsByArea(jsonData) {
     let headers = new HttpHeaders({
            'Authorization':  jsonData.token
      });
    return this.http.post(`${environment.apiUrl}/maturity/GetPerformanceQuetions`,jsonData,
{headers:headers}).pipe(
      map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getElementsByCat(jsonData) {
    let headers = new HttpHeaders({
            'Authorization':  jsonData.token
      });
    return this.http.post(`${environment.apiUrl}/maturity/getElementsByCat`,jsonData,{headers:headers}).pipe(
      map((res) => {
        //this.Questions = res['data'];
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getAnswersByElement(jsonData) {
     let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/getAnswersByElement`, jsonData,{headers:headers}).pipe(
      map((res) => {
        //this.Questions = res['data'];
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getMCByElement(jsonData) {
     let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/getMCByElement`, jsonData,{headers:headers}).pipe(
      map((res) => {
        //this.Questions = res['data'];
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getPerformanceMCByArea(jsonData) {
     let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/GetPerformanceMCByArea`, jsonData,{headers:headers}).pipe(
      map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  GetPerformanceMCByArea_User(jsonData) {
     let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/GetPerformanceMCByAreaUser`, jsonData,{headers:headers}).pipe(
      map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getPerformanceMCAll(jsonData) {
    let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/GetPerformanceMCAll`, jsonData,{headers:headers}).pipe(
      map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getMCAll(jsonData) {
    let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/getMCAll`, jsonData,{headers:headers}).pipe(
      map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getMCanswers(myUser) {
    let headers = new HttpHeaders({
            'Authorization':  myUser.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/getMCByElementUser`, myUser,{headers:headers}).pipe(
      map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getTop5Elements(jsonData) {
    let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/getTop5Elements`, jsonData,{headers:headers}).pipe(
      map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getBottom5Elements(jsonData) {
    let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/getBottom5Elements`, jsonData,{headers:headers}).pipe(
      map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getTop5Questions(jsonData) {
    let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/getTop5Questions`, jsonData,{headers:headers}).pipe(
      map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getBottom5Questions(jsonData) {
    let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/getBottom5Questions`,jsonData,{headers:headers}).pipe(
      map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getDesiredByElement(jsonData) {
     let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/getDesiredByElement`, jsonData,{headers:headers}).pipe(
      map((res) => {
        //this.Questions = res['data'];
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getDesiredByElementUser(jsonData) {
     let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/GetDesiredByElementUser`, jsonData,{headers:headers}).pipe(
      map((res) => {
        //this.Questions = res['data'];
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getProofByElement(jsonData) {
    let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/getProofByElement.php`, jsonData,{headers:headers}).pipe(
      map((res) => {
        //this.Questions = res['data'];
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getProofByElementUser(jsonData) {
    let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/GetProofByElementUser`, jsonData,{headers:headers}).pipe(
      map((res) => {
        //this.Questions = res['data'];
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getCategories(myuser) {
     let headers = new HttpHeaders({
            'Authorization':  myuser.token
          });
     //alert(myuser.token);
    return this.http.post(`${environment.apiUrl}/maturity/getCategories`,myuser,{headers:headers}).pipe(
      map((res) => {
        this.Categories = res['data'];
        return this.Categories;
        
      }),
      catchError(this.handleError));
  }

 

  getProof(Proof){
    let headers = new HttpHeaders({
            'Authorization':  Proof.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/getProof`,Proof,{headers:headers}).pipe(
      map((res) => {
        if(res['data']){
          this.Proofs = res['data'];
        }else{
          this.Proofs=[];
        }
        
        return this.Proofs;
      }),
      catchError(this.handleError));
  }

  getProofTypes(Proof){
    let headers = new HttpHeaders({
      'Authorization':  Proof.token
    });
    return this.http.post(`${environment.apiUrl}/maturity/getProof/getAllProofTypes`,Proof,{headers:headers}).pipe(
    map((res) => {
      return res['data'];
    }),
    catchError(this.handleError));
  }
 
  
  /////////////////////////////////////////
  //CREATE AND UPDATE Question
  /////////////////////////////////////////

  saveQuestion(token: string, user_id: number,element: number, question: string, reactive: string, compliant: string, proactive: string, resilient: string) {
    let headers = new HttpHeaders({
            'Authorization':  token
          });
        return this.http.post<any>(`${environment.apiUrl}/maturity/saveQuestion`, { user_id,element, question, reactive, compliant, proactive, resilient },{headers:headers})
        .pipe(map(res => {
          this.Questions.push(res['data']);
          return this.Questions;
        }),
        catchError(this.handleError));
  }
  
  saveElement(token: string,name: string, category: number, sequence: number, user_id: number) {
    let headers = new HttpHeaders({
            'Authorization':  token
          });
        return this.http.post<any>(`${environment.apiUrl}/maturity/saveElement`, { user_id, name, category, sequence },{headers:headers})
        .pipe(map(res => {
          this.Elements = res['data'];
          return this.Elements;
        }),
        catchError(this.handleError));
  }

  saveMC(mcJson){
   // alert(JSON.stringify(mcJson));
    let headers = new HttpHeaders({
            'Authorization':  mcJson.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/saveMC`, mcJson, {headers:headers})
      .pipe(map((res) => {
        //this.Questions.push(res['data']);
        return res;
      }),
        catchError(this.handleError));
  }

  savePerformanceMC(mcJson){
    //alert(JSON.stringify(mcJson));
     let headers = new HttpHeaders({
            'Authorization':  mcJson.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/savePerformanceMC`, mcJson, {headers:headers}
)
      .pipe(map((res) => {
        //this.Questions.push(res['data']);
        return res;
      }),
        catchError(this.handleError));
  }

  saveDesired(desiredJson){
    //alert(JSON.stringify(desiredJson));
    let headers = new HttpHeaders({
            'Authorization':  desiredJson.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/saveDesired`, desiredJson,{headers:headers})
      .pipe(map((res) => {
        //this.Questions.push(res['data']);
        return res;
      }),
        catchError(this.handleError));
  }

  saveProofs(proofJson){
     let headers = new HttpHeaders({
            'Authorization':  proofJson.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/saveProof`,proofJson,{headers:headers})
      .pipe(map((res) => {
        //this.Questions.push(res['data']);
        return res;
      }),
        catchError(this.handleError));
  }

  saveComplete(completeJson){
    //alert(JSON.stringify(completeJson));
     let headers = new HttpHeaders({
            // 'Authorization':  this.token
            'Authorization':  completeJson.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/saveComplete`, completeJson,{headers:headers})
      .pipe(map((res) => {
        //this.Questions.push(res['data']);
        return res;
      }),
        catchError(this.handleError));
  }


  /////////////////////////////////////////
  //USER FUNCTIONS
  /////////////////////////////////////////

  getUser(user) {
    return this.http.post(`${environment.apiUrl}/maturity/maturity/getUser.php`, { data: user }).pipe(
      map((res) => {
        //this.Questions = res['data'];
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getComplete(myuser) { 
    let headers = new HttpHeaders({
            'Authorization':  myuser.token
          });
    //alert(myuser.token);
    return this.http.post(`${environment.apiUrl}/maturity/getComplete`, myuser,{headers:headers}).pipe(
      map((res) => {
        //this.Questions = res['data'];
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getAllUsers(myuser): Observable<User[]> {
    let headers = new HttpHeaders({
            'Authorization':  myuser.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/getAllUsers`,myuser,{headers:headers}).pipe(
      map((res) => {
        this.Users = res['data'];
        return this.Users;
        
      }),
      catchError(this.handleError));
  }
  
  SaveAttendees(userObject): Observable<any> {
    
    return this.http.post(`${environment.apiUrl}/SaveAttendees`, userObject)
      .pipe(map((res) => {

        return res;
      }),
      catchError(this.handleError));
  }
  
  GetAllSessions(userObject): Observable<any> {
    
    return this.http.post(`${environment.apiUrl}/maturity/GetAllSessions`, userObject)
      .pipe(map((res) => {

        return res;
      }),
      catchError(this.handleError));
  }
  
  InviteAttendees(userObject): Observable<any> {
    let headers = new HttpHeaders({
            'Authorization':  userObject.token
          });
    return this.http.post(`${environment.apiUrl}/InviteAttendees`, userObject,{headers:headers})
      .pipe(map((res) => {

        return res;
      }),
      catchError(this.handleError));
  }

  statusUpdate(userObject): Observable<any> {
     return this.http.post(`${environment.apiUrl}/InviteAttendees/statusUpdate`, userObject)
        .pipe(map((res) => {
          return res;
        }),
        catchError(this.handleError));
      
  }

  isExpiryOrNot(userObject): Observable<any> {
     return this.http.post(`${environment.apiUrl}/InviteAttendees/GetExpiredStatus`, userObject)
        .pipe(map((res) => {
          return res;
        }),
        catchError(this.handleError));
      
  }

  getPerformanceDesiredByArea(jsonData) {
     let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/GetPerformanceDesiredByArea`, jsonData,{headers:headers}).pipe(
      map((res) => {
        //this.Questions = res['data'];
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getUsersByRole(myuser): Observable<User[]> {
    let headers = new HttpHeaders({
            'Authorization':  myuser.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/GetSessionProgress/getUsersByRole`,myuser,{headers:headers}).pipe(
      map((res) => {
        this.Users = res['data'];
        return this.Users;
        
      }),
      catchError(this.handleError));
  }

  getPerformaceAnswers(myuser): Observable<any>{
    let headers = new HttpHeaders({
            'Authorization':  myuser.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/GetSessionProgress/get_answers_of_performance`,myuser,{headers:headers}).pipe(
      map((res) => {
        return res;
        
      }),
      catchError(this.handleError));
  }

  fnDeletePerformanceAnswer(jsonData): Observable<any>{
    let headers = new HttpHeaders({
            'Authorization':  jsonData.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/GetSessionProgress/DeleteAnswerOfPerformance`,jsonData,{headers:headers}).pipe(
      map((res) => {
        return res;        
      }),
      catchError(this.handleError));
  }

  getPracticeAnswers(myuser): Observable<any>{
    let headers = new HttpHeaders({
            'Authorization':  myuser.token
          });
    return this.http.post(`${environment.apiUrl}/maturity/GetSessionProgress/getAnswersOfPractice`,myuser,{headers:headers}).pipe(
      map((res) => {
        return res;
        
      }),
      catchError(this.handleError));
  }

  fnDeletePracticeAnswer(jsonData): Observable<any>{
      let headers = new HttpHeaders({
              'Authorization':  jsonData.token
            });
      return this.http.post(`${environment.apiUrl}/maturity/GetSessionProgress/DeleteAnswerOfPractice`,jsonData,{headers:headers}).pipe(
        map((res) => {
          return res;        
        }),
        catchError(this.handleError));
  }
  // Created By Arshad 14/11/2019

saveEmailTemplate(templateObject): Observable<any> {
// alert(JSON.stringify(templateObject));
let headers = new HttpHeaders({
'Authorization': templateObject.token,
'Content-Type':'application/json'
});
return this.http.post(`${environment.apiUrl}/SaveEmailTemplate`, templateObject, { headers: headers }).pipe(
map((res) => {
return res;
}),
catchError(this.handleError));
}

getEmailTemplate(templateObject): Observable<any> {
// alert(JSON.stringify(templateObject));
let headers = new HttpHeaders({
'Authorization': templateObject.token,
'Content-Type':'application/json'
});
return this.http.post(`${environment.apiUrl}/GetAllEmailTemplates`, templateObject, { headers: headers }).pipe(
map((res) => {
return res;
}),
catchError(this.handleError));
}

fnUpdateEmailTemplate(templateObject): Observable<any> {
// alert(JSON.stringify(templateObject));
let headers = new HttpHeaders({
'Authorization': templateObject.token,
'Content-Type':'application/json'
});
return this.http.post(`${environment.apiUrl}/UpdateEmailTemplate`, templateObject, { headers: headers }).pipe(
map((res) => {
return res;
}),
catchError(this.handleError));
}
fnDeleteEmailTemplate(templateObject): Observable<any> {
// alert(JSON.stringify(templateObject));
let headers = new HttpHeaders({
'Authorization': templateObject.token,
'Content-Type':'application/json'
});
return this.http.post(`${environment.apiUrl}/DeleteEmailTemplate`, templateObject, { headers: headers }).pipe(
map((res) => {
return res;
}),
catchError(this.handleError));
}

saveSession(jsonObject,jsonSession): Observable<any> {
  let site_url = environment.urlForLink;
  let headers = new HttpHeaders({
    'Authorization': jsonObject.token,
    'Content-Type':'application/json'
  });
  return this.http.post(`${environment.apiUrl}/maturity/SaveSession`, {jsonSession : jsonSession,user_id : jsonObject.user_id,site_url : site_url}, { headers: headers }).pipe(
    map((res) => {
    return res['data'];
  }),
  catchError(this.handleError));
}

} 
