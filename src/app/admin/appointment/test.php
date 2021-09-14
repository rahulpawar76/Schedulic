<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Controllers\DynamicMailSendController;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Mail\Mailer;
use App\Mail\CustomerRegister;
use App\Mail\MyEmail;
use App\Order;
use App\OrderItem;
use App\Discount_coupon;
use App\AnyStaffAssignBooking;
use App\User;
use App\Customer;
use App\settings;
use App\Service;
use App\Payments;
use App\GaLogs;
use App\Email_templates;
use App\Sms_templates;
use App\Business;
use App\DefaultEmailTemplate;
use App\DefaultSmsTemplate;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\EmailSendSettingController;
use App\Http\Controllers\SmsSendSettingController;
use Carbon\Carbon;

class OrderExisitingController extends Controller
{
	public function __construct()
	{
		//$this->middleware('auth');
		$this->dynamicMail = new DynamicMailSendController;
	}
	public function orderNewCreate(Request $request)
	{
		/*$this->validate($request, [
			'business_id'=>'required',
			'customer_email'=> 'required'
		]);*/
		
		$businessInfo = Business::where('id', $request->business_id)->first();
		$getBusiness = $businessInfo;
		//$this->setMailConfig($businessInfo->id);
		if($businessInfo->status == "D")
		{
			return $this->sendResponse("Business not enable.",200,false);
		}
		if($request->created_by == "self")
		{
			$log_status = "C";
		}
		else if($request->created_by == "staff")
		{
			$log_status = "S";
		}
		else
		{
			$log_status = "A";
		}
		$emailCheck = $this->sendingOrderMail($request->business_id);
		$business_id        = $request->business_id;
		$postal_code        = $request->postal_code;
		$customer_email		= $request->customer_email;
		$orderInfo			= $request->serviceInfo;
			
		$first_result = User::where('email',$customer_email)->first();
		if($first_result)
		{
			return $this->sendResponse("email alredy use in staff",200,false);    
		}
		else
		{
			$get_customer = Customer::where(['email'=>$customer_email,'business_id'=>$business_id])->first();
			if($get_customer)
			{
				$customer_id = $get_customer->id;
				$customerResult = Customer::where('id',$customer_id)->update(['fullname'=>$request->customer_name,
						'phone'=>$request->customer_phone,
						'zip'=>$request->appointment_zipcode,
						'address'=>$request->appointment_address,
						'city'=>$request->appointment_city,
						'state'=>$request->appointment_state,
						'business_id'=>$request->business_id
				]);
      		}
			else
			{
				$currentCustomerNo = Customer::where('business_id',$request->business_id)->count();
				$currentPlan = $this->getAdminPlan($businessInfo->admin_id);
				if($currentPlan->plan == null)
				{
					return $this->sendResponse("admin plan not subscribe.",200,false);
				}
				if($currentPlan->plan->customer_limit !== "unlimited")
				{
					if($currentCustomerNo >= $currentPlan->plan->customer_limit)
					{
						return $this->sendResponse("You need upgrade plan.",200,false);
					}
				}
				$password               = substr(md5(uniqid(mt_rand(), true)), 0, 8);
				$customer               = new Customer;
				$customer->fullname     = $request->customer_name;
				$customer->email        = $customer_email;
				$customer->password     = Hash::make($password);
				$customer->phone        = $request->customer_phone;
				$customer->zip          = $request->appointment_zipcode;
				$customer->address      = $request->appointment_address;
				$customer->city         = $request->appointment_city;
				$customer->state        = $request->appointment_state;
				$customer->status       = "E";				
				$customer->image        = 'default.png';
				$customer->created_by   = $request->created_by;
				$customer->business_id  = $request->business_id;
				$customerResult         = $customer->save();
				$customer_id            = $customer->id;
				
				$name = $request->customer_name;
				$data = ['name'=>$request->customer_name, 'password'=>$password];
				$response = $this->dynamicMail->customerRegisterMail($request->business_id,$name,$password,$customer_email);
				if ($response == false)
				{
					$mail_status = "false";
				}
			}
			if($customer_id)
			{
				$mySettings = settings::select('option_value')->where(['business_id'=>$request->business_id,'option_key'=>"auto_confirm_setting"])->first();

				$SettingValue[]     = json_decode($mySettings->option_value);
				foreach($SettingValue as $new_setting)
		    	{
							$auto_confirm = $new_setting->appointment_auto_confirm;
							$auto_assign  = $new_setting->auto_assign_to_staff;
				}
				if($auto_assign == "true")
				{
					foreach($request->serviceInfo as $new_service)
					{
						$get_service_id = $new_service['id'];
						$book_date      = $new_service['appointmentDate'];
						$book_time      = $new_service['appointmentTimeSlot'];
						$select_staff_id= $new_service['assignedStaff']; 
					}
					if($select_staff_id == NULL)
					{
						$postal_code    = $request->postal_code;
						$getStaff       = new ServiceController;
						$AvilableStaff  = $getStaff->getStaffAvilable($business_id,$get_service_id,$book_date,$book_time,$postal_code,'');
						
				        if (sizeof($AvilableStaff) == 0) {
				          return $this->sendResponse("Not any staff available for this service.",200,false);
				        }
					}
				}
		  		$order = new Order;
		  		$order->business_id        = $request->business_id;
				$order->customer_id        = $customer_id;
				$order->sub_total          = $request->subtotal;
				$order->tax				   = json_encode($request->tax);
			  	$order->discount_amount    = $request->discount_value;  
				$order->discount_value     = $request->discount_value;
				$order->discount_type      = $request->discount_type;
				$order->grand_total        = $request->nettotal;
				$order->order_date         = date('Y-m-d H:i:s');
				$order->discount_code      = $request->coupon_code; 
				$order->booking_address    = $request->customer_appointment_address;
				$order->booking_city       = $request->customer_appointment_city;
				$order->booking_state      = $request->customer_appointment_state;
				$order->booking_zipcode    = $request->customer_appointment_zipcode;
				$order->payment_type       = "cash";
				$order->order_status       = "P";
				$order->booking_notes      = "";
        		$orderResult = $order->save();

				if($orderResult)
				{
					$order_id = $order->id;
					foreach($orderInfo as $all_items)
					{
						if($all_items['assignedStaff'] == null)
						{
							if($auto_confirm == "true")
							{
								$status = "CNF";	
							}
							else
							{
								$status = "P";
							}
						}
						else
						{
							$status = "CNF";
						}
						if(!isset($all_items['tax']))
						{
							$all_items['tax'] = [];
						}
						if($all_items['assignedStaff'] == "")
						{
							$status = "P";
						}
						else
						{
							$status = "CNF";
						}

            			//$sendSMS = new SmsSendController;
						$order_item = new OrderItem;
						$order_item->order_id            = $order_id;
						$order_item->service_id          = $all_items['id'];
						$order_item->service_cost        = $all_items['service_cost'];
						$order_item->service_qty         = $all_items['count']; 
						$order_item->service_time        = $all_items['service_time'];
						$order_item->subtotal	         = $all_items['subtotal'];
						$order_item->discount_type	     = $request->discount_type;
						$order_item->discount_value	     = $request->discount_value;
						$order_item->discount		     = $request->discount_value;
						$order_item->tax			     = json_encode($all_items['tax']);
						$order_item->total_cost          = $request->nettotal;
						$order_item->staff_id            = $all_items['assignedStaff']; 
						$order_item->customer_id         = $customer_id;
						$order_item->order_status        = $status;
						$order_item->notification_status = "UR";
						$order_item->business_id         = $request->business_id;
						$order_item->booking_date        = $all_items['appointmentDate'];
						$order_item->booking_time        = $all_items['appointmentTimeSlot'];
						$order_item->postal_code         = $request->postal_code;
						$order_item->order_by 	         = "self";
						$order_item->save();

						$get_service_id = $all_items['id'];
						$book_date      = $all_items['appointmentDate'];
						$book_time      = $all_items['appointmentTimeSlot'];
						$select_staff_id= $all_items['assignedStaff']; 

		        		$title = "New Order";
				        $commonBody = "New order arrives for confirmation";
				        $adminBody = "New order arrives";
				        $customerBody = "Your order booked successfully";

		        		$admin = User::where('id', $getBusiness->admin_id)->first();
				        $adminNotification = $this->pushNotification($admin->device_token, $title, $adminBody, $order_item, $business_id);
		        		$cusInfo = Customer::where('id' , $order_item->customer_id)->first();
		        		$customerNotification = $this->pushNotification($cusInfo->device_token, $title, $customerBody, $order_item, $business_id);
		        		if($auto_assign == "true")
						{
							if($select_staff_id == NULL)
							{
								$postal_code    = $request->postal_code;
								$getStaff       = new ServiceController;
								$AvilableStaff  = $getStaff->getStaffAvilable($business_id,$get_service_id,$book_date,$book_time,$postal_code,'');
		            			$assignAnyStaff = new AnyStaffAssignBooking;
			            		if (sizeof($AvilableStaff) > 0) {
			              			$order_item->AnyStaff()->attach($AvilableStaff);
			              			foreach ($AvilableStaff as $staff_id) {
			                			$staffInfo = User::where('id', $staff_id)->first();
			                			$staffNotification = $this->pushNotification($staffInfo->device_token, $title, $commonBody, $order_item, $business_id);
			              			}
			            		}
							}
							else
							{
		            			$staffInfo = User::where('id', $order_item->staff_id)->first();
		            			$staffNotification = $this->pushNotification($staffInfo->device_token, $title, $commonBody, $order_item, $business_id);
		          			}
						}
					$customerInfo = Customer::where('id', $order_item->customer_id)->first();
					$serviceInfo = Service::where('id', $order_item->service_id)->first();
					$business_logo = $businessInfo->image;
					$adminInfo = User::where('id', $businessInfo->admin_id)->first();
          			$updateSMS = $this->sendingUpdateSMS($request->business_id);

          			$sendSMS = new DynamicSmsSendController;

					if($updateSMS['customer'] == "1")
					{
						$customerTemplate = DefaultSmsTemplate::where(['sms_template_type'=>"RQ",'user_type'=>"C"])->first();
						if($customerTemplate)
						{
			              $customer_data = [
			                'Client_name' => $customerInfo->fullname,
			                'booking_date' => $order_item->booking_date,
			                'service_name' => $serviceInfo->service_name,
			                'app_remain_time' => '',
			                'admin_name' => '',
			                'msg_temp' => $customerTemplate->sms_message
			              ];
							if($updateSMS['twilio_status'] == "1")
							{
								$twilio_data = [
  								'phone_number'=>$customerInfo->phone,
  								'twilio_sid'=>$updateSMS['twilio_account_sid'],
  								'twilio_token'=>$updateSMS['twilio_auth_token'],
  								'twilio_number'=>$updateSMS['twilio_sender_number']
								];
	              				$sendSMS->smsToCustomer('twilio',$customer_data,$twilio_data,'','');
							}
							if($updateSMS['textlocal_status'] == "1")
							{
								$textlocal_data = [
  								'phone_number'=>$customerInfo->phone,
  								'api_key'=>$updateSMS['textlocal_apikey']
								];
	              				$sendSMS->smsToCustomer('textlocal',$customer_data,'',$textlocal_data,'');
							}
							if($updateSMS['nexmo_status'] == "1")
							{
								$nexmo_data = [
				              		'nexmo_key' => $updateSMS['nexmo_api_key'],
				        			'nexmo_secret' => $updateSMS['nexmo_api_secret'],
				        			'phone_number' => $customerInfo->phone
				            	];
				            	$sendSMS->smsToCustomer('nexmo',$customer_data,'','',$nexmo_data);
							}
						}		
					}

					if($updateSMS['admin'] == "1")
					{
						$adminTemplate = DefaultSmsTemplate::where(['sms_template_type'=>"RQ",'user_type'=>"A"])->first();
						if($adminTemplate)
						{
				              $admin_data = [
				                'admin_name' => $adminInfo->firstname.' '.$adminInfo->lastname,
				                'booking_date' => $order_item->booking_date,
				                'service_name' => $serviceInfo->service_name,
				                'client_name' => '',
				                'app_remain_time' => '',
				                'msg_temp' => $adminTemplate->sms_message
				              ];

							if($updateSMS['twilio_status'] == "1")
							{
								$twilio_data = [
  								'phone_number'=>$updateSMS['admin_phone_number'],
  								'twilio_sid'=>$updateSMS['twilio_account_sid'],
  								'twilio_token'=>$updateSMS['twilio_auth_token'],
  								'twilio_number'=>$updateSMS['twilio_sender_number'],
                  				'country_code'=>$updateSMS['country_code']
								];
								$sendSMS->smsToAdmin('twilio',$admin_data,$twilio_data,'','');
							}		
							if($updateSMS['textlocal_status'] == "1") 
							{
								$textlocal_data = [
  								'phone_number'=>$updateSMS['admin_phone_number'],
  								'api_key'=>$updateSMS['textlocal_apikey']
								];
		            			$sendSMS->smsToAdmin('textlocal',$admin_data,'',$textlocal_data,'');
							}
							if($updateSMS['nexmo_status'] == "1")
							{
								$nexmo_data = [
				              		'nexmo_key' => $updateSMS['nexmo_api_key'],
				        			'nexmo_secret' => $updateSMS['nexmo_api_secret'],
				        			'phone_number' => $updateSMS['admin_phone_number'],
				        			'country_code'=>$updateSMS['country_code']
				            	];
				            	$sendSMS->smsToAdmin('nexmo',$admin_data,'','',$nexmo_data);
							}
						}
					}

					if($updateSMS['staff'] == "1")
					{
						$staffTemplate = DefaultSmsTemplate::where(['sms_template_type'=>"RQ",'user_type'=>"S"])->first();
						if($staffTemplate)
						{
							if($all_items['assignedStaff'] !== NULL || $all_items['assignedStaff'] != "")
							{
				                $staffInfo = User::where('id',$all_items['assignedStaff'])->first();
				                $staff_data = [
				                  'staff_name' => $staffInfo->firstname.' '.$staffInfo->lastname,
				                  'booking_date' => $order_item->booking_date,
				                  'service_name' => $serviceInfo->service_name,
				                  'client_name' => '',
				                  'app_remain_time' => '',
				                  'msg_temp' => $staffTemplate->sms_message
				                ];

								if($updateSMS['twilio_status'] == "1")
								{
									$twilio_data = [
  									'phone_number'=>$staffInfo->phone,
  									'twilio_sid'=>$updateSMS['twilio_account_sid'],
  									'twilio_token'=>$updateSMS['twilio_auth_token'],
  									'twilio_number'=>$updateSMS['twilio_sender_number'],
  	                				'country_code'=>$updateSMS['country_code']
									];
		              				$sendSMS->smsToStaff('twilio',$staff_data,$twilio_data,'',''); 
								}
		
								if($updateSMS['textlocal_status'] == "1")
								{
									$textlocal_data = [
  									'phone_number'=>$staffInfo->phone,
  									'api_key'=>$updateSMS['textlocal_apikey']
									];
									$sendSMS->smsToStaff('textlocal',$staff_data,'',$textlocal_data,'');
								}

								if($updateSMS['nexmo_status'] == "1")
								{
									$nexmo_data = [
				              		'nexmo_key' => $updateSMS['nexmo_api_key'],
				        			'nexmo_secret' => $updateSMS['nexmo_api_secret'],
				        			'phone_number' => $staffInfo->phone,
				        			'country_code'=>$updateSMS['country_code']
				        			];
				            		$sendSMS->smsToStaff('nexmo',$staff_data,'','',$nexmo_data);
								}
							}
							else
							{
								if($auto_assign == "true")
								{
									if (sizeof($AvilableStaff) > 0) 
									{
										foreach($AvilableStaff as $myStaff)
										{
											$staffInfo = User::where('id',$myStaff)->first();
                      						$staff_data = [
							                        'staff_name' => $staffInfo->firstname.' '.$staffInfo->lastname,
							                        'booking_date' => $order_item->booking_date,
							                        'service_name' => $serviceInfo->service_name,
							                        'client_name' => '',
							                        'app_remain_time' => '',
							                        'msg_temp' => $staffTemplate->sms_message
                      							];

											if($updateSMS['twilio_status'] == "1")
											{
												$twilio_data = [
	  												'phone_number'=>$staff_phone,
	  												'twilio_sid'=>$updateSMS['twilio_account_sid'],
	  												'twilio_token'=>$updateSMS['twilio_auth_token'],
	  												'twilio_number'=>$updateSMS['twilio_sender_number'],
  				                					'country_code'=>$updateSMS['country_code']
													];
					              				$sendSMS->smsToStaff('twilio',$staff_data,$twilio_data,'','');
											}
		
											if($updateSMS['textlocal_status'] == "1")
											{
												$textlocal_data = [
  												'phone_number'=>$staff_phone,
  												'api_key'=>$updateSMS['textlocal_apikey']
												];
												$sendSMS->smsToStaff('textlocal',$staff_data,'',$textlocal_data,'');
											}

											if($updateSMS['nexmo_status'] == "1")
											{
												$nexmo_data = [
								              		'nexmo_key' => $updateSMS['nexmo_api_key'],
								        			'nexmo_secret' => $updateSMS['nexmo_api_secret'],
								        			'phone_number' => $staff_phone,
								        			'country_code'=>$updateSMS['country_code']
							            			];
							            		$sendSMS->smsToStaff('nexmo',$staff_data,'','',$nexmo_data);
											}
										}
									}
								}
							}
						}
					}
						$order_item = $order_item->id;
						if($emailCheck['customer'] == "1")
						{
							$this->mailToCustomer($order_item,$request->business_id,$customer_email);
						}
						if($emailCheck['admin'] == "1")
						{
							$this->mailToAdmin($order_item,$request->business_id);
						}
						if($emailCheck['staff'] == "1")
						{
							if($select_staff_id !== null)
							{
								$this->mailToSingleStaff($order_item,$request->business_id,$all_items['assignedStaff']);
							}
							else
							{
								if($auto_assign == "true")
								{
									if(sizeof($AvilableStaff)>0)
									{
										if($emailCheck['staff'] == "1")
										{
											$this->mailToAnyStaff($order_item,$request->business_id,$AvilableStaff);
										}
									}
								}
							}
						}

						$galog = new GaLogs;
						$galog->order_item_id = $order_item;
						$galog->status        = $status;
						$galog->user_type     = $log_status;
						$galog->save();
						
						$payment = new Payments;
						$payment->order_item_id = $order_item;
						$payment->payment_mode = $request->payment_method;
						$payment->transaction_id = $request->transaction_id;
						$payment->reference_id  = $request->reference_id;
						$payment->payment_date = $request->payment_datetime;
						$payment->amount       = $all_items['totalCost'];
						if($request->payment_method == "Paypal" || $request->payment_method == "Stripe" || $request->payment_method == "PayUMoney")
						{
							$payment->payment_status = "paid";	
						}
						else
						{
							$payment->payment_status = "unpaid";
						}
						
						$payment->payment_notes = "test payment note";
						$payment->service_id    = $all_items['id'];
						$payment->customer_id   = $customer_id;
						$payment->business_id  = $request->business_id;

						$payment->save();
					}
					return $this->sendResponse("order created.");
				}
			}
			else
			{
				return $this->sendResponse("something went wroung.",200,false);
			}
		}
	}
	public function orderItemEdit(Request $request)
	{
			/*$this->validate($request, [
				'order_id'					=>'required',
				'order_item_id'			=> 'required'
				]);*/
				
			$tax = json_encode($request->tax);
			$serviceInfo = $request->serviceInfo;
			foreach($request->serviceInfo as $new_service_data)
			{
					$service_id = $new_service_data['id'];
					$service_cost = $new_service_data['service_cost'];
					$service_time = $new_service_data['service_time'];
					$total_cost   = $new_service_data['totalCost'];
					$staff_id     = $new_service_data['assignedStaff'];
					$booking_date = $new_service_data['appointmentDate'];
					$booking_time = $new_service_data['appointmentTimeSlot'];
					
			}
			$created_by = $request->created_by;
			$customer_id = $request->customer_id;
			$orderArray = [	'sub_total'=>$request->subtotal,
											'order_date'=>$request->order_date,
											'discount_amount'=>$request->discount,
											'tax'=>$tax,
											'grand_total'=>$request->nettotal,
											'discount_code'=>$request->coupon_code,
											'booking_address'=>$request->customer_appointment_address,
											'booking_city'=>$request->customer_appointment_city,
											'booking_state'=>$request->customer_appointment_state,
											'booking_zipcode'=>$request->customer_appointment_zipcode
										];
										
										
			$orderItemArray = ['service_id'=>$service_id,
													'service_cost'=>$service_cost,
													'service_time'=>$service_time,
													'total_cost'=>$total_cost,
													'staff_id'=>$staff_id,
													'booking_date'=>$booking_date,
													'booking_time'=>$booking_time
													];
													
			$customerArray  = ['fullname'=>$request->customer_name,
													'email'=>$request->customer_email,
													'phone'=>$request->customer_phone,
													'zip'=>$request->appointment_zipcode,
													'address'=>$request->appointment_address,
													'city'=>$request->appointment_city,
													'state'=>$request->appointment_state
													];										
													
			$resultOne   = Order::where('id',$request->order_id)->update($orderArray);											
			$resultTwo   = OrderItem::where('id',$request->order_item_id)->update($orderItemArray);
			$resultThree = Customer::where('id',$request->customer_id)->update($customerArray); 
			
			if($resultOne == "1" && $resultTwo == "1" && $resultThree == "1")
			{
					$galog = new GaLogs;
					$galog->order_item_id = $request->order_item_id;
					$galog->status        = "MOD";
					$galog->user_type     = "A";
					$galog->save();
					return $this->sendResponse("order updated.");
			}	
			else
			{
				return $this->sendResponse("order not updated.",200,false);
			}			
	}
	public function sendingOrderMail($business_id)
	{
		$emailSetting = new EmailSendSettingController;
		$data = $emailSetting->checkEmailBooked($business_id);
		return $data;
	}
	public function getCoupon(Request $request)
	{
		$now = Carbon::now();
		$coupon = Discount_coupon::where(['coupon_code'=> $request->coupon_code])->where('status','Active')->where('business_id',$request->business_id)->where('coupon_max_redemptions', '>=', 'coupon_used')->where('coupon_valid_from', '<=', $now)->where('coupon_valid_till', '>=', $now)->first();

		if(!empty($coupon)) {
			if(!empty($coupon->service_id)){
				$serviceArr = explode(",", $coupon->service_id);
				if(in_array($request->service_id, $serviceArr)){
					$update = [];
					$update['coupon_used'] = $coupon->coupon_used + 1;
					Discount_coupon::where('id',$coupon->id)->update($update);

					return $this->sendResponse($coupon);
					
				} else {
					return $this->sendResponse("coupon not found.",200,false);
				}	
			}
			return $this->sendResponse($coupon);
		} else {
			return $this->sendResponse("coupon not found.",200,false);
		}
		
	}
	public function sendingUpdateSMS($business_id)
    {
      $smsSetting = new SmsSendSettingController;
      $data = $smsSetting->getBookUpdateSmsSetting($business_id);
      return $data;
    }
    public function mailToCustomer($order_item_id,$business_id,$customer_email)
	{
		$customerMail = DefaultEmailTemplate::where(['user_type'=>"C","email_template_type"=>"RQ"])->first();
		if($customerMail)
		{
			$template = $customerMail->email_message;
			$subject  = $customerMail->email_subject;
			$response = $this->dynamicMail->mailSendToCustomer($order_item_id,$template,$subject,$customer_email);
		}
	}
	public function mailToSingleStaff($order_item_id,$business_id,$staff_id)
	{
		$staffEmail = DefaultEmailTemplate::where(['user_type'=>"S","email_template_type"=>"RQ"])->first();
		if($staffEmail)
		{
			$staff = User::select('email','firstname','lastname')->where('id',$staff_id)->first();
			$template = $staffEmail->email_message;
			$subject  = $staffEmail->email_subject;
			$response = $this->dynamicMail->mailSendToStaff($order_item_id,$template,$subject,$staff->email);
		}
	}
	public function mailToAdmin($order_item_id,$business_id)
	{
		$adminEmail = DefaultEmailTemplate::where(['user_type'=>"A","email_template_type"=>"RQ"])->first();
		if($adminEmail)
		{
			$myBusiness = Business::where('id',$business_id)->first();
			$adminget = User::where('id',$myBusiness->admin_id)->first();
			$template = $adminEmail->email_message;
			$subject  = $adminEmail->email_subject;
			$response = $this->dynamicMail->mailSendToAdmin($order_item_id,$template,$subject,$adminget->email);
		}
	}
	public function mailToAnyStaff($order_item_id,$business_id,$staff_ids)
	{
		$staffEmail = DefaultEmailTemplate::where(['user_type'=>"S","email_template_type"=>"RQ"])->first();
		if($staffEmail)
		{
			$id = $staff_ids;
			$staff = User::select('email','firstname','lastname')->whereIn('id',$id)->get();
			$template = $staffEmail->email_message;
			$subject  = $staffEmail->email_subject;
			foreach($staff as $new_staff)
			{
				$response = $this->dynamicMail->mailSendToStaff($order_item_id,$template,$subject,$new_staff['email']);
			}
			
		}
	}
}
?>    