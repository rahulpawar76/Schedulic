import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/_services';
import { User } from '@app/_models';
import { QuestionService } from '@app/_services';
import { AddEmailTemplateComponent } from '../add-email-template/add-email-template.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.scss']
})

export class EmailTemplatesComponent implements OnInit {
  getEmailTemRequest: any;
  currentUser: User;
  token: string = "";
  emailListRequest: any;
  emailList: any;
  error: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public questionService: QuestionService

  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.token = this.currentUser.token;
  }

  ngOnInit() {
    this.fnGetAllEmailTemplate();
  }
  fnGetAllEmailTemplate() {
    this.getEmailTemRequest = {
      "token": this.token,
      "user_id": this.currentUser.id,
    };
    console.log('Request Email', this.getEmailTemRequest);
    this.questionService.getEmailTemplate(this.getEmailTemRequest)
      .subscribe(
        (res: []) => {

          this.emailListRequest = res;
          if (this.emailListRequest.status == "true") {
            this.emailList = this.emailListRequest.response;
          }
        },
        (err) => {
          this.error=err;
        }
      );
  }
  fnEdit(item) {
    // console.log(item);
     this.router.navigate(['/add-email'] , {
       queryParams:{
        template_id : item.template_id,
        heading:item.heading,
        subject : item.subject,
        type:item.type,
        header:item.header,
        body:item.body,
        footer:item.footer,

        }});
  }

  clickMethod(id) {
    if(confirm("Are you sure to delete?")) {
      this.fnDelete(id);
    }
  }

  fnDelete(id){
    let successRespose;
    let deleteTemplate = {
      "token": this.token,
      "user_id": this.currentUser.id,
      "email_template_id":id
    };

    this.questionService.fnDeleteEmailTemplate(deleteTemplate)
      .subscribe(
        (res: []) => {
          successRespose = res;
          if (successRespose.status == "true") {
            console.log(successRespose.response);
            this.ngOnInit();
          }
        },
        (err) => {
          console.log(JSON.stringify(err));
        }
      );
  }
}
