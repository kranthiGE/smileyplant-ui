# SmartIrrigation
Automated watering of plants using raspberry pi, AWS cloud and mobile application

### Features
- Automated watering of plants in urban cities especially that runs using raspberry pi everyday at a given time
- program can be configured to increase the amount of running time of motor based on number of plant pots
- exploring options to connect to mobile phone, so that it can be monitored from anywhere

### Draft circuit diagram

### UAA
1. Create a UAA instance following [these steps](https://www.predix.io/docs/?r=250183#XpKGAdQ7-Q0CoIStl).
	* Note: Make a note of the client secret; you will need it later.
2. Get the url of that UAA instance
	1. Locate any application you have running on cloud foundry.  If you don't have one, you'll have to push some app up there.
	2. Follow [these steps](https://www.predix.io/docs/?r=250183#sXp7cw5P-Q0CoIStl) to bind your dummy app to UAA.
	3. Save the uri and issuerId of your UAA instance.

### Views
Create a Views instance following [these steps](https://www.predix.io/docs/?r=250183#yyKdebUl).  Use the UAA issuerId that you gathered above for your trusted issuer.
* Note: You must use underscores in your service instance name currently (my_view_service, NOT my-view-service)

### Redis
Create a Redis instance, which is used by nginx for storing your session.
```
cf cs redis <plan> <instance_name>
```
1. Update manifest.yml

	You'll need to change these fields in your manifest.yml before pushing to the cloud.
	```
	  - name: my-predix-seed # change this to your application name
	    services:
	            - your_redis_instance # change this to your redis service instance name
	            - your_view_service_instance # change this to your view service instance name
	    env:
	      UAA_SERVER_URL: https://your-uaa-instance.grc-apps.svc.ice.ge.com # change to your UAA instance url
	      REDIS: redis # change this to the name of the Redis service in your marketplace (when you do cf m).  It may be redis, or something else
2. Make a unique session_secret and set it in nginx.conf.

	```
	# example, for Mac
	openssl rand -base64 32
	```
	```
	set $session_secret <my-session-secret>;
## Set up UAA client
You are not able to see the login page because you have a fresh UAA instance which is not setup with an OAuth2 client.

1. Target your UAA and Log in as Admin
Follow [these steps](https://www.predix.io/docs/?r=913171#JA5oCs7).  You will need the UAA uri and client secret that you saved previously.

2. Create OAuth2 client

	First, you will need to generate a client secret and save it for later.
	```
	# example, for Mac
	openssl rand -base64 32
	```
	Next, we will continue using uaac to add a client for your application.  Use the interactive mode (-i) to add your client.
	```
	uaac client add <your-client> -i
	```
	At the prompts, specify:
	* client secret: the secret that you generated above
	* scope: openid scim.me
	* authorized grant types: refresh_token authorization_code
	* authorities: openid scim.me uaa.resource
	* autoapprove: openid scim.me
	* just hit return for any other options

	See [the documentation](https://www.predix.io/docs/?r=913171#uAyBrT9y) for more detailed information about creating clients and the UAA options.

3. Update nginx.conf with your client

	Change the $client_id in nginx.conf to the client name you just created.
	```
	set $client_id <your-client>;
	```
	Generate the UAA authorization header for your client by base64 encoding your client and client's secret.
	```
	base64 encode the following string: "<client-name>:<client secret>"
	```
	Finally, set the $uaa_authorization_header to Basic authentication with this header.
	```
	set $uaa_authorization_header  "Basic <your-auth-header>";
	```
4. cf push

	If you cf push again, you should now be successfully redirected to a login page, but you don't have anyone to log in as.
## Set up authorized user
Now that you can see the login page, let's set up a user that we can log in with.

1. Add a user

	Add a user to your UAA instance by providing a user name, email address, and password.
	```
	uaac user add rocket --emails rocket@example.com -p Gu@rdian5
	```

2. cf push

	Now when you cf push, you should be able to login as the user you set up above.  After you login, you should be redirected back to the seed application where you can see the blank page and dashboard.  But, when you select a context, you don't have any views displayed.
### Give user permission to see views
The first thing we need to do is give our dummy user permission to see the views, which the following steps walk you through.  For more information on creating groups and scopes, see [the documentation](https://www.predix.io/docs/?r=913171#RulzoBew).

1. Create a group in your UAA instance for views
	```
	uaac group add views.zones.<your-views-instance-id>.user

	# example:
	uaac group add views.zones.1234567890.user
	```
2. Add the user(s) you created earlier to this group
	```
	uaac member add views.zones.<your-views-instance-id>.user <your-user>

	# example:
	uaac member add views.zones.1234567890.user rocket
	```
3. Update your client scope to include this group

	Use uaac to get your current client scope, and add the group you just created to this list.
	```
	uaac client get <your-client>
	uaac client update <your-client> --scope views.zones.<your-views-instance-id>.user,<other>,<scopes>

	# example:
	uaac client update my-client --scope openid,views.zones.123456790.user,scim.me
	```
4. Update your client autoapprove to include this group

	Use uaac to get your current client autoapprove, and add the group you just created to this list.
	```
	uaac client get <your-client>
	uaac client update <your-client> --autoapprove views.zones.<your-views-instance-id>.user,<other>,<autoapproves>

	# example:
	uaac client update <your-client> --autoapprove openid,scim.me,views.zones.<your-views-instance-id>.user
	```
